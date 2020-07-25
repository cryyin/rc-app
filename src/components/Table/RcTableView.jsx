import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Select, Input} from "antd"
import userRcApi from '@/utils/useRcApi'
import {SearchOutlined} from "@ant-design/icons";
import getProcedureConfig, {classifyFilterItem, URL} from "@/utils/queryUtils";
import {isEmpty} from 'lodash'
import {call} from "@/api";
const {Option} = Select;

/**
 * 通用Rc查询表组组件
 * props:
 *    fixedParams用于组件间传值
 *    columns 列配置
 *    tableConfig 存储过程、筛选框配置，配置存储过程名称和查询参数
 * TODO 筛选框实时搜索: filter配置realtime字段，支持从后台查询selection。目前都是一次性拿过来的
 * @param props
 * @return {*} 组件
 * @constructor
 */
const RcTableView = props => {
    console.log('RcTableView props start')
    const {columns, fixedParams, tableConfig} = props
    // 读取表单存储过程信息
    const {listParams, listProcedureName, filterParams , filterProcedureName, rowKey} =  tableConfig
    // 生成筛选框配置
    const filterConfig = useMemo(()=>{
        return getProcedureConfig(filterProcedureName,filterParams, true)
    },[filterProcedureName, filterParams])
    // 生成表单配置
    const listConfig = useMemo(()=>{
        return getProcedureConfig(listProcedureName, listParams, false)
    },[listProcedureName, listParams])

    const {filterItems} = listConfig
    const {sql, params} = filterConfig

    // 筛选框分类：默认、依赖、动态
    const classifiedFilterItems = useMemo(()=>{
        return classifyFilterItem(filterItems);
    }, [filterItems])
    const {muteFilters, depFilters, dynamicFilters, beDepIds} = classifiedFilterItems

    // 固定参数
    const initialParams = useMemo(()=>{
        if (!isEmpty(fixedParams)){
            console.log(fixedParams)
            return  {...listConfig.params, ...fixedParams}
        }
        return listConfig.params
    }, [listConfig])

    // 应用hook得到通用组件
    const {doSearch, handleFilter, RcTable} = userRcApi(URL, listConfig.sql, initialParams);

    // 各类型筛选框状态
    const [muteItems, setMuteItems] = useState({})
    const [dynamicItems, setDynamicItems] = useState({})
    const [depItems, setDepItems] = useState({})

    // 需要更新的依赖
    // 初始化依赖
    const initDepIds = depFilters.filter(f => !f.filter.skipInit ).map(f=>f.filter.id)
    const [depInfo, setDepInfo] = useState({ids: initDepIds, value: ''})

    // 静态filter
    useEffect(() => {
        setFilterOptions(muteFilters, setMuteItems)
    }, [])

    // 具有依赖关系的筛选框
    // eslint-disable-next-line
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
        // 传入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(e => {
            const requestParams = {sql, params: {...params,...extraParams, IN_DIM_TYPE_CODE: e.filter.code}}
            call(requestParams).then(r=>{
                const result = r.data
                setter(prevState => {
                    return {...prevState, [result.IN_DIM_TYPE_CODE] : r.data.OUT_DATASET}
                })
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
                        // 筛选框是input
                        if(filter.type === 'input'){
                            return (
                                <Form.Item key={filter.code}>
                                    <Input
                                        onChange={(e) => changeFilter(e.target.value, item)}
                                        allowClear
                                        placeholder="请输入要查询的内容"
                                    />
                                </Form.Item>
                            )
                        }
                        // 筛选框默认是Select下拉框
                        let optionsSrc = muteItems
                        if (filter.dynamic) {
                            optionsSrc = dynamicItems
                        } else if (filter.deps) {
                            optionsSrc = depItems
                        }
                        const options = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []
                        return (
                            <Form.Item label={filter.label} key={filter.code}>
                                <Select
                                    showSearch={filter.searchable}
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
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doSearch}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
            {/*表格及分页区域*/}
            <RcTable
                columns={columns}
                rowKey={rowKey}
            />
        </div>
    );
}

// props类型检查
RcTableView.protoTypes = {
    columns: PropTypes.array.isRequired,
    tableConfig: PropTypes.object.isRequired,
    fixedParams: PropTypes.object
}

export default RcTableView


