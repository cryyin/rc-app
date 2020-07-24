import request from '@/utils/request'
import {isFunction} from 'lodash'
import {baseURL} from "@/utils/index";
// 适应Portal 打开新标签的函数
export const setWindowOpenNewTabFun = ()=>{
    // 获取菜单配置
    const sql = "select menu_id, parent_id, url, name from sys_menu m " +
        "start with name = '风险管理' connect by prior menu_id = parent_id";
    request.post('/rc/select',{sql, params:{}}).then(r=>{
        // 全局变量
        if(r.data){
            window.menus = r.data
            // 判断父级是否存在相应函数
            if(window.parent && window.parent.nthTabs){
                const proxyFun = window.parent.nthTabs
                if (isFunction(proxyFun)){
                    // 设置全局函数
                    // noinspection JSConstantReassignment
                    window.openNewTab = (url) => {
                        if (!url) return;
                        let menuUrl = url;
                        const idx = url.indexOf('?');
                        if(idx !== -1){
                            menuUrl = url.substring(0, idx);
                        }
                        const menu = window.menus.filter(m=>m.endsWith(menuUrl))[0];
                        // 如果能够找到对应的菜单配置
                        if (menu){
                            const {menuId, name} = menu
                            // noinspection JSUnresolvedFunction
                            proxyFun.addTab({
                                id: menuId,
                                title: name,
                                content: getContent(baseURL + url),
                            }).setActTab('#' + menuId);
                        }
                    }
                }
            }
        }
    })
}

function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
}

export const applyPolyfill = () => {
    setWindowOpenNewTabFun();
}
export default applyPolyfill;