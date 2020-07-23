import axios from "axios";
import {getToken} from "@/utils/auth";
import { message } from "antd";

//创建一个axios示例
const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_API, // api 的 base_url
  timeout: 2*60*1000, // request timeout, 单位60ms(毫秒)=1秒
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // noinspection JSUnresolvedVariable
    const token = getToken();
    // Do something before request is sent
    if (token) {
        // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
        config.headers['token'] = `${token}`
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
            message.error(res.msg);
            if(res.code === 405){
                // token无效需重新登录
            }
            return Promise.reject(new Error(res.msg || 'Error'));
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

const RND_FLAG = 'RND';
export const addRnd = (url) => {
    let sign = '?'
    let rawUrl = url;
    if(url.includes(RND_FLAG)){
        rawUrl = url.split(RND_FLAG)[0];
    }
    if (rawUrl.includes('?')){
        sign = '&';
    }
    return `${rawUrl+sign+RND_FLAG}=${new Date().getTime()}`;
}
