import request from '@/utils/request'

export function call(sql, params={}) {
    return request({
        url: '/rc/call',
        method: 'post',
        data:{sql, params}
    })
}

export function select(sql, params={}) {
    return request({
        url: '/rc/select',
        method: 'post',
        data:{sql, params}
    })
}
