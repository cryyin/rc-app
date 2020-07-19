import React, {useState, useEffect} from 'react';
import {List} from "antd"
import request from '@/utils/request';

const TableView = prop =>  {
    const [list, setList] = useState([])
    useEffect(()=>{
        request.get('/role').then(r=>{
            console.log(r)
            setList(r.dataList)
        })
    })
    return (
        <div>
            <div>
                <List
                    size="small"
                    dataSource={list}
                />
            </div>
        </div>
    );
}

export default TableView


