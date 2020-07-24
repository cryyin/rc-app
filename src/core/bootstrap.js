import {login, setToken, TokenKey} from '@/utils/auth'
import applyPolyfill from '@/utils/polyfill'

const bootstrap = () => {
    // 首先从父容器获取token
    let token = window.parent.token || window.toekn || sessionStorage.getItem(TokenKey)
    if (token){
        setToken(token)
        // 获取菜单配置
    }else {
        // 注意这里只是为了方便开发，实际上不应该进入这里
        if (process.env.NODE_ENV === 'development'){
            const username = 'admin'
            const password = 'Admin_0214'
            console.log('测试环境自动登陆')
            login(username, password);
        }
    }

    // 开始适应Portal代码
    applyPolyfill();
}
export default bootstrap;