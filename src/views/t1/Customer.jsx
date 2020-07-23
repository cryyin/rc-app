/**
 * 客户详情
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./CustomerConfig"


const Customer = (props) => {
    const columns = [
        {
            title: '序号',
            width: 80,
            dataIndex: 'nOrderId',
            fixed: 'left',
            key: 'nOrderId'
        }, {
            title: '客户名称',
            width: 160,
            fixed: 'left',
            dataIndex: 'vCustomerName',
            key: 'vCustomerName'
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
            title: '风险评级',
            dataIndex: 'vRiskLvl',
            width: 100,
            key: 'vRiskLvl'
        }, {
            title: '最大股东',
            width: 160,
            dataIndex: 'vCeoName',
            key: 'vCeoName'
        }, {
            title: '法人代表',
            width: 160,
            dataIndex: 'vPrincipalName',
            key: 'vPrincipalName'
        },
        {
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
        }, {
            title: '涉诉情况',
            width: 160,
            dataIndex: 'vLiitgFlag',
            key: 'vLiitgFlag'
        },
        {
            title: '应收账款情况',
            dataIndex: 'vArFlag',
            width: 100,
            key: 'vArFlag'
        }, {
            title: '关联企业详情',
            width: 100,
            dataIndex: 'vRelatedFlag',
            key: 'vRelatedFlag'
        }
    ];
    const {fixedParams} = props
    return (
        <div>
            <RcTableView fixedParams={fixedParams} columns={columns} tableConfig={tableConfig}/>
        </div>
    );
}

// 表列


export default Customer


