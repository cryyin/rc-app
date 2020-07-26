import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Select, Input} from "antd"
import RcTableList from "@/components/Table/RcTableList";
import {SearchOutlined} from "@ant-design/icons";
import parseTableConfig from "@/utils/queryUtils";
import {debounce} from 'lodash'
import {call} from "@/api";

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

    // 表格配置解析
    const {
        columns, rowKey, filterItems, listSql, initListParams, filterSql, initFilterParams, muteFilters, depFilters,
        dynamicFilters, beDepIds, initDynamicDepInfo, initDepIds
    } = useMemo(() => {
        if (props) {
            return parseTableConfig(props);
        }
        return {}
    }, [props])

    /** 各类型筛选框状态 开始  */

    /**
     * 异步获取下拉框选项字典的便利方法
     * @param {Array} filters 筛选框列表
     * @param {Function} setter 筛选框setState钩子
     * @param {Object} extraParams 额外的查询查数
     */
    const setFilterOptions = useCallback((filters, setter, extraParams = {}) => {
        // 传入不同的IN_DIM_TYPE_CODE获取options字典
        filters.forEach(f => {
            const requestParams = {...initFilterParams, ...extraParams, IN_DIM_TYPE_CODE: f.code}
            console.log('筛选框请求参数')
            console.log(filterSql)
            console.log(requestParams)
            call(filterSql, requestParams).then(r => {
                const result = r.data
                setter(prevState => {
                    return {...prevState, [result.IN_DIM_TYPE_CODE]: r.data.OUT_DATASET}
                })
            })
        })
    }, [filterSql, initFilterParams])

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
    }, [depInfo,depFilters,setFilterOptions])

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
    }, [dynamicDepInfo])


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
    }, [beDepIds])

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
            // 为保证一定触发异步获取数据，使用一个随机数来更新参数
            const _RANDOM_VERSION_NO = new Date().getTime();
            return {...prevState, ...actFilterParams, _RANDOM_VERSION_NO}
        })
    }, [actFilterParams])

    /** 筛选框控件处理 结束 */

    return (
        <div>
            {/*查询区域*/}
            <Form layout='inline'>
                {
                    // 循环生成筛选框
                    filterItems.map(item => {
                        const {filter} = item

                        /** 筛选框是input **/
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

                        /** 筛选框默认是Select下拉框 **/
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
                        const options = (optionsSrc && optionsSrc[filter.code] && optionsSrc[filter.code]) || []
                        return (
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


