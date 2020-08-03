/**
 * 配置见说明文档
 */
export const listParams = [
    {name: 'IN_ID           ', type: 'VARCHAR2'},
    {
        name: 'IN_TYPE', type: 'VARCHAR2', filter: {
            id:1000, type: 'radio', searchOnChange: true, defaultValue: 1, options: [{value:1, label:'控制人'},{value:2, label:'对外投资'}]
        }
    }
];

const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_shareholder_Foreign'

export default {
    listParams, listProcedureName, showSearch: false, showAll: true
}
