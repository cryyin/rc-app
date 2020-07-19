import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "antd/dist/antd.less";
// noinspection SpellCheckingInspection
window.token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNTk1MTQ4NTU0LCJleHAiOjE1OTU3NTMzNTR9.d_g4-SPvZ8emC5TqM32KOjPhAe44bbCA1qhVopEju0FK7epAu347hFvbA3c-TKNAboeq6fCwEA8Lqv9gwktUbQ";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
