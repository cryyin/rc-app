/**
 * 客户详情
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./RelatedCompConfig"
import useRcPageNav from "@/utils/useRcPageNav";
console.log(tableConfig)
const RelatedComp = (props) => {
    const columns = [
        {
            title: '序号',
            width: 80,
            dataIndex: 'nOrderId',
            fixed: 'left',
            key: 'nOrderId'
        }, {
            title: '当前节点（展示名称）',
            width: 200,
            fixed: 'left',
            dataIndex: 'vNodeSname',
            key: 'vNodeSname'
        },
        {
            title: '公司标识',
            dataIndex: 'vCompFlag',
            width: 120,
            fixed: 'left',
            key: 'vCompFlag'
        }, {
            title: '父节点对当前节点的持股比例',
            width: 130,
            fixed: 'left',
            dataIndex: 'vPctNodeToP',
            key: 'vPctNodeToP'
        },
        {
            title: '父节点对当前节点的认缴出资金额（万元）',
            dataIndex: 'vAmtNodeToP',
            width: 130,
            fixed: 'left',
            key: 'vAmtNodeToP'
        }, {
            title: '目标公司对当前节点的持股比例',
            width: 130,
            fixed: 'left',
            dataIndex: 'vPctSh',
            key: 'vPctSh'
        }, {
            title: '目标公司对当前节点的直接持股比例',
            dataIndex: 'vPctNodeToEnd',
            width: 130,
            fixed: 'left',
            key: 'vPctNodeToEnd'
        },
        {
            title: '行业',
            dataIndex: 'vIndustryCategoryMdm',
            width: 160,
            key: 'vIndustryCategoryMdm'
        }, {
            title: '经营状态',
            width: 160,
            dataIndex: 'vManagementForms',
            key: 'vManagementForms'},
        {
            title: '法人代表',
            width: 160,
            dataIndex: 'vPrincipalName',
            key: 'vPrincipalName'
        }
    ];
    // 页面跳转、模块框相关hook
    const {fixedParams} = useRcPageNav(props);

    return (
        <div>
            <RcTableView fixedParams={fixedParams} columns={columns} tableConfig={tableConfig}/>
        </div>
    );
}

export default RelatedComp


