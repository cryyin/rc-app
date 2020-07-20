import React from 'react';
import './App.css';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import RcTable from '@/components/Table/RcTable'
// import TableView from '@/components/Table/index'

const columns = [
    {
        title: '用户信息',
        fixed: 'left',
        children: [
            {
                title: '序号',
                width: 100,
                dataIndex: 'id',
                fixed: 'left',
                key: 'id'
            }, {
                title: '用户名',
                width: 100,
                dataIndex: 'username',
                fixed: 'left',
                key: 'username'
            }, {
                title: '别名',
                width: 100,
                dataIndex: 'nickname',
                key: 'nickname'
            }, {
                title: '机构',
                width: 100,
                dataIndex: 'userOrgName',
                key: 'userOrgName'
            }, {
                title: '邮箱',
                width: 100,
                dataIndex: 'email',
                key: 'email'
            },
        ]
    },
    {
        title: '审计信息',
        children: [
            {
                title: '修改时间',
                width: 100,
                dataIndex: 'utcModified',
                key: 'utcModified'
            },
            {
                title: '类型',
                width: 50,
                dataIndex: 'userType',
                key: 'userType'
            }, {
                title: '状态',
                width: 50,
                dataIndex: 'userStatus',
                key: 'userStatus'
            }, {
                title: '修改人',
                dataIndex: 'modifier',
                width: 100,
                key: 'modifier'
            }
        ]
    }
]

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">

                <RcTable url={'/user'} columns={columns}/>
                {/*<TableView columns={columns} />*/}
            </div>
        </ConfigProvider>
    );
}

export default App;
