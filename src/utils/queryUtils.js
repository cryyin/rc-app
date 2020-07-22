// 数据库schema名称
export const schemaName = 'PRD_RC';
// 远程get地址
export const URL = '/rc/call'
// 存储过程通用参数
export const commonParams = [
    {name:'IN_USER_GROUP', type: 'VARCHAR2', value: ""},
    {name:'IN_DATA_SOURCE', type: 'VARCHAR2', value: "TEST"}
]
// 分页参数
export const pageParams = [
    {name:'IN_ROWNB_BEGIN', type: 'NUMBER', value: 0},
    {name:'IN_ROWNB_END', type: 'NUMBER', value: 10}
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
export const getProcedureInParams = (rawParams, isFilter=false) =>{
    const customParams =  rawParams.map(e=>{
        const name = e.name.trim();
        const type = e.type.trim();
        // 默认值
        let value = "";
        if (type === 'NUMBER'){
            value = 0;
        }
        value = e.defaultValue || value
        return {...e, name, type, value};
    });
    if (isFilter){
        // 仅仅添加通用参数
        return customParams.concat(commonParams);
    }else {
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
const getProcedureSql = ( procedureName, inParams) =>{
    let inParamsStr = ''
    // 入参构造
    inParams.forEach(p => {
        // Oracle类型转为java类型
        let jdbcType = 'VARCHAR'
        if (p.type==='NUMBER'){
            jdbcType = 'NUMERIC'
        }
        inParamsStr+=`#{${p.name},mode=IN,jdbcType=${jdbcType}},`
    });
    // 输出参数
    const outParam = `#{${outParamName},mode=OUT,jdbcType=CURSOR,javaType=ResultSet,resultMap=map}`
    return `call ${schemaName}.${procedureName}(${inParamsStr+outParam})`
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
export const getProcedureConfig = (procedureName, rawParams, isFilter=false) =>{
    const inParams = getProcedureInParams(rawParams, isFilter)
    const params = {}
    const filterItems = []
    inParams.forEach(p=>{
        params[p.name]=p.value
        if (p.filter){
            // IN_DIM_TYPE_CODE默认为D00+id
            p.filter.code = p.filter.code || 'D00'+p.filter.id
            filterItems.push(p);
        }
    })
    const sql = getProcedureSql(procedureName, inParams)
    if (isFilter){
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
 * @returns {{muteFilters: [], dynamicFilters: [], beDepIds: Set<any>, depIFilters: []}}
 */
export const classifyFilterItem = (filterItems) => {
    // 仅需初始化一次的筛选框
    const muteFilters = []
    // 依赖其他筛选框值的筛选框
    const depIFilters = []
    // 如动态选项的Select组件
    const dynamicFilters = []
    // 被依赖的id
    const beDepIds = new Set()
    filterItems.forEach(item=>{
        const e = item.filter
        if (e.deps){
            depIFilters.push(item)
            beDepIds.add(e.deps)
        }else if(e.dynamic){
            dynamicFilters.push(item)
        }else {
            muteFilters.push(item)
        }
    })
    return {muteFilters, depIFilters, dynamicFilters, beDepIds}
}

export default getProcedureConfig;
