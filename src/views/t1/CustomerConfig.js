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
    {name: 'IN_MONTH        ', type: 'VARCHAR2', defaultValue: lastYearMonth},
    {name: 'IN_ID           ', type: 'VARCHAR2'},
    {name: 'IN_SELECT_TYPE  ', type: 'VARCHAR2', filter: {id: 7, label: '筛选类别'}},
    {name: 'IN_SELECT       ', type: 'VARCHAR2', filter: {id: 8, label: '', deps: 7, skipInit: true, searchable: true}},
    {name: 'IN_MANAGEMENT_FORMS   ', type: 'VARCHAR2', filter: {id: 9, label: '经营状态'}},
    {name: 'IN_INDUSTRY_CATEGORY  ', type: 'VARCHAR2', filter: {id: 10, label: '所属行业',dynamic: true, code:'D010'}}
    ];

export const filterParams = [
    {name:'IN_MONTH         ',type:'NUMBER', defaultValue: parseInt(lastYearMonth)},
    {name:'IN_DIM_TYPE_CODE ',type:'VARCHAR2'},
    {name:'IN_EXPAND_1      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_2      ',type:'VARCHAR2'},
    {name:'IN_EXPAND_3      ',type:'VARCHAR2'}
    ];

const filterProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_SELECT'
const listProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_CUSTOMER_DETAIL'

export default {
    listParams,filterParams,filterProcedureName,listProcedureName
}
