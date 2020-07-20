/**
 * 使用hook封装通用的查询逻辑
 *
 * @see "https://segmentfault.com/a/1190000018652589"
 * @see "https://juejin.im/post/5d4431c351882510e12670d2"
 * @see "https://juejin.im/post/5e7abbc2e51d4526c47afa3f"
 */

import React, {useState, useEffect, Fragment, useCallback} from 'react';
import request from '@/utils/request';
import {Pagination} from "antd";

const RND_FLAG = 'RND';
const addRnd = (url) => {
    let sign = '?'
    let rawUrl = url;
    if(url.includes(RND_FLAG)){
        rawUrl = url.split(RND_FLAG)[0];
    }
    if (rawUrl.includes('?')){
        sign = '&';
    }
    return `${rawUrl+sign+RND_FLAG}=${new Date().getTime()}`;
}
const useDataApi = (initialUrl) => {
    const [list, setList] = useState([]);
    const [url, setUrl] = useState(initialUrl);
    const [params, setParams] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    // 一般是自定义的过滤条件
    const [filter, setFilter] = useState({});
    // 总页数
    const [total, setTotal] = useState(0);
    // 当前页
    const [current, setCurrent] = useState(1);
    // 页大小
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);
            const requestParam = {size, current, ...params}
            try {
                const result = await request.get(url.toString(), {params: requestParam});
                setList(result.data.dataList);
                setTotal(result.data.total)
            } catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        };
        fetchData().then();
    }, [url, params, size, current]);

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

export default useDataApi;
