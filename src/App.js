import React from 'react';
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Table1 from '@/views/t1/Table1'
import routeList from "@/config/routeMap";
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
                        {/*动态加载页面，减少单个文件体积*/}
                        {routeList.map((route) => {
                            return (
                                (
                                    <Route
                                        component={route.component}
                                        key={route.path}
                                        path={route.path}
                                    />
                                )
                            );
                        })}
                        <Redirect to="/error/404" />
                    </Switch>
                </HashRouter>
            </div>
        </ConfigProvider>
    );
}

export default App;
