import {getRequest} from "@/tool/request";
import {getToken} from "@/tool/cookie";

export const initMenu = (router , store)=>{
    if(getToken() && store.state.routes.routes.length>0) return ;
    getRequest('/admin/menus').then(resp=>{
        const data = resp.data;
        if(data){
            let fmtRoutes = formatRoutes(data);
            fmtRoutes.forEach(item=>{
                router.addRoute(item)
            })
            store.commit('routes/initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes = (routes)=>{
    let fmRoutes = [];
    routes.forEach(router=>{
        let {
            path,
            name,
            component,
            redirect,
            meta_title,
            meta_icon,
            children
        }=router;
        if(children && children instanceof Array){
            children = formatRoutes(children);
        }
        let fmRoute = {
            path:path,
            component(resolve){
                require(['@/views'+component],resolve);
            }
        }
        if(name) fmRoute.name = name;
        if(redirect) fmRoute.redirect = redirect;
        if(children) fmRoute.children = children;
        if(meta_icon || meta_title){
            fmRoute.meta={
                title:meta_title,
                icon:meta_icon
            }
        }
        fmRoutes.push(fmRoute);
    })
    return fmRoutes;
}
