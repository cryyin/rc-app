export const DATA_SOURCE_KEY = 'rcDataSource'
export const USER_LOGIN_ID_KEY = 'account'
// 数据源在父window设置
export const getDataSource = ()=>{
    if (process.env.NODE_ENV === 'development') return 'TEST'
    return window.parent.rcDataSource || sessionStorage.getItem(DATA_SOURCE_KEY)
}

export const getUserLoginId = ()=>{
    if (process.env.NODE_ENV === 'development') return 'admin'
    return window.parent.rcUserLoginId || sessionStorage.getItem(USER_LOGIN_ID_KEY)
}
