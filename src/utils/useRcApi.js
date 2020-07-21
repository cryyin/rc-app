/**
 * 使用hook封装通用的查询逻辑
 *
 * @see "https://segmentfault.com/a/1190000018652589"
 * @see "https://juejin.im/post/5d4431c351882510e12670d2"
 * @see "https://juejin.im/post/5e7abbc2e51d4526c47afa3f"
 */

import React, {useState, useEffect, Fragment, useCallback} from 'react';
import request, {addRnd} from '@/utils/request';
import {Pagination} from "antd";

const useRcApi = (initialUrl, initialSql, initialParams) => {
    const [list, setList] = useState([]);
    const [url, setUrl] = useState(initialUrl);
    const [sql] = useState(initialSql);
    const [params, setParams] = useState(initialParams);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // 一般是自定义的过滤条件, 间接使用filter而不是直接设置params避免频繁fetch数据
    // 初始内容与params一致
    const [filter, setFilter] = useState(initialParams);

    // 总页数
    const [total, setTotal] = useState(0);
    // 当前页
    const [current, setCurrent] = useState(1);
    // 页大小
    const [size, setSize] = useState(10);

    // 异步发送数据
    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);
            // 后端接收开始行数、结束行数作为参数
            const IN_ROWNB_BEGIN = (current-1) < 0 ? 0 : (current-1) * size;
            const IN_ROWNB_END = size * current;
            const requestParam = {sql, params:{...params, IN_ROWNB_BEGIN, IN_ROWNB_END}}
            try {
                const result = await request.post(url.toString(), requestParam);
                const dataList = result.data.OUT_DATASET
                // 无数据
                if (dataList.length === 1 && dataList[0].nStateCode === 0){
                    return;
                }
                setList(dataList);
                setTotal(dataList[0].rowNum)
            } catch (error) {
                console.log(error)
                setIsError(true);
            }
            setIsLoading(false);
        };
        fetchData().then();
    }, [url, sql, params, size, current]);

    // 手动触发获取数据逻辑
    const doFetch = useCallback(()=>{
        setParams({...filter});
        setCurrent(1)
        // 为确保一定能查询, url后面增加随机数
        setUrl(addRnd(url))

    },[url, filter]);
    // 更改过滤条件
    const handleFilter = (key, val) => {
        setFilter({...filter, [key]:val})
    }
    // 当前每页数改变
    const changePageSize = (current, size)=>{
        setSize(size)
    }
    // 当前页改变
    const changePage = (current)=>{
        setCurrent(current)
    }
    // 返回分页组件
    const getPagination = () => {
        return(
            <Fragment>
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
            </Fragment>
        )
    }
    return { list, handleFilter, isLoading, isError, doFetch, getPagination };
};

export default useRcApi;
