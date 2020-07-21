import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "antd/dist/antd.less";
// 自定义样式
import "@/style/index.less";
// noinspection SpellCheckingInspection
window.token = "9e07ab1ae01b4bf663206ddfbf894c37";

// 去掉严格模式
// @see "https://zh-hans.reactjs.org/docs/strict-mode.html#gatsby-focus-wrapper"
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
