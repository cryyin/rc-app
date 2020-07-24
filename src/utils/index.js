export const baseURL = process.env["REACT_APP_BASE_PUBLIC_URL"]

/**
 * 浏览器新标签页
 * @param {string} url
 */
export const innerOpenNewTab = (url) => {
    if (url){
        if (url.startsWith('http')){
            window.open(url, "_blank")
        }else {
            window.open(baseURL + url, "_blank")
        }
    }
}

/**
 * 打开一个新的标签页
 * @param {string} url
 */
export const openNewTab = (url)=>{
    // 如果需要适应Portal
    if (window.openNewTab){
        return window.openNewTab(url);
    }
    return innerOpenNewTab(url);
}