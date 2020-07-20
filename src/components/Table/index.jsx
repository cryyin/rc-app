import React, {useState, useEffect} from 'react';
import {Table} from "antd"
import request from '@/utils/request';
// 使用hook获取数据
// @see "https://segmentfault.com/a/1190000018652589"
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


