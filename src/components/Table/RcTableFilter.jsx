import React, {useCallback, useEffect, useMemo, useState} from "react";
import {debounce} from "lodash";
import {AutoComplete, Button, Col, Form, Input, Radio, Row, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {parseFilterConfig} from "@/utils/queryUtils";

const {Option} = Select;

const RcTableFilter = props => {
    console.log('RcTableFilter')
    const {filterSql, initFilterParams, filterItems, setActListParams, showSearch} = props

    const {muteFilters, depFilters, dynamicFilters, beDepIds, initDynamicDepInfo, initDepIds, setFilterOptions} = useMemo(() => {
        return parseFilterConfig(filterSql, initFilterParams, filterItems)
    }, [filterSql, initFilterParams, filterItems])

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

    // 实际选择的过滤条件参数
    const [actFilterParams, setActFilterParams] = useState({});

    // 控件值改变的回调函数
    const changeFilter = useCallback((value, item) => {
        // 1 处理当前筛选框值变化
        if (item.filter.searchOnChange) {
            // 1.1 直接执行搜索
            setActListParams(prevState => {
                return {...prevState, [item.name]: value}
            })
        } else {
            // 1.2 保存当前筛选框的值
            setActFilterParams(prevState => {
                return {...prevState, [item.name]: value}
            })
        }
        // 2. 处理其他筛选框。如果被其他筛选框依赖，则需要更新当前的依赖信息
        if (beDepIds.has(item.filter.id)) {
            const ids = depFilters.filter(f => f.deps === item.filter.id).map(f => f.id);
            // 触发依赖更新
            setDepInfo({ids, value})
        }
    }, [beDepIds, depFilters, setActListParams])


    const handleAcSelect = useCallback((option, item, key = 'key') => {
        // 1. 保存当前筛选框的值
        setActFilterParams(prevState => {
            return {...prevState, [item.name]: option[key]}
        })
    }, [])

    // 这里debounce一下，避免频繁的请求后端数据
    const handleFilterSearch = useCallback(debounce((value, filter) => {
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
    }, [actFilterParams, setActListParams])

    /** 筛选框控件处理 结束 */
    const spanNum = 6
    const renderedFilterItems = filterItems.flatMap(item => {
        const {filter} = item
        let vNode;
        // 根据筛选框的控件类型分别处理
        switch (filter.type) {
            case "input":
                vNode = (
                    <Input
                        onChange={(e) => changeFilter(e.target.value, item)}
                        allowClear
                        placeholder="请输入要查询的内容"
                    />
                )
                break;
            case "radio":
                if (filter.options) {
                    vNode = (
                        <Radio.Group
                            onChange={(e) => changeFilter(e.target.value, item)}
                            // 为组合内的 input 元素赋予相同的 name 属性
                            name={filter.code}
                            options={filter.options}
                            defaultValue={filter.defaultValue}
                        />
                    )
                }
                break;
            default:
                // 根据筛选框类别确定option字典来源
                let optionsSrc = muteItems
                const dynamicProps = {}
                // dynamic优先从dynamicItems中取数，比deps更具有优先级
                if (filter.dynamic) {
                    optionsSrc = dynamicItems
                    dynamicProps.onSearch = (value) => handleFilterSearch(value, filter)
                } else if (filter.deps) {
                    optionsSrc = depItems
                }
                const optionData = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []

                // autoComplete
                if (filter.type === 'autoComplete') {
                    // AutoComplete这里value与Select不同，用的是d.vValue
                    const options = optionData.map(d => <Option value={d.vValue}
                                                                key={d.vKey}>{d.vValue}</Option>)
                    vNode = (
                        <AutoComplete
                            onSelect={(value, option) => {
                                handleAcSelect(option, item)
                            }}
                            // style={{width:'120px'}}
                            {...dynamicProps}
                            onChange={(value) => changeFilter(value, item)}
                            placeholder="请输入">
                            {options}
                        </AutoComplete>
                    )
                } else {
                    // select下拉框
                    const options = optionData.map(d => <Option value={d.vKey}
                                                                key={d.vKey}>{d.vValue}</Option>)
                    vNode = (
                        <Select
                            showSearch={filter.showSearch || filter.dynamic}
                            {...dynamicProps}
                            defaultValue={filter.defaultValue}
                            allowClear
                            onChange={(value) => changeFilter(value, item)}
                            // style={{width: '120px'}}
                            placeholder='请选择'
                        >
                            {options}
                        </Select>
                    )
                }
        }

        if (vNode) {
            return (
                <Col span={spanNum} key={filter.code}>
                    <Form.Item label={filter.label}>
                        {vNode}
                    </Form.Item>
                </Col>
            )
        }
        return []
    })
    // 增加搜索按钮
    if (renderedFilterItems.length > 0 && showSearch !== false) {
        renderedFilterItems.push(
            <Col span={spanNum} key='searchBtn'>
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doSearch}>
                        搜索
                    </Button>
                </Form.Item>
            </Col>
        )
    }

    return (
        <Form className='rc-form'>
            <Row gutter={24}>
                {renderedFilterItems}
            </Row>
        </Form>
    )
}

export default React.memo(RcTableFilter)