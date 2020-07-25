import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Select, Input} from "antd"
import RcTableList from "@/components/Table/RcTableList";
import {SearchOutlined} from "@ant-design/icons";
import getProcedureConfig, {classifyFilterItem} from "@/utils/queryUtils";
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
    const {columns, fixedParams, tableConfig} = props

    // 读取表单存储过程信息
    const {listParams, listProcedureName, filterParams, filterProcedureName, rowKey} = tableConfig

    /** =======生成表单配置 开始======= */
    const listConfig = useMemo(() => {
        return getProcedureConfig(listProcedureName, listParams, false)
    }, [listProcedureName, listParams])

    // 表单查询初始参数=存储过程默认参数 + 父组件传递的固定参数
    const initListParams = useMemo(() => {
        if (!isEmpty(fixedParams)) {
            return {...listConfig.params, ...fixedParams}
        }
        return listConfig.params
    }, [listConfig.params])
    /** ======生成表单配置  结束====== */


    /** ======生成筛选框配置 开始====== */
    const filterConfig = useMemo(() => {
        return getProcedureConfig(filterProcedureName, filterParams, true)
    }, [filterProcedureName, filterParams])

    const {sql: filterSql, params: initFilterParams} = filterConfig
    const {filterItems} = listConfig

    // 筛选框分类处理：默认、依赖、动态
    const classifiedFilterItems = useMemo(() => {
        return classifyFilterItem(filterItems);
    }, [filterItems])
    const {muteFilters, depFilters, dynamicFilters, beDepIds} = classifiedFilterItems

    // 各类型筛选框状态

    // 静态filter
    const [muteItems, setMuteItems] = useState({})
    useEffect(() => {
        setFilterOptions(muteFilters, setMuteItems)
    }, [])

    // 具有依赖关系的筛选框
    const [depItems, setDepItems] = useState({})
    const initDepIds = useMemo(() => {
        return depFilters.filter(f => !f.filter.skipInit).map(f => f.filter.id)
    }, [depItems])

    const [depInfo, setDepInfo] = useState({ids: initDepIds, value: ''})
    useEffect(() => {
        if (depInfo && depInfo.ids) {
            const updatedFilters = depFilters.filter(f => depInfo.ids.includes(f.filter.id))
            setFilterOptions(updatedFilters, setDepItems, {IN_EXPAND_1: depInfo.value})
        }
    }, [depInfo])

    /**
     * 动态filter,一般查询时间比较久，所以分开，目前逻辑和muteFilter一致，搜索时无需调用后台接口
     * 如果需要远程搜索，改造即可
     */
    const [dynamicItems, setDynamicItems] = useState({})
    useEffect(() => {
        setFilterOptions(dynamicFilters, setDynamicItems)
    }, [])

    /**
     * 异步获取下拉框选项
     * @param {Array} filters 筛选框列表
     * @param {Function} setter 筛选框setState钩子
     * @param {Object} extraParams 额外的查询查数
     */
    const setFilterOptions = useCallback((filters, setter, extraParams = {}) => {
        // 传入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(e => {
            const requestParams =  {...initFilterParams, ...extraParams, IN_DIM_TYPE_CODE: e.filter.code}
            call(filterSql, requestParams).then(r => {
                const result = r.data
                setter(prevState => {
                    return {...prevState, [result.IN_DIM_TYPE_CODE]: r.data.OUT_DATASET}
                })
            })
        })
    },[filterSql, initFilterParams])

    /** ======生成筛选框配置 结束====== */


        // 实际选择的过滤条件参数
    const [actFilterParams, setActFilterParams] = useState({});

    // 实际列表查询参数=初始参数+过滤条件参数
    const [actListParams, setActListParams] = useState(initListParams)

    const changeFilter = useCallback((value, item) => {
        setActFilterParams(prevState => {
            return {...prevState, [item.name]: value}
        })
        if (beDepIds.has(item.filter.id)) {
            // 触发依赖更新
            const ids = depFilters.filter(e => e.filter.deps === item.filter.id).map(f => f.filter.id);
            setDepInfo({ids, value})
        }
    }, [beDepIds])

    // 执行搜索
    const doSearch = useCallback(() => {
        setActListParams(prevState => {
            // 为保证一定触发异步获取数据，使用一个随机数来更新参数
            const _RANDOM_VERSION_NO = new Date().getTime();
            return {...prevState, ...actFilterParams, _RANDOM_VERSION_NO}
        })
    }, [actListParams])

    return (
        <div>
            {/*查询区域*/}
            <Form layout='inline'>
                {
                    filterItems.map(item => {
                        const {filter} = item
                        // 筛选框是input
                        if (filter.type === 'input') {
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
            <RcTableList
                sql={listConfig.sql}
                params={actListParams}
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


