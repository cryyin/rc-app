import React from 'react';
import './App.css';
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import RcTable from '@/components/Table/RcTable'

const columns = [
    {
        title: '角色信息',
        fixed: 'left',
        children:[
            {
                title: '序号',
                width: 100,
                dataIndex: 'id',
                fixed: 'left',
                key: 'id'
            },{
                title: '名称',
                width: 100,
                dataIndex: 'roleName',
                fixed: 'left',
                key: 'roleName'
            },{
                title: '描述',
                width: 100,
                dataIndex: 'roleDesc',
                key: 'roleDesc'
            },{
                title: '类型',
                width: 100,
                dataIndex: 'roleType',
                key: 'roleType'
            }
        ]
    } ,
    {
        title: '审计信息',
        children: [
            {
                title: '修改人',
                dataIndex: 'modifier',
                width: 100,
                key: 'modifier'
            } ,{
                title: '修改时间',
                width: 160,
                dataIndex: 'utcModified',
                key: 'utcModified'
            }
        ]
    }
]
function App() {
  return (
      <ConfigProvider locale={zhCN}>
          <div className="App">
              <RcTable url={'/role'} columns={columns} />
          </div>
      </ConfigProvider>
  );
}

export default App;
