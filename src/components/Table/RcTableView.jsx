import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Select, Input, AutoComplete, Row, Col} from "antd"
import RcTableList from "@/components/Table/RcTableList";
import {SearchOutlined} from "@ant-design/icons";
import parseTableConfig from "@/utils/queryUtils";
import {debounce} from 'lodash'

const {Option} = Select;

/**
 * 通用Rc查询表组组件，唯一比较复杂的部分就是筛选框的处理。
 *
 * props:
 *    fixedParams用于组件间传值
 *    columns 列配置
 *    tableConfig 存储过程、筛选框配置，配置存储过程名称和查询参数
 *
 * @param props
 * @return {*} 针对RC项目实现的通用组件，使用要求应满足设计文档
 * @constructor
 */
const RcTableView = props => {
    console.log('RcTableView')
    const {columns, fixedParams, tableConfig} = props

    // 表格配置解析
    const {
        rowKey, filterItems, listSql, initListParams, muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo, initDepIds, setFilterOptions
    } = useMemo(() => {
        if (tableConfig) {
            return parseTableConfig(fixedParams, tableConfig);
        }
        return {}
    }, [fixedParams, tableConfig])

    /** 各类型筛选框状态 开始  */

        // 静态filter，处理起来最简单
    const [muteItems, setMuteItems] = useState({})
    useEffect(() => {
        setFilterOptions(muteFilters, setMuteItems)
    }, [muteFilters, setFilterOptions])

    // 具有依赖关系的筛选框
    const [depItems, setDepItems] = useState({})
    const [depInfo, setDepInfo] = useState({ids: initDepIds, value: undefined})
    useEffect(() => {
        if (depInfo && depInfo.ids) {
            // 这里不用更新动态筛选框的options
            const updatedFilters = []
            // 动态筛选框依赖的值也需要更新
            const updatedDynamicDepInfo = {}
            depFilters.forEach(f => {
                //只需处理与当前触发者关联的筛选框
                if (depInfo.ids.includes(f.id)) {
                    // 动态筛选框无需更新options
                    if (f.dynamic) {
                        updatedDynamicDepInfo[f.id] = depInfo.value
                    } else {
                        updatedFilters.push(f)
                    }
                }
            })
            setDynamicDepInfo(prevState => {
                return {...prevState, ...updatedDynamicDepInfo, curId: undefined}
            })
            setFilterOptions(updatedFilters, setDepItems, {IN_EXPAND_1: depInfo.value})
        }
    }, [depInfo, depFilters, setFilterOptions])

    // 动态筛选框
    const [dynamicDepInfo, setDynamicDepInfo] = useState(initDynamicDepInfo)
    const [dynamicItems, setDynamicItems] = useState({})
    useEffect(() => {
        const curId = dynamicDepInfo.curId;
        if (curId) {
            // 只更新当前输入的动态筛选框, 理论上应该只有一个
            const curFilter = dynamicFilters.filter(f => f.id === curId)[0];
            if (curFilter) {
                const extraParams = {
                    IN_EXPAND_1: dynamicDepInfo[curId],
                    [curFilter.dynamic]: dynamicDepInfo.curValue
                }
                setFilterOptions([curFilter], setDynamicItems, extraParams)
            }
        }
    }, [dynamicDepInfo, dynamicFilters, setFilterOptions]);


    /** 各类型筛选框状态 结束  */

    /** 筛选框控件处理 开始 */

        // 实际选择的过滤条件参数
    const [actFilterParams, setActFilterParams] = useState({});

    // 实际列表查询参数=初始参数+过滤条件参数
    const [actListParams, setActListParams] = useState(initListParams)

    // 控件值改变的回调函数
    const changeFilter = useCallback((value, item) => {
        // 1. 保存当前筛选框的值
        setActFilterParams(prevState => {
            return {...prevState, [item.name]: value}
        })
        // 2. 如果被其他筛选框依赖，则需要更新当前的依赖信息
        if (beDepIds.has(item.filter.id)) {
            const ids = depFilters.filter(f => f.deps === item.filter.id).map(f => f.id);
            // 触发依赖更新
            setDepInfo({ids, value})
        }
    }, [beDepIds, depFilters])


    const handleAcSelect = useCallback((option, item, key = 'key') => {
        // 1. 保存当前筛选框的值
        setActFilterParams(prevState => {
            return {...prevState, [item.name]: option[key]}
        })
    }, [])

    // 这里debounce一下，避免频繁的请求后端数据
    const handleFilterInput = useCallback(debounce((value, filter) => {
        if (value && value.length !== 0) {
            setDynamicDepInfo(prevState => {
                return {
                    ...prevState, curId: filter.id, curValue: value
                }
            })
        } else {
            setDynamicItems(prevState => {
                return {
                    ...prevState, [filter.id]: []
                }
            })
        }
    }, 233), [])

    // 执行搜索
    const doSearch = useCallback(() => {
        setActListParams(prevState => {
            // 为保证一定触发异步获取数据，使用一个时间戳来更新参数，该参数也表明搜索触发时间
            const _TIMESTAMP_FLAG = Date.now();
            // 清空IN_ID参数，如果有需要的话，可清空传入的fixedParams
            return {...prevState, ...actFilterParams, _TIMESTAMP_FLAG, IN_ID: ''}
        })
    }, [actFilterParams])

    /** 筛选框控件处理 结束 */

        // 循环生成筛选框
    const spanNum = 6
    const renderedFilterItems = filterItems.map(item => {
            const {filter} = item
            /** 筛选框是input **/
            if (filter.type === 'input') {
                return (
                    <Col span={spanNum} key={filter.code}>
                        <Form.Item>
                            <Input
                                onChange={(e) => changeFilter(e.target.value, item)}
                                allowClear
                                placeholder="请输入要查询的内容"
                            />
                        </Form.Item>
                    </Col>

                )
            }

            /** select 下拉框 和 autoComplete */
                // 根据筛选框类型确定option字典来源
            let optionsSrc = muteItems
            const dynamicProps = {}
            // dynamic优先从dynamicItems中取数，比deps更具有优先级
            if (filter.dynamic) {
                optionsSrc = dynamicItems
                dynamicProps.onSearch = (value) => handleFilterInput(value, filter)
            } else if (filter.deps) {
                optionsSrc = depItems
            }
            const optionData = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []

            // autoComplete
            if (filter.type === 'autoComplete') {
                // AutoComplete这里value与Select不同，用的是d.vValue
                const options = optionData.map(d => <Option value={d.vValue}
                                                            key={d.vKey}>{d.vValue}</Option>)
                return (
                    <Col span={spanNum} key={filter.code}>
                        <Form.Item label={filter.label} key={filter.code}>
                            <AutoComplete
                                onSelect={(value, option) => {
                                    handleAcSelect(option, item)
                                }}
                                style={{width: 120}}
                                {...dynamicProps}
                                onChange={(value) => changeFilter(value, item)}
                                placeholder="请输入">
                                {options}
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                )
            }

            const options = optionData.map(d => <Option value={d.vKey}
                                                        key={d.vKey}>{d.vValue}</Option>)

            // select下拉框
            return (
                <Col span={spanNum} key={filter.code}>
                    <Form.Item label={filter.label} key={filter.code}>
                        <Select
                            showSearch={filter.searchable || filter.dynamic}
                            {...dynamicProps}
                            defaultValue={filter.defaultValue}
                            allowClear
                            onChange={(value) => changeFilter(value, item)}
                            style={{width: '120px'}}
                            placeholder='请选择'
                        >
                            {options}
                        </Select>
                    </Form.Item>
                </Col>
            )
        })
    return (
        <div className='rc-table'>
            {/*查询区域*/}
            <div className='filter-container'>
                {
                    renderedFilterItems.length > 0 ?
                        <Form className='ant-advanced-search-form'>
                            <Row gutter={24}>
                                {renderedFilterItems}
                                <Col span={spanNum}>
                                    <Form.Item>
                                        <Button type="primary" icon={<SearchOutlined/>} onClick={doSearch}>
                                            搜索
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        : null
                }
            </div>
            {/*表格及分页区域*/}
            <RcTableList
                sql={listSql}
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


