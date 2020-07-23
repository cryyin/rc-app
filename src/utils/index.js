const baseURL = process.env["REACT_APP_BASE_PUBLIC_URL"]
// 部署到portal需修改
export const openNewTab = (url) => {
    if (url){
        if (url.startsWith('http')){
            window.open(url, "_blank")
        }else {
            window.open(baseURL + url, "_blank")
        }
    }
}