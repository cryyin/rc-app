// 数据库schema名称
import {getYearMonth} from "@/utils/dateUtils";
import {getDataSource, getUserLoginId} from "@/store";
import {call} from "@/api";

export const schemaName = 'PRD_RC';
// 远程get地址
export const URL = '/rc/call'
// 存储过程通用参数
export const commonParams = [
    {name: 'IN_USER_GROUP', type: 'VARCHAR2', value: getUserLoginId()},
    {name: 'IN_DATA_SOURCE', type: 'VARCHAR2', value: getDataSource()}
]
// 分页参数
export const pageParams = [
    {name: 'IN_ROWNB_BEGIN', type: 'NUMBER', value: 0},
    {name: 'IN_ROWNB_END', type: 'NUMBER', value: 10}
]
// 存储过程输出参数名称
export const outParamName = 'OUT_DATASET'

// 默认筛选框sql
const defaultFilterSql = 'call PRD_RC.PKG_RC_DIGITAL_WARNING.SP_RC_SELECT(#{IN_MONTH,mode=IN,jdbcType=VARCHAR},#{IN_DIM_TYPE_CODE,mode=IN,jdbcType=VARCHAR},#{IN_EXPAND_1,mode=IN,jdbcType=VARCHAR},#{IN_EXPAND_2,mode=IN,jdbcType=VARCHAR},#{IN_EXPAND_3,mode=IN,jdbcType=VARCHAR},#{IN_USER_GROUP,mode=IN,jdbcType=VARCHAR},#{IN_DATA_SOURCE,mode=IN,jdbcType=VARCHAR},#{OUT_DATASET,mode=OUT,jdbcType=CURSOR,javaType=ResultSet,resultMap=map})'
const defaultFilterParams = {
    IN_MONTH: getYearMonth(),
    IN_DIM_TYPE_CODE: "",
    IN_EXPAND_1: "",
    IN_EXPAND_2: "",
    IN_EXPAND_3: "",
    IN_USER_GROUP: getUserLoginId(),
    IN_DATA_SOURCE: getDataSource()
}
/**
 * 转换为真正的参数数组
 *
 * @example
 *
 * [{name: 'IN_MONTH         ', type: 'VARCHAR2'}]
 * =>
 * [{name: 'IN_MONTH, type: 'VARCHAR2', value: ""}]
 *
 * @param {Array} rawParams 复制粘贴生成的存储过程参数数组
 * @param {Boolean} isFilter 是否是筛选框参数，否的话需要添加分页参数
 * @return {Array} 真实的参数数组
 */
export const getProcedureInParams = (rawParams, isFilter = false) => {
    const customParams = rawParams.map(e => {
        const name = e.name.trim();
        const type = e.type.trim();
        // 默认值
        let value = "";
        if (type === 'NUMBER') {
            value = 0;
        }
        // IN_SEARCH_TYPE默认为1
        if (name === 'IN_SEARCH_TYPE'){
            value = '1';
        }
        value = e.defaultValue || (e.filter && e.filter.defaultValue) || value
        return {...e, name, type, value};
    });
    // 插入通用的IN_MONTH, 默认是VARCHAR2
    if (customParams[0].name !== 'IN_MONTH') {
        const lastYearMonth = getYearMonth();
        customParams.unshift({name: 'IN_MONTH', type: 'VARCHAR2', value: lastYearMonth})
    }
    if (isFilter) {
        // 仅仅添加通用参数
        return customParams.concat(commonParams);
    } else {
        // 额外添加翻页参数
        return customParams.concat(commonParams).concat(pageParams);
    }
}

/**
 * 构造具体的存储过程
 * @param {String} procedureName 存储过程名称，包括
 * @param {Array}  inParams 存储过程入参
 * @return {String}具体的存储过程sql语句
 */
const getProcedureSql = (procedureName, inParams) => {
    let inParamsStr = ''
    // 入参构造
    inParams.forEach(p => {
        // Oracle类型转为java类型
        let jdbcType = 'VARCHAR'
        if (p.type === 'NUMBER') {
            jdbcType = 'NUMERIC'
        }
        inParamsStr += `#{${p.name},mode=IN,jdbcType=${jdbcType}},`
    });
    // 输出参数
    const outParam = `#{${outParamName},mode=OUT,jdbcType=CURSOR,javaType=ResultSet,resultMap=map}`
    return `call ${schemaName}.${procedureName}(${inParamsStr + outParam})`
}
/**
 * 根据原始参数构造存储过程配置信息对象
 *
 * 原始参数获取方式参考：
 * 打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 *
 * @example 见主表单一相关代码
 *
 * @param {Array} rawParams 原始参数
 * @param {String} procedureName 原始参数
 * @param {Boolean} isFilter 是否是
 * @return {Object} 存储过程配置信息
 */
