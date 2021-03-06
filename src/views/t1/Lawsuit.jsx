/**
 * 主表单1-涉诉情况
 */
import React, {useMemo} from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./LawsuitConfig"
import useRcPageNav from "@/utils/useRcPageNav";
import ReportChart from '@/views/charts/index';
import {getArColumns, customerNameWidth, orgNameWidth} from "@/views/t1/CommonColumns";
import {CustomerDetailIcon, ReportIcon} from "@/views/t1/Icons";

const Lawsuit = (props) => {

    // 页面跳转、模块框相关hook
    const {fixedParams, getPageIcon, RcModal, getModalIcon, curInParams} = useRcPageNav(props);
    // 使用useMemo减少渲染次数，优化性能
    const columns = useMemo(()=>{
        return [
            {
                title: '诉讼情况',
                fixed: 'left',
                children: [
                    {
                        title: '序号',
                        width: 60,
                        dataIndex: 'nOrderId',
                        fixed: 'left',
                        key: 'nOrderId'
                    }, {
                        title: '客户名称',
                        width: customerNameWidth,
                        fixed: 'left',
                        dataIndex: 'vCustomerName',
                        key: 'vCustomerName',
                        render: (text, record)=> {
                            return getPageIcon(text, CustomerDetailIcon,
                                `/customer?IN_ID=${record.vId}`);
                        }
                    },{
                        title: '二级公司',
                        width: 100,
                        fixed: 'left',
                        dataIndex: 'vCalArea',
                        key: 'vCalArea'
                    }, {
                        title: '外运公司',
                        width: orgNameWidth,
                        fixed: 'left',
                        dataIndex: 'vOperateUnit',
                        key: 'vOperateUnit'
                    },{
                        title: '我方诉讼地位',
                        width: 100,
                        dataIndex: 'vLawsuitStatus',
                        key: 'vLawsuitStatus'
                    },{
                        title: '涉诉金额(万元)',
                        width: 100,
                        dataIndex: 'nMoneyAll',
                        key: 'nMoneyAll'
                    }, {
                        title: '涉诉日期',
                        width: 150,
                        dataIndex: 'vRiskTime',
                        key: 'vRiskTime'
                    }, {
                        title: '案发原因',
                        width: 300,
                        dataIndex: 'vCaseCauseDtl',
                        key: 'vCaseCauseDtl'
                    },{
                        title: '目前涉诉结案情况',
                        width: 100,
                        dataIndex: 'vRiskIsEnd',
                        key: 'vRiskIsEnd'
                    }, {
                        title: '实际收回金额(万元)',
                        width: 100,
                        dataIndex: 'nMoneyGet',
                        key: 'nMoneyGet'
                    }
                ]
            },
            {
                title: '授信情况',
                children: [
                    {
                        title: '授信期',
                        dataIndex: 'nCreditPeriod',
                        width: 100,
                        key: 'nCreditPeriod'
                    }, {
                        title: '授信额(万元)',
                        width: 160,
                        dataIndex: 'nCreditAmount',
                        key: 'nCreditAmount'
                    }
                ]
            },
            {
                ...getArColumns(
                    '涉诉公司对该客户应收账款情况',
                    (text, record)=> {
                        return text === 'Y' ?
                            getModalIcon('', record,ReportIcon,'report') : ''
                    }
                )
            }
        ];
    },[getPageIcon, getModalIcon])

     return (
        <div>
            <RcTableView fixedParams={fixedParams} columns={columns} tableConfig={tableConfig}/>
            <RcModal id='report'>
                <ReportChart fixedParams={curInParams} />
            </RcModal>
        </div>
    );
}

// 表列


export default Lawsuit


