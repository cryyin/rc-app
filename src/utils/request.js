import axios from "axios";
import { message } from "antd";

//创建一个axios示例
const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // noinspection JSUnresolvedVariable
    const token = window.parent.token || window.toekn;
    // Do something before request is sent
    if (token) {
        // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    // noinspection JSIgnoredPromiseFromCall
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        // if the custom code is not 0, it is judged as an error.
        if (res.code !== 0) {
            message.error(res.message);
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res
        }
    },
  (error) => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
