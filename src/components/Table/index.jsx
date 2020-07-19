import React, {useState, useEffect} from 'react';
import {List} from "antd"
import request from '@/utils/request';
// 使用hook获取数据
// @see "https://segmentfault.com/a/1190000018652589"
const TableView = prop =>  {
    const [list, setList] = useState([]);
    useEffect( ()=>{
        const fetchData = async () => {
            const result = await  request.get('/role');
            setList(result.data.dataList);
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchData();
    },[]);

    return (
        <div>
            <div>
                {list &&list[0] && list[0]['roleDesc']}
                <List
                    size="small"
                    dataSource={list}
                    renderItem={item => (
                        <List.Item>
                            {item.id}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default TableView


