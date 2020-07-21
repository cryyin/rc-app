import getProcedureConfig from "@/utils/sqlUtils";

/**
 * 存储过程自定义参数
 * 可以打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 * filter自己定义，即该项作为筛选框条件出现, order代表顺序（左到右,上到下递增),
 * child表示关联关系，child内容随当前filter更新,暂时只支持一个依赖
 *
 * @type {({name: string, type: string}|{name: string, type: string}|{name: string, type: string}|{filter: {order: number}, name: string, type: string}|{filter: {dep: number, order: number}, name: string, type: string})[]}
 */
export const listParams = [
    {name: 'IN_MONTH         ', type: 'VARCHAR2'},
    {name: 'IN_ID            ', type: 'VARCHAR2',  defaultValue: '2'},
    {name: 'IN_SEARCH_TYPE   ', type: 'VARCHAR2'},
    {name: 'IN_CAL_AREA      ', type: 'VARCHAR2', filterItem: {order: 1, child: 2}},
    {name: 'IN_OPERATE_UNIT  ', type: 'VARCHAR2', filterItem: {order: 2}},
    {name: 'IN_CUSTOMER_NAME ', type: 'VARCHAR2'},
    {name: 'IN_IS_LAWSUIT    ', type: 'VARCHAR2'},
    {name: 'IN_AR_SCALE      ', type: 'VARCHAR2'},
    {name: 'IN_COOP_STATUS   ', type: 'VARCHAR2'},
    {name: 'IN_FLAG          ', type: 'VARCHAR2'}
    ];

const filterParam = [
    {name:'IN_MONTH         ',type:'NUMBER'  },
    {name:'IN_DIM_TYPE_CODE ',type:'VARCHAR2'},
    {name:'IN_EXPAND_1      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_2      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_3      ',type:'VARCHAR2'}
    ];

const filterProcedure = 'PKG_RC_DIGITAL_WARNING.SP_RC_SELECT'
export const filterConfig = getProcedureConfig( filterProcedure,filterParam, true)

const listProcedure = 'PKG_RC_DIGITAL_WARNING.SP_RC_MAIN_TABLE1'
export const listConfig = getProcedureConfig(listProcedure, listParams, false)

