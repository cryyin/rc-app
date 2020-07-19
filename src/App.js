import React from 'react';
import './App.css';
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import TableView from '@/components/Table/index'

function App() {
  return (
      <ConfigProvider locale={zhCN}>
          <div className="App">
              测试
              <TableView />
          </div>
      </ConfigProvider>
  );
}

export default App;
