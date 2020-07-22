/**
 * 通用Rc表组件
 */
import React, {useEffect, useState} from 'react';
import {Button, Form, message, Select} from "antd"
import userRcApi from '@/utils/useRcApi'
import {SearchOutlined} from "@ant-design/icons";
import {classifyFilterItem, URL} from "@/utils/queryUtils";
import {listConfig, filterConfig} from "./Table1Config"
import request from '@/utils/request';

const {Option} = Select;

// 筛选框列表
const {filterItems} = listConfig
const {sql, params} = filterConfig

const TableView = props => {
    const {doFetch, handleFilter, getTable, getPagination} = userRcApi(URL, listConfig.sql, listConfig.params);
    const {muteFilters, depFilters, dynamicFilters, beDepIds} = classifyFilterItem(filterItems)
    const [muteItems, setMuteItems] = useState({})
    const [dynamicItems, setDynamicItems] = useState({})

    // 静态filter
    useEffect(() => {
        setFilterOptions(muteFilters, setMuteItems)
    }, [])

    /**
     * 动态filter,一般查询时间比较久，所以分开，目前逻辑和muteFilter一致，搜索时无需调用后台接口
     * 如果需要远程搜索，改造即可
     * */
    useEffect(() => {
        setFilterOptions(dynamicFilters, setDynamicItems)
    }, [])

    /**
     *
     * */
    const setFilterOptions = (filters, setter) => {
        const asyncArr = []
        // 闯入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(e => {
            const requestParams = {sql, params: {...params, IN_DIM_TYPE_CODE: e.filter.code}}
            asyncArr.push(request.post(URL, requestParams))
        })
        const items = {}
        // 并发获取
        Promise.all(asyncArr).then(result => {
            result.forEach(r => {
                items[r.data.IN_DIM_TYPE_CODE] = r.data.OUT_DATASET
            })
            setter(prevState => {
                return {...prevState, ...items}
            })
        })
    }

    const changeFilter = (value, item) => {
        handleFilter(item.name, value)
        if (beDepIds.has(item.filter.id)) {
            // 触发依赖更新
            // console.log(depFilters.filter(e => e.filter.deps === item.filter.id))
        }
    }

    return (
        <div>
            {/*查询区域*/}
            <Form layout='inline'>
                {
                    filterItems.map(item => {
                        const {filter} = item
                        let optionsSrc = muteItems
                        if (filter.dynamic) {
                            optionsSrc = dynamicItems
                        }
                        const options = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []

                        if (filter.deps) {
                        } else {
                            // 处理静态筛选框
                            return (
                                <Form.Item label={filter.label} key={filter.code}>
                                    <Select
                                        showSearch={filter.dynamic}
                                        allowClear
                                        onChange={(value) => changeFilter(value, item)}
                                        style={{width: '120px'}}
                                        placeholder='请选择'
                                    >
                                        {options.map(d => <Option value={d.vKey} key={d.vKey}>{d.vValue}</Option>)}
                                    </Select>
                                </Form.Item>
                            )
                        }
                    })
                }
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doFetch}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
            {/*表格区域*/}
            {getTable(table1Columns)}
            {/*分页区域*/}
            {getPagination()}
        </div>
    );
}

// 表列
const table1Columns = [
    {
        title: '客户基本信息',
        fixed: 'left',
        children: [
            {
                title: '序号',
                width: 100,
                dataIndex: 'nNumber',
                fixed: 'left',
                key: 'nNumber'
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
                width: 100,
                dataIndex: 'nCaseCnt',
                key: 'nCaseCnt'
            }
        ]
    }
];

export default TableView


