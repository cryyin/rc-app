/**
 * 主表单1-样式2
 */
import React, {useState} from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./Table1Config"
import {Button, Modal} from "antd";
import {FileTextOutlined} from "@ant-design/icons";
import Customer from "@/views/t1/Customer";
import {openNewTab} from "@/utils";


const Table1 = () => {
    const columns = [
        {
            title: '客户基本信息',
            fixed: 'left',
            children: [
                {
                    title: '序号',
                    width: 100,
                    dataIndex: 'nOrderId',
                    fixed: 'left',
                    key: 'nOrderId'
                }, {
                    title: '二级公司',
                    width: 100,
                    dataIndex: 'vCalArea',
                    fixed: 'left',
                    key: 'vCalArea'
                }, {
                    title: '外运公司',
                    width: 140,
                    fixed: 'left',
                    dataIndex: 'vOperateUnit',
                    key: 'vOperateUnit'
                }, {
                    title: '客户名称',
                    width: 140,
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
                }
            ]
        },
        {
            title: '客户合作情况',
            children: [
                {
                    title: '应收账款余额',
                    dataIndex: 'nAr',
                    width: 100,
                    key: 'nAr'
                }, {
                    title: '3个月以上应收占比',
                    width: 160,
                    dataIndex: 'n3mAccountAmtPct',
                    key: 'n3mAccountAmtPct'
                },
                {
                    title: '风险评级',
                    dataIndex: 'vRiskLvl',
                    width: 100,
                    key: 'vRiskLvl'
                }, {
                    title: '最近一次订单时间',
                    width: 160,
                    dataIndex: 'nRecentMonth',
                    key: 'nRecentMonth'
                }, {
                    title: '累计收入（万元）',
                    width: 160,
                    dataIndex: 'nIncomeAmCny',
                    key: 'nIncomeAmCny'
                }
            ]
        },
        {
            title: '外部风险',
            children: [
                {
                    title: '经营状态',
                    dataIndex: 'vManagementForms',
                    width: 100,
                    key: 'vManagementForms'
                }
            ]
        },
        {
            title: '内部风险信息',
            children: [
                {
                    title: '涉诉情况',
                    dataIndex: 'vLiitglag',
                    width: 100,
                    key: 'vLiitglag'
                }, {
                    title: '总涉诉金额',
                    width: 160,
                    dataIndex: 'nMoneyAllSum',
                    key: 'n3mAccountAmtPct'
                },
                {
                    title: '最近涉诉时间',
                    dataIndex: 'vRiskTimeRecent',
                    width: 100,
                    key: 'vRiskTimeRecent'
                }, {
                    title: '涉诉案件数',
                    width: 100,
                    dataIndex: 'nCaseCnt',
                    key: 'nCaseCnt'
                }
            ]
        }
    ];

    const [modal1Visible, setModal1Visible] = useState(false)
    const [curCustomer, setCustomer] = useState({})
    // noinspection JSUnusedLocalSymbols
    const openCustomerDetail = (record) => {
        console.log(record)
        setModal1Visible(true)
        setCustomer({IN_ID: record.vId})
    }

    const hideModal = () => {
        setModal1Visible(false)
    }
    return (
        <div>
            <RcTableView columns={columns} tableConfig={tableConfig}/>
            <Modal
                width='80%'
                visible={modal1Visible}
                onCancel={hideModal}
                onOk={hideModal}
            >
                <Customer fixedParams={curCustomer}/>
            </Modal>
        </div>
    );
}

// 表列


export default Table1