export const getProcedureConfig = (procedureName, rawParams, isFilter = false) => {
    const inParams = getProcedureInParams(rawParams, isFilter)
    const params = {}
    const filterItems = []
    inParams.forEach(p => {
        params[p.name] = p.value
        if (p.filter) {
            // IN_DIM_TYPE_CODE默认为D00+id
            const codePrefix = p.filter.id < 10 ? 'D00' : 'D0';
            p.filter.code = p.filter.code || codePrefix + p.filter.id
            filterItems.push(p);
        }
    })
    const sql = getProcedureSql(procedureName, inParams)
    if (isFilter) {
        return {
            sql, params
        }
    }
    return {
        sql, params, filterItems
    }
}
/**
 * 将筛选框分类分类
 * @param {Array} filterItems
 * @returns {{muteFilters: [], dynamicFilters: [], beDepIds: Set<any>, depFilters: []}}
 */
export const classifyFilterItem = (filterItems) => {
    // 所有的筛选框
    const filters = []
    // 仅需初始化一次的筛选框
    const muteFilters = []
    // 依赖其他筛选框值的筛选框
    const depFilters = []
    // 如动态选项的Select组件
    const dynamicFilters = []
    // 被依赖的id
    const beDepIds = new Set()
    filterItems.forEach(item => {
        const e = item.filter
        filters.push(e)
        if (e.deps) {
            depFilters.push(e)
            beDepIds.add(e.deps);
            // 存在既有依赖又是动态的筛选框，如果想节省空间的话，可以考虑优化一下数据结构
            if (e.dynamic) {
                dynamicFilters.push(e)
            }
        } else if (e.dynamic) {
            dynamicFilters.push(e)
        } else {
            muteFilters.push(e)
        }
    })
    // 初始化动态筛选框的默认依赖值
    const initDynamicDepInfo = {}
    const beDepItemFilter = {}
    filters.filter(f => beDepIds.has(f.id)).forEach(f => {
        beDepItemFilter[f.id] = f
    })
    depFilters.filter(f => f.dynamic && beDepItemFilter[f.deps]).forEach(f => {
        initDynamicDepInfo[f.id] = beDepItemFilter[f.deps].defaultValue
    })
    return {muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo}
}


/**
 * 一次性返回RcTable用到的配置项
 * @param fixedParams
 * @param tableConfig
 * @return {{filterSql: string, listSql: String, setFilterOptions: setFilterOptions, initDynamicDepInfo, depFilters: *[], muteFilters: *[], initFilterParams: {IN_EXPAND_3: string, IN_DATA_SOURCE: string, IN_DIM_TYPE_CODE: string, IN_EXPAND_1: string, IN_EXPAND_2: string, IN_MONTH: string, IN_USER_GROUP: string}, filterItems: [], beDepIds: Set<*>, initDepIds: *[], dynamicFilters: *[], rowKey: *, initListParams}}
 */
const parseTableConfig = (fixedParams, tableConfig) => {
    console.log('开始解析')
    // 读取表单存储过程信息
    const {listParams, listProcedureName, filterParams, filterProcedureName, rowKey} = tableConfig

    /** =======生成表单配置 开始======= */
    const listConfig = getProcedureConfig(listProcedureName, listParams, false);
    // 表单查询初始参数=存储过程默认参数 + 父组件传递的固定参数

    const initListParams = {...listConfig.params, ...fixedParams}
    /** ======生成表单配置  结束====== */

    /** ======生成筛选框配置 开始====== */
    const filterConfig = (filterParams && filterProcedureName) ?
        getProcedureConfig(filterProcedureName, filterParams, true) : {
            sql: defaultFilterSql,
            params: defaultFilterParams
        }

    const {sql: filterSql, params: initFilterParams} = filterConfig
    const {filterItems, sql: listSql} = listConfig

    // 筛选框分类处理：默认、依赖、动态
    const {muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo} = classifyFilterItem(filterItems);

    const initDepIds = depFilters.filter(f => !f.skipInit).map(f => f.id);
    /** ======生成筛选框配置 结束====== */

    /**
     *
     * @param {Array} filters 筛选框列表
     * @param {Function} setter 筛选框setState钩子
     * @param {Object} extraParams 额外的查询查数
     * @param {Function || undefined }cb
     */
    const setFilterOptions = (filters, setter, extraParams = {}, cb = undefined) => {
        // 传入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(f => {
            const requestParams = {...initFilterParams, ...extraParams, IN_DIM_TYPE_CODE: f.code}
            console.log('筛选框请求参数')
            console.log(filterSql)
            console.log(requestParams)
            call(filterSql, requestParams).then(r => {
                const result = r.data
                setter(prevState => {
                    return {...prevState, [result.IN_DIM_TYPE_CODE]: r.data.OUT_DATASET}
                })
                if (cb){
                    cb(r.data);
                }
            })
        })
    }

    return {
        rowKey, filterItems, listSql, initListParams, filterSql, initFilterParams,
        muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo, initDepIds, setFilterOptions
    }
}

export default parseTableConfig;
