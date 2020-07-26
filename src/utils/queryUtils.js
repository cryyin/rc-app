// 数据库schema名称
import {getLastYearMonth} from "@/utils/dateUtils";
import {DATA_SOURCE} from "@/store";

export const schemaName = 'PRD_RC';
// 远程get地址
export const URL = '/rc/call'
// 存储过程通用参数
export const commonParams = [
    {name: 'IN_USER_GROUP', type: 'VARCHAR2', value: ""},
    {name: 'IN_DATA_SOURCE', type: 'VARCHAR2', value: DATA_SOURCE}
]
// 分页参数
export const pageParams = [
    {name: 'IN_ROWNB_BEGIN', type: 'NUMBER', value: 0},
    {name: 'IN_ROWNB_END', type: 'NUMBER', value: 10}
]
// 存储过程输出参数名称
export const outParamName = 'OUT_DATASET'

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
        value = e.defaultValue || value
        return {...e, name, type, value};
    });
    // 插入通用的IN_MONTH, 默认是VARCHAR2
    if (customParams[0].name !== 'IN_MONTH') {
        const lastYearMonth = getLastYearMonth();
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
            p.filter.code = p.filter.code || 'D00' + p.filter.id
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
        if (e.deps) {
            depFilters.push(item)
            beDepIds.add(e.deps);
            // 存在既有依赖又是动态的筛选框，如果想节省空间的话，可以考虑优化一下数据结构
            if (e.dynamic) {
                dynamicFilters.push(item)
            }
        } else if (e.dynamic) {
            dynamicFilters.push(item)
        } else {
            muteFilters.push(item)
        }
    })
    // 初始化动态筛选框的默认依赖值
    const initDynamicDepInfo = {}
    const beDepItemFilter = {}
    filterItems.filter(i => beDepIds.has(i.filter.id)).map(i => i.filter).forEach(f => {
        beDepItemFilter[f.id] = f
    })
    depFilters.map(i => i.filter).filter(f => f.dynamic && beDepItemFilter[f.deps]).forEach(f => {
        initDynamicDepInfo[f.id] = beDepItemFilter[f.deps].defaultValue
    })
    return {muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo}
}

/**
 * 一次性返回RcTable用到的配置项
 *
 * @param {Object} props
 * @returns {{depFilters: *[], filterSql: String, muteFilters: *[], initFilterParams: {}, columns: *, filterItems: [], listSql: String, beDepIds: Set<*>, dynamicFilters: *[], rowKey: *, initListParams: *, initDynamicDepInfo}}
 */
const parseTableConfig = (props) => {
    console.log('开始解析')
    const {columns, fixedParams, tableConfig} = props
    // 读取表单存储过程信息
    const {listParams, listProcedureName, filterParams, filterProcedureName, rowKey} = tableConfig

    /** =======生成表单配置 开始======= */
    const listConfig = getProcedureConfig(listProcedureName, listParams, false);
    // 表单查询初始参数=存储过程默认参数 + 父组件传递的固定参数

    const initListParams = {...listConfig.params, ...fixedParams}
    /** ======生成表单配置  结束====== */

    /** ======生成筛选框配置 开始====== */
    const filterConfig = getProcedureConfig(filterProcedureName, filterParams, true)

    const {sql: filterSql, params: initFilterParams} = filterConfig
    const {filterItems, sql: listSql} = listConfig

    // 筛选框分类处理：默认、依赖、动态
    const {muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo} = classifyFilterItem(filterItems);

    /** ======生成筛选框配置 结束====== */

    return {
        columns, rowKey, filterItems, listSql, initListParams,
        filterSql, initFilterParams, muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo
    }
}

export default parseTableConfig;
