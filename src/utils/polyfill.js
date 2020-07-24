import request from '@/utils/request'

// 适应Portal 打开新标签的函数
export const setWindowOpenNewTabFun = ()=>{
    console.log('setWindowOpenNewTabFun')
    // 获取菜单配置
    const sql = "select menu_id, parent_id, url, name from sys_menu m " +
        "start with name = '风险管理' connect by prior menu_id = parent_id";
    // TODO 这里应该可以用cookie存储起来
    request.post('/rc/select',{sql, params:{}}).then(r=>{
        console.log('fetch menus')
        // 全局变量
        if(r.data){
            window.menus = r.data
            // 判断父级是否存在相应函数
            const parent = window.parent
            if(parent && parent.nthTabs){
                if (parent.nthTabs){
                    const proxyFun = parent.nthTabs
                    // 设置全局函数
                    // noinspection JSConstantReassignment
                    window.openNewTab = (url) => {
                        if (!url) return;
                        let menuUrl = url;
                        const idx = url.indexOf('?');
                        let query = ''
                        if(idx !== -1){
                            menuUrl = url.substring(0, idx);
                            query = url.substring(idx, url.length);
                        }
                        // TODO 这里应该可以使用一个对应保存 menuUrl与menu的映射
                        const menu = window.menus.filter(m=> m.url && m.url.endsWith(menuUrl))[0];
                        // 如果能够找到对应的菜单配置
                        if (menu){
                            const {menuId, name, url} = menu
                            // noinspection JSUnresolvedFunction
                            proxyFun.addTab({
                                id: menuId,
                                title: name,
                                content: getContent( url+query),
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