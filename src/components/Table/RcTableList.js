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
    // 当前页
    const [pageInfo, setPageInfo] = useState({current: 1, size: 10});

    /**
     * 异步发送数据, 相应字段名根据后端Api要求调整
     */
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // 后端接收开始行数、结束行数作为参数
            const {size, current} = pageInfo;
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
        setPageInfo({size, current: 1})
    }, [])
    // 当前页改变
    const changePage = useCallback((current, size) => {
        setPageInfo({current, size})
    }, [])

    return (
        <div className='rc-table-container'>
            {/*表格区域*/}
            <div className='rc-table'>
                <Table
                    scroll={{x: 1300}}
                    rowKey={props.rowKey || 'nOrderId'}
                    loading={isLoading}
                    pagination={false}
                    columns={props.columns}
                    dataSource={list}
                />
            </div>
            {/*分页区域*/}
            <div className='rc-table-pagination'>
                <Pagination
                    total={total}
                    pageSizeOptions={["10", "20", "40"]}
                    showTotal={(total) => `共${total}条数据`}
                    onChange={changePage}
                    current={pageInfo.current}
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
