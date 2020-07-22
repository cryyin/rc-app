import React from 'react';
import './App.css';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
// import Table1 from '@/views/t1/Table1'
// import Lawsuit from '@/views/t1/Lawsuit'
import Customer from "@/views/t1/Customer";

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">
                {/*<Lawsuit />*/}
                <Customer />
            </div>
        </ConfigProvider>
    );
}

export default App;
