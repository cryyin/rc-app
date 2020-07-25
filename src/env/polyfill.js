/**
 * 适应Portal 打开新标签的函数, 每次打开页面都会从后台获取menu
 * 考虑优化可将函数放在Portal index.html中，通过sessionStorage获取
 */
import {select} from "@/api";

export const setWindowOpenNewTabFun = () => {
    // 如果父window已经存在相应的函数，直接赋值
    if (window.parent.openNewTab){
        // noinspection JSConstantReassignment
        window.openNewTab = window.parent.openNewTab
        return;
    }
    // 首先从父window中获取菜单配置
    if (window.parent.rcMenus) {
        window.menus = window.parent.rcMenus
        doSetOpenTabFun();
    } else {
        console.log('fetch menus')
        const sql = "select menu_id, parent_id, url, name from sys_menu m " +
            "start with name = '风险管理' connect by prior menu_id = parent_id";
        select(sql, {}).then(r => {
            if (r.data) {
                window.menus = r.data
                doSetOpenTabFun();
            }
        })
    }

}

const doSetOpenTabFun = () => {
    // 判断父级是否存在相应函数
    const parent = window.parent
    if (parent.nthTabs) {
        const proxyFun = parent.nthTabs
        const openNewTab = (url) => {
            if (!url) return;
            let menuUrl = url;
            let query = ''
            // 存在查询参数
            const idx = url.indexOf('?');
            if (idx !== -1) {
                menuUrl = url.substring(0, idx);
                query = url.substring(idx, url.length);
            }

            // nthTabs需要menuId这个参数，所以需要从找到相应的菜单配置
            const menu = window.menus.filter(m => m.url && m.url.endsWith(menuUrl))[0];
            if (menu) {
                const {menuId, name, url} = menu
                // noinspection JSUnresolvedFunction
                proxyFun.addTab({
                    id: menuId,
                    title: name,
                    content: getContent(url + query),
                }).setActTab('#' + menuId);
            }
        }
        // noinspection JSConstantReassignment
        window.openNewTab = window.parent.openNewTab = openNewTab;
    }
}

function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
}

export const applyPolyfill = () => {
    // 设置openNewTab函数
    !window.openNewTab && setWindowOpenNewTabFun();
}
export default applyPolyfill;
