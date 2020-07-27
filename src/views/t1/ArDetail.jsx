/**
 * 应收账款
 */
import React from 'react';
import RcTableView from "@/components/Table/RcTableView";
import tableConfig from "./ArDetailConfig"
import { Tag, Space} from 'antd'
import {FileTextOutlined, FundOutlined} from "@ant-design/icons";
import useRcPageNav from "@/utils/useRcPageNav";
import Icon from '@ant-design/icons';
// 目前引入自定义图标需要这样写，可能是craco的问题
import {ReactComponent as LawsuitIcon} from '@/assert/icon/lawsuit.svg'
import {getArColumns} from "@/views/t1/CommonColumns";
import ReportChart from "@/views/charts";

const ArDetail = () => {
    // noinspection DuplicatedCode
    const columns = [
            {
                title: '客户基本信息',
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
                        width: 200,
                        fixed: 'left',
                        dataIndex: 'vCustomerName',
                        key: 'vCustomerName',
                        render: (text, record)=> {
                            const customIcon =  getPageIcon('', <FileTextOutlined/>,
                                `/customer?IN_ID=${record.vId}`);
                            const lawsuitIcon = getPageIcon('', <Icon component={LawsuitIcon}/>,
                                `/lawsuit?IN_ID=${record.vId}`);
                            return (
                                <Space>
                                    {text}
                                    {customIcon}
                                    {lawsuitIcon}
                                </Space>
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
                        width: 250,
                        fixed: 'left',
                        dataIndex: 'vOperateUnit',
                        key: 'vOperateUnit',
                        render: (text, record) =>{
                            if (record.vLigitFlag === 'N'){
                                return text;
                            }
                            return (
                                <Space>
                                    {text}
                                    <Tag color={"green"}>有涉诉纠纷</Tag>
                                </Space>
                            )
                        }
                    },{
                        title: '近3个月收入（万元）',
                        width: 100,
                        dataIndex: 'n3mIncome',
                        key: 'n3mIncome'
                    }, {
                        title: '近6个月收入（万元）',
                        width: 140,
                        dataIndex: 'n6mIncome',
                        key: 'n6mIncome'
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
            },{
            ...getArColumns(
                '客户应收账款情况',
                (text, record)=> {
                    return text === 'Y' ?
                        getModalIcon('', record, <Icon component={FundOutlined}/>,'report') : ''
                }
            )
        }];
    const {getPageIcon, getModalIcon, RcModal, curInParams} = useRcPageNav();
    return (
        <div>
            <RcTableView columns={columns} tableConfig={tableConfig}/>
            <RcModal id='report'>
                <ReportChart fixedParams={curInParams} />
            </RcModal>
        </div>
    );
}
export default ArDetail


