import request from '@/utils/request'

export function call(data) {
    return request({
        url: '/rc/call',
        method: 'post',
        data
    })
}

export function select(data) {
    return request({
        url: '/rc/select',
        method: 'post',
        data
    })
}
