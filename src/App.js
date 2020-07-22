import React from 'react';
import './App.css';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Table1 from '@/views/t1/Table1'
import Lawsuit from '@/views/t1/Lawsuit'
import Customer from "@/views/t1/Customer";
import NotFound from "@/error/404";
// noinspection ES6CheckImport
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <div className="App">
                <HashRouter>
                    <Switch>
                        <Route exact path='/'>
                            <Table1/>
                        </Route>
                        <Route exact path='/table1'>
                            <Table1/>
                        </Route>
                        <Route exact path='/Lawsuit'>
                            <Lawsuit/>
                        </Route>
                        <Route exact path='/Customer'>
                            <Customer/>
                        </Route>
                        <Route exact path='/error/404'>
                            <NotFound />
                        </Route>
                        <Redirect to="/error/404" />
                    </Switch>
                </HashRouter>
            </div>
        </ConfigProvider>
    );
}

export default App;
