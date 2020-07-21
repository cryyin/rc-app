import React from 'react';
import './App.css';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Table1 from '@/views/t1/Table1'

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">
                <Table1 />
            </div>
        </ConfigProvider>
    );
}

export default App;
