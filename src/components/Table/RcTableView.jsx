/**
 * 通用Rc表组件
 */
import React, {useEffect, useState} from 'react';
import {Button, Form, Select} from "antd"
import userRcApi from '@/utils/useRcApi'
import {SearchOutlined} from "@ant-design/icons";
import getProcedureConfig, {classifyFilterItem, URL} from "@/utils/queryUtils";
import request from '@/utils/request';
const {Option} = Select;

/**
 * 通用查询表，切勿动态更改表配置
 * @param props
 * @return {*}
 * @constructor
 */
const RcTableView = props => {
    // 读取存储过程信息
    const {columns, tableConfig} = props
    const {listParams, listProcedureName, filterParams , filterProcedureName} = tableConfig
    const filterConfig = getProcedureConfig(filterProcedureName,filterParams, true)
    const listConfig = getProcedureConfig(listProcedureName, listParams, false)
    const {filterItems} = listConfig
    const {sql, params} = filterConfig

    // 读取筛选框信息
    const {muteFilters, depFilters, dynamicFilters, beDepIds} = classifyFilterItem(filterItems)
    const initDepIds = depFilters.map(f=>f.filter.id)


    // useState hook
    const {doFetch, handleFilter, getTable, getPagination} = userRcApi(URL, listConfig.sql, listConfig.params);
    // 各类型筛选框
    const [muteItems, setMuteItems] = useState({})
    const [dynamicItems, setDynamicItems] = useState({})
    const [depItems, setDepItems] = useState({})
    // 需要更新的依赖
    const [depInfo, setDepInfo] = useState({ids: initDepIds, value: ''})

    // 静态filter
    useEffect(() => {
        setFilterOptions(muteFilters, setMuteItems)
    }, [])

    // 具有依赖关系的筛选框
    useEffect(() => {
        if (depInfo && depInfo.ids){
            const updatedFilters = depFilters.filter(f=>depInfo.ids.includes(f.filter.id))
            setFilterOptions(updatedFilters, setDepItems, {IN_EXPAND_1: depInfo.value})
        }
    }, [depInfo])

    /**
     * 动态filter,一般查询时间比较久，所以分开，目前逻辑和muteFilter一致，搜索时无需调用后台接口
     * 如果需要远程搜索，改造即可
     */
    useEffect(() => {
        setFilterOptions(dynamicFilters, setDynamicItems)
    }, [])
    /**
     *
     * @param {Array} filters 筛选框列表
     * @param {Function} setter 筛选框setState钩子
     * @param {Object} extraParams 额外的查询查数
     */
    const setFilterOptions = (filters, setter, extraParams={}) => {
        const asyncArr = []
        // 传入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(e => {
            const requestParams = {sql, params: {...params,...extraParams, IN_DIM_TYPE_CODE: e.filter.code}}
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
            const ids = depFilters.filter(e => e.filter.deps === item.filter.id).map(f => f.filter.id);
            setDepInfo({ids, value})
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
                        } else if (filter.deps) {
                            optionsSrc = depItems
                        }
                        const options = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []
                        // 目前都是Select下拉框
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
                    })
                }
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doFetch}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
            {/*表格区域*/}
            {getTable(columns)}
            {/*分页区域*/}
            {getPagination()}
        </div>
    );
}
export default RcTableView


