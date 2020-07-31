/**
 * 客户编码
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./CustomerCodeConfig"
import useRcPageNav from "@/utils/useRcPageNav";

const CustomerCode = (props) => {
    const columns = [
        {
            title: '序号',
            width: 80,
            dataIndex: 'nOrderId',
            fixed: 'left',
            key: 'nOrderId'
        }, {
            title: '客户公司名称',
            width: 200,
            fixed: 'left',
            dataIndex: 'vCustomerName',
            key: 'vCustomerName'
        },
        {
            title: '客户MDM码',
            dataIndex: 'vMdm',
            width: 100,
            key: 'vMdm'
        }, {
            title: '一级公司名称',
            width: 160,
            dataIndex: 'vLev1PartyNumber',
            key: 'vLev1PartyNumber'
        },
        {
            title: '一级公司MDM码',
            dataIndex: 'vLev1MdmNumber',
            width: 100,
            key: 'vLev1MdmNumber'
        }, {
            title: '客户PARTY名称',
            width: 160,
            dataIndex: 'vPartyNumber',
            key: 'vPartyNumber'
        }, {
            title: '客户PARTY编码',
            width: 160,
            dataIndex: 'vPartyName',
            key: 'vPartyName'
        },
        {
            title: '结算对象名称',
            dataIndex: 'vSegCustomerName',
            width: 100,
            key: 'vSegCustomerName'
        },
        {
            title: '结算对象编码',
            dataIndex: 'vSegCustomerNo',
            width: 100,
            key: 'vSegCustomerNo'
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

export default CustomerCode


