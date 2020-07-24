import Cookies from 'js-cookie'
import request from "@/utils/request";

export const TokenKey = 'token'

export function getToken() {
    const token = sessionStorage.getItem(TokenKey)
    if (token) {
        return token;
    }
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export function login(username, password) {
    request.post('/sys/login', {username, password}).then(r => {
        setToken(r.token)
    }).catch(e => {
        console.log('token未设置')
        console.log(e)
    })
}