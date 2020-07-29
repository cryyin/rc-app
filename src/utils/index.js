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
 * 打开页面内标签
 * @param {String} url 目标url
 * @param {String} tabNameAdorn 如果存在会加在标签后面
 * @param {String} newTabName 新标签名称，如果存在则直接设置为新标签名称
 */
export const openNewTab = (url, tabNameAdorn='', newTabName=undefined)=>{
    // 如果需要适应Portal
    if (window.openNewTab){
        return window.openNewTab(url, tabNameAdorn, newTabName);
    }
    console.log('没找到window.openNewTab')
    return innerOpenNewTab(url);
}