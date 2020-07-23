import {getLastYearMonth} from "@/utils/dateUtils";

const lastYearMonth = getLastYearMonth();
/**
 * 存储过程自定义参数
 * 可以打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 * filter自己定义，即该项作为筛选框条件出现, id值大小代表顺序（左到右,上到下递增),
 * deps表示当前筛选框依赖其他筛选框的值,暂时只考虑支持一个依赖
 *
 * @type {({name: string, type: string}|{name: string, type: string}|{name: string, type: string}|{filter: {order: number}, name: string, type: string}|{filter: {dep: number, order: number}, name: string, type: string})[]}
 */
export const listParams = [
    {name: 'IN_MONTH         ', type: 'VARCHAR2', defaultValue: lastYearMonth},
    {name: 'IN_STYLE         ', type: 'VARCHAR2',  defaultValue: '2'},
    {name: 'IN_SEARCH_TYPE   ', type: 'VARCHAR2'},
    {name: 'IN_CAL_AREA      ', type: 'VARCHAR2', filter: {id: 1, label: '二级公司'}},
    {name: 'IN_SEG_ORG_KEY   ', type: 'VARCHAR2', filter: {id: 2, label: '经营单位', deps: 1}},
    {name: 'IN_CUSTOMER_NAME ', type: 'VARCHAR2', filter: {id: 3, label: '客户名称',dynamic: true, searchable: true}},
    {name: 'IN_TIME          ', type: 'VARCHAR2', filter: {id: 4, label: '时间窗口'}},
    {name: 'IN_RISK_IS_END   ', type: 'VARCHAR2', filter: {id: 5, label: '是否已结案'}},
    {name: 'IN_RISK_TIME     ', type: 'VARCHAR2', filter: {id: 6, label: '最新诉讼时间'}},
    {name: 'IN_FLAG          ', type: 'VARCHAR2'}
    ];

export const filterParams = [
    {name:'IN_MONTH         ',type:'NUMBER', defaultValue: parseInt(lastYearMonth)},
    {name:'IN_DIM_TYPE_CODE ',type:'VARCHAR2'},
    {name:'IN_EXPAND_1      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_2      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_3      ',type:'VARCHAR2'}
    ];

const filterProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_SELECT'
const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_MAIN_TABLE1'

export default {
    listParams,filterParams,filterProcedureName,listProcedureName, rowKey: 'nNumber'
}
