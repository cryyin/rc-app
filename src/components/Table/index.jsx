/**
 * 使用hook获取数据
 * @see "https://segmentfault.com/a/1190000018652589"
 * TODO
 * 抽离出分页查询Hook函数
 * @see "https://juejin.im/post/5d4431c351882510e12670d2"
 * @see "https://juejin.im/post/5e7abbc2e51d4526c47afa3f"
 */

import React, {useState, useEffect} from 'react';
import {Table} from "antd"
import request from '@/utils/request';

const TableView = props => {
    const [list, setList] = useState(   []);
    const fetchData = () => request.get('/role').then(r => {
        setList(r.data.dataList);
    });
    useEffect( ()=>{
        fetchData().then(()=>{})
    },[]);
    const { columns } = props
    return (
        <div>
            <div>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={list}
                />
            </div>
        </div>
    );
}

export default TableView


