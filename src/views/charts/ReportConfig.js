/**
 * 存储过程自定义参数
 * 可以打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 * filter自己定义，即该项作为筛选框条件出现, id值大小代表顺序（左到右,上到下递增),
 * deps表示当前筛选框依赖其他筛选框的值,暂时只考虑支持一个依赖
 *
 */


export const filterParams = [
    {name: 'IN_PARM         ', type:'NUMBER  '},
    {name: 'IN_CAL_AREA     ', type:'VARCHAR2'},
    {name: 'IN_SEG_ORG_KEY  ', type:'VARCHAR2'},
    {name: 'IN_ID           ', type:'VARCHAR2'},
    {name: 'IN_FLAG         ', type:'VARCHAR2'}
    ];

export const filterProcedureName = 'PKG_RC_DIGITAL_WARNING.SP_RC_VISUAL_REPORT'

export default {
    filterParams, filterProcedureName
}
