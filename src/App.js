import React from 'react';
import './App.css';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import RcTable from '@/components/Table/RcTable'
// import TableView from '@/components/Table/index'


function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">

                <RcTable url={'/user'} />
                {/*<TableView columns={columns} />*/}
            </div>
        </ConfigProvider>
    );
}

export default App;
