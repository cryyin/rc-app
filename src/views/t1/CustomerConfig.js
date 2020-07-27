/**
 * 配置见说明文档
 */
export const listParams = [
    {name: 'IN_ID           ', type: 'VARCHAR2'},
    {name: 'IN_SELECT_TYPE  ', type: 'VARCHAR2', filter: {id: 7, label: '筛选类别', defaultValue: '客户名称'}},
    {name: 'IN_SELECT       ', type: 'VARCHAR2', filter: {id: 8, label: '', deps: 7, skipInit: true, dynamic: 'IN_EXPAND_2'}},
    {name: 'IN_MANAGEMENT_FORMS   ', type: 'VARCHAR2', filter: {id: 9, label: '经营状态'}},
    {name: 'IN_INDUSTRY_CATEGORY  ', type: 'VARCHAR2', filter: {id: 10, label: '所属行业', code:'D010'}}
    ];

const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_CUSTOMER_DETAIL'

export default {
    listParams, listProcedureName
}
