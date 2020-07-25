import {getLastYearMonth} from "@/utils/dateUtils";

const lastYearMonth = getLastYearMonth();
/**
 * 存储过程自定义参数
 * 可以打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 *
 * 参数说明：
 * - name: 存储过程对应的参数名
 * - type: 存储过程对应的参数类型
 *
 * - filter: filter对应存在，即表明该项作为筛选框条件，用户可在前端页面配置。以下参数一般与对应的Antd组件参数关联：
 *   + id： 筛选框标识, 应该唯一。值大小代表顺序
 *   + code: code可根据id生成，如id为1的下拉框code为D001,作为IN_DIM_TYPE_CODE参数值传入存储过程
 *   + label: 筛选框控件label
 *   + defaultValue： 筛选框控件默认值
 *   + deps： 表示当前筛选框依赖其他筛选框的值,暂时只考虑支持一个依赖
 *   + # 以下是针对select下拉框的配置
 *     - skipInit: 是否跳过初始化，针对具有依赖关系，且数据量较大的下拉框。如果传入父值数据量仍旧很大，应该设置dynamic
 *     - dynamic: 如果值存在，即代表下拉框需动态生产，dynamic的值代表存储过程参数，程序会将实时的输入赋值给这个参数，调用接口并返回kv字典
 *     - searchable：是否可输入
 *
 * @type {({name: string, type: string}|{name: string, type: string}|{name: string, type: string}|{filter: {order: number}, name: string, type: string}|{filter: {dep: number, order: number}, name: string, type: string})[]}
 */
export const listParams = [
    {name: 'IN_MONTH        ', type: 'VARCHAR2', defaultValue: lastYearMonth},
    {name: 'IN_ID           ', type: 'VARCHAR2'},
    {name: 'IN_SELECT_TYPE  ', type: 'VARCHAR2', filter: {id: 7, label: '筛选类别', defaultValue: '客户名称'}},
    {name: 'IN_SELECT       ', type: 'VARCHAR2', filter: {id: 8, label: '', deps: 7, skipInit: true, dynamic: 'IN_EXPAND_2'}},
    {name: 'IN_MANAGEMENT_FORMS   ', type: 'VARCHAR2', filter: {id: 9, label: '经营状态'}},
    {name: 'IN_INDUSTRY_CATEGORY  ', type: 'VARCHAR2', filter: {id: 10, label: '所属行业', code:'D010'}}
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
