/**
 * 主表单1-样式2
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./LawsuitConfig"
import {Button} from "antd";
import {openNewTab} from "@/utils";
import {FileTextOutlined} from "@ant-design/icons";
import useRcPageNav from "@/utils/useRcPageNav";


const Lawsuit = (props) => {
    const columns = [
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
                    width: 160,
                    fixed: 'left',
                    dataIndex: 'vCustomerName',
                    key: 'vCustomerName',
                    render: (text, record)=> {
                        return (
                            <span>
                                {text}
                                <Button
                                    style={{border: 'none'}}
                                    onClick={()=>{ openNewTab(`/customer?IN_ID=${record.vId}`)}}
                                    size='small'
                                    icon={<FileTextOutlined />}
                                />
                            </span>
                        )
                    }
                },{
                    title: '二级公司',
                    width: 100,
                    fixed: 'left',
                    dataIndex: 'vCalArea',
                    key: 'vCalArea'
                }, {
                    title: '外运公司',
                    width: 140,
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
            title: '涉诉公司对该客户应收账款情况',
            children: [
                {
                    title: '应收账款余额(万元)',
                    dataIndex: 'nAr',
                    width: 100,
                    key: 'nAr'
                },
                {
                    title: '风险评级',
                    dataIndex: 'vRiskLvl',
                    width: 100,
                    key: 'vRiskLvl'
                }, {
                    title: '可视化报告',
                    width: 160,
                    dataIndex: 'vVisualReport',
                    key: 'vVisualReport'
                }, {
                    title: '90天以上应收比例',
                    width: 160,
                    dataIndex: 'n3mAccountAmtPct',
                    key: 'n3mAccountAmtPct'
                },{
                    title: '应收0天(万元)',
                    dataIndex: 'nAr0',
                    width: 100,
                    key: 'nAr0'
                }, {
                    title: '应收1-30天(万元)',
                    width: 160,
                    dataIndex: 'nAr1',
                    key: 'nAr1'
                },
                {
                    title: '应收31-45天(万元)',
                    dataIndex: 'nAr2',
                    width: 100,
                    key: 'nAr2'
                }, {
                    title: '应收46-60天(万元)',
                    width: 100,
                    dataIndex: 'nA3',
                    key: 'nAr3'
                },{
                    title: '应收61-90天(万元)',
                    dataIndex: 'nAr4',
                    width: 100,
                    key: 'nAr4'
                }, {
                    title: '应收91-120天(万元)',
                    width: 160,
                    dataIndex: 'nAr5',
                    key: 'nAr5'
                },
                {
                    title: '应收121-180天(万元)',
                    dataIndex: 'nAr6',
                    width: 100,
                    key: 'nAr6'
                }, {
                    title: '应收181-360天(万元)',
                    width: 100,
                    dataIndex: 'nAr7',
                    key: 'nAr7'
                }, {
                    title: '应收361-720天（万元）',
                    width: 160,
                    dataIndex: 'nAr8',
                    key: 'nAr8'
                },
                {
                    title: '应收721-1080天（万元)',
                    dataIndex: 'nAr9',
                    width: 100,
                    key: 'nAr9'
                }, {
                    title: '应收1080天以上（万元）',
                    width: 100,
                    dataIndex: 'nAr10',
                    key: 'nAr10'
                }
            ]
        }
    ];
    // 页面跳转、模块框相关hook
    const {getFixedParams} = useRcPageNav();
    return (
        <div>
            <RcTableView fixedParams={getFixedParams(props)} columns={columns} tableConfig={tableConfig}/>
        </div>
    );
}

// 表列


export default Lawsuit


