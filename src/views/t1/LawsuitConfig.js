/**
 * 配置见说明文档
 */
export const listParams = [
    {name: 'IN_STYLE         ', type: 'VARCHAR2'},
    {name: 'IN_SEARCH_TYPE   ', type: 'VARCHAR2'},
    {name: 'IN_CAL_AREA      ', type: 'VARCHAR2', filter: {id: 1, label: '二级公司'}},
    {name: 'IN_SEG_ORG_KEY   ', type: 'VARCHAR2', filter: {id: 2, label: '经营单位', deps: 1}},
    {name: 'IN_CUSTOMER_NAME ', type: 'VARCHAR2', filter: {id: 3, label: '客户名称',dynamic: 'IN_EXPAND_3'}},
    {name: 'IN_RISK_IS_END   ', type: 'VARCHAR2', filter: {id: 5, label: '是否已结案'}},
    {name: 'IN_FLAG          ', type: 'VARCHAR2'}
];

const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_LAWSUIT_SEARCH'

export default {
    listParams, listProcedureName
}
