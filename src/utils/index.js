const baseURL = process.env["REACT_APP_BASE_PUBLIC_URL"]
// 部署到portal需修改
export const openInNewTab = (url) => {
    if (url){
        if (url.startsWith('http')){
            window.open(url, "_blank")
        }else {
            window.open(baseURL + url, "_blank")
        }
    }
}

// 考虑到项目会引入Portal，因此默认调用外部的打开新窗口函数
const openNewTabPolyfill = window.openNewTab || window.parent.window.openNewTab
export const openNewTab =  openNewTabPolyfill ?  openNewTabPolyfill : openInNewTab