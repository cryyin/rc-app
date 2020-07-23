import {setToken} from '@/utils/auth'
import request from '@/utils/request'

const bootstrap = () => {
    // 首先从父容器获取token
    let token = window.parent.token || window.toekn
    if (token){
        setToken(token)
    }else {
        // 注意这里只是为了方便开发，实际上不应该进入这里
        if (process.env.NODE_ENV === 'development'){
            const username = 'admin'
            const password = 'Admin_0214'
            request.post('/sys/login', {username, password}).then(r=>{
                setToken(r.token)
            }).catch(e=>{
                console.log('token未设置')
                console.log(e)
            })
        }
    }
}
export default bootstrap;