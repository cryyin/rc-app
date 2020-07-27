/**
 * 客户详情
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./CustomerCodeConfig"
import useRcPageNav from "@/utils/useRcPageNav";

const RelatedComp = (props) => {
    const columns = [
        {
            title: '序号',
            width: 80,
            dataIndex: 'nOrderId',
            fixed: 'left',
            key: 'nOrderId'
        }, {
            title: '关联企业名称',
            width: 160,
            fixed: 'left',
            dataIndex: 'vRelationName',
            key: 'vRelationName'
        },
        {
            title: '所属行业',
            dataIndex: 'vIndustryCategory',
            width: 100,
            key: 'vIndustryCategory'
        }, {
            title: '注册资本',
            width: 160,
            dataIndex: 'vRegisteredCapital',
            key: 'vRegisteredCapital'
        },
        {
            title: '最大股东',
            dataIndex: 'vCeoName',
            width: 100,
            key: 'vCeoName'
        }, {
            title: '法人代表',
            width: 160,
            dataIndex: 'vPrincipalName',
            key: 'vPrincipalName'
        }, {
            title: '经营状态',
            dataIndex: 'vManagementForms',
            width: 100,
            key: 'vManagementForms'
        },
        {
            title: '联系方式',
            dataIndex: 'vMobile',
            width: 100,
            key: 'vRiskTimeRecent'
        }, {
            title: '地址',
            width: 180,
            dataIndex: 'vAddress',
            key: 'vAddress'
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


