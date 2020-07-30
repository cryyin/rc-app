/**
 * 使用hook封装通用的查询逻辑
 * 为了解决 Can't perform a React state update on an unmounted component 这个问题，返回改为组件
 *
 * @see {@link useRcApi}
 */

import React, {useState, useEffect, useCallback} from 'react';
import {call} from '@/api'
import {Pagination, Table} from "antd";

const RcTableList = (props) => {
    const {sql, params} = props

    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    // 总页数
    const [total, setTotal] = useState(0);
    // 分页组件参数_TIMESTAMP_FLAG代表点击分页相关按钮时间戳
    const [pageInfo, setPageInfo] = useState({current: 1, size: 10, _TIMESTAMP_FLAG:-1});
    const [current, setCurrent] = useState(1);

    /**
     * 异步发送数据, 相应字段名根据后端Api要求调整
     */
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // 后端接收开始行数、结束行数作为参数
            const {size, _TIMESTAMP_FLAG: pageTime} = pageInfo;

            // 确定当前页数，点搜索按钮从第一页开始查
            let current = 1;
            const queryTime = params._TIMESTAMP_FLAG || -1;
            // 根据动作时间戳区分是点击搜索按钮还是分页相关按钮
            if (pageTime > queryTime){
                current = pageInfo.current
            }
            setCurrent(current);

            const IN_ROWNB_BEGIN = (current - 1) * size + 1;
            const IN_ROWNB_END = size * current;
            const requestParam =  {...params, IN_ROWNB_BEGIN, IN_ROWNB_END}
            console.log('表格List请求参数')
            console.log(sql)
            console.log(requestParam)
            try {
                const result = await call(sql, requestParam);
                const dataList = result.data.OUT_DATASET
                // 无数据
                if (dataList.length === 1 && dataList[0].nStateCode === 0) {
                    setList([])
                    setTotal(0)
                } else {
                    setList(dataList);
                    // 总行数
                    if (dataList.length > 0) {
                        setTotal(dataList[0].nRow)
                    } else {
                        setTotal(0)
                    }
                }
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false);
        };
        fetchData().then();
    }, [sql, params, pageInfo]);

    // 当前每页数改变
    const changePageSize = useCallback((current, size) => {
        const _TIMESTAMP_FLAG = Date.now();
        setPageInfo({size, current, _TIMESTAMP_FLAG})
    }, [])
    // 当前页改变
    const changePage = useCallback((current, size) => {
        const _TIMESTAMP_FLAG = Date.now();
        setPageInfo({current, size, _TIMESTAMP_FLAG})
    }, [])

    return (
        <div className='list-wrapper'>
            {/*表格区域*/}
            <div className='list-container'>
                <Table
                    scroll={{x: 1300}}
                    rowKey={props.rowKey || 'nOrderId'}
                    loading={isLoading}
                    pagination={false}
                    columns={props.columns}
                    dataSource={list}
                    bordered
                />
            </div>
            {/*分页区域*/}
            <div className='pagination-container'>
                <Pagination
                    total={total}
                    pageSizeOptions={["10", "20", "40"]}
                    showTotal={(total) => `共${total}条数据`}
                    onChange={changePage}
                    current={current}
                    onShowSizeChange={changePageSize}
                    showSizeChanger
                    showQuickJumper
                    hideOnSinglePage={true}
                />
            </div>
        </div>
    )

};

export default RcTableList;
