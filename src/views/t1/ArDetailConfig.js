/**
 * 配置见说明文档
 */
export const listParams = [
    {name: 'IN_ID            ', type: 'VARCHAR2'},
    {name: 'IN_SEARCH_TYPE   ', type: 'VARCHAR2'},
    {name: 'IN_CAL_AREA      ', type: 'VARCHAR2', filter: {id: 1, label: '二级公司'}},
    {name: 'IN_OPERATE_UNIT  ', type: 'VARCHAR2', filter: {id: 2, label: '外运公司', deps: 1}},
    {name: 'IN_CUSTOMER_NAME ', type: 'VARCHAR2', filter: {id: 11, label: '客户名称',type:'autoComplete',dynamic: 'IN_EXPAND_3'}},
    {name: 'IN_IS_LAWSUIT    ', type: 'VARCHAR2', filter: {id: 12, label: '是否有诉讼纠纷'}},
    {name: 'IN_AR_SCALE      ', type: 'VARCHAR2', filter: {id: 13, label: '应收账款规模'}},
    {name: 'IN_COOP_STATUS   ', type: 'VARCHAR2', filter: {id: 14, label: '合作情况'}},
    {name: 'IN_FLAG          ', type: 'VARCHAR2'}
    ];

const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_AR_DETAIL'

export default {
    listParams, listProcedureName
}
