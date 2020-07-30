export const DATA_SOURCE_KEY = 'rcDataSource'
export const USER_LOGIN_ID_KEY = 'account'
// 数据源在父window设置
export const getDataSource = ()=>{
    return window.parent.rcDataSource || sessionStorage.getItem(DATA_SOURCE_KEY) || ''
}

export const getUserLoginId = ()=>{
    return window.parent.rcUserLoginId || sessionStorage.getItem(USER_LOGIN_ID_KEY) || ''
}
