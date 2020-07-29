/**
 * 适应Portal 打开新标签的函数, 每次打开页面都会从后台获取menu
 * 考虑优化可将函数放在Portal index.html中，通过sessionStorage获取
 */
import {select} from "@/api";

export const setWindowOpenNewTabFun = () => {
    // 如果父window已经存在相应的函数，直接赋值
    if (window.parent.openNewTab) {
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
        /**
         * 打开页面内标签
         * @param {String} url 目标url
         * @param {String} tabNameAdorn 如果存在会加在标签后面
         * @param {String} newTabName 新标签名称，如果存在则直接设置为新标签名称
         */
        const openNewTab = (url, tabNameAdorn='', newTabName=undefined) => {
            if (!url) return;
            let menuUrl = url;
            // 存在查询参数
            const idx = url.indexOf('?');
            let query = ''
            if (idx !== -1) {
                menuUrl = url.substring(0, idx);
                query = url.substring(idx, url.length);
            }
            let tabMenuId = Date.now();
            if (!newTabName) {
                // nthTabs需要name这个参数，所以需要从找到相应的菜单配置
                // 这里使用endsWith好处就是数据库menuName和代码的urlName没那么耦合
                const menu = window.menus.filter(m => m.url && m.url.endsWith(menuUrl))[0];
                if (menu) {
                    const {menuId, name} = menu
                    tabMenuId = menuId;
                    newTabName = name + tabNameAdorn;
                    menuUrl = menu.url;
                    // 先关闭再打开
                    // noinspection JSUnresolvedFunction
                    proxyFun.delTab('#' + tabMenuId);
                }
            }
            // noinspection JSUnresolvedFunction
            proxyFun.addTab({
                id: tabMenuId,
                title: newTabName,
                content: getContent(menuUrl + query),
            }).setActTab('#' + tabMenuId);
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
