/**
 * 主表单1
 */
import React, {useEffect, useState} from 'react';
import {Button, Form, Table, message, Select} from "antd"
import userRcApi from '@/utils/useRcApi'
import {SearchOutlined} from "@ant-design/icons";
import {url} from "@/utils/sqlUtils";
import {listConfig, filterConfig} from "./Table1Config"
import request from '@/utils/request';

const { Option } = Select;
const { filterItems } = listConfig
const TableView = props => {
    const [filter1List, setFilter1List] = useState("")
    const {list, doFetch, handleFilter, loading, getPagination} = userRcApi(url,listConfig.sql, listConfig.params);
    useEffect(()=>{
        const {sql, params} = filterConfig
        // 二级公司
        params['IN_DIM_TYPE_CODE'] = 'D001'
        request.post(url, {sql, params}).then(r=>{
            setFilter1List(r.data.OUT_DATASET)
        }).catch(e=>{
            message.error(e.msg)
        })
    },[])

    const changeFilter = (value, filterNum) => {
        const item = filterItems[filterNum];
        handleFilter(item.name, value)
    }
    return (
        <div>
            <Form layout='inline'>
                <Form.Item label='二级公司'>
                    <Select
                        onChange={(value)=> changeFilter(value, 0)}
                        style={{width: '120px'}}
                        placeholder='请选择'
                    >
                        {filter1List && filter1List.map(d=><Option value={d.vValue} key={d.vKey}>{d.vValue}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doFetch}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
            <Table
                rowKey='nOrderId'
                loading={loading}
                pagination={false}
                columns={roleColumns}
                dataSource={list}
            />
            {getPagination()}
        </div>
    );
}

// 表列
const roleColumns = [
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
                width: 100,
                dataIndex: 'vOperateUnit',
                key: 'vOperateUnit'
            }, {
                title: '客户名称',
                width: 100,
                dataIndex: 'vCustomerName',
                key: 'vCustomerName'
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
                width: 160,
                dataIndex: 'nCaseCnt',
                key: 'nCaseCnt'
            }
        ]
    }
];

export default TableView


