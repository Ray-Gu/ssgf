import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)

// import Layout from "@/views/Layout";
import {getToken} from "@/tool/cookie";

import store from '../store/index'
import {getRequest} from "@/tool/request";
import {initMenu} from "@/tool/menus";
// import {initMenu} from "@/tool/menus";

//替换原始路由模型中的方法，修正重复刷新的错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push=function push(location,onResolve,onReject){
    if(onResolve || onReject) return originalPush.call(this,location,onResolve,onReject);
    return originalPush.call(this,location).catch(err=>err);
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace=function replace(location,onResolve,onReject){
    if(onResolve || onReject) return originalReplace.call(this,location,onResolve,onReject);
    return originalReplace.call(this,location).catch(err=>err);
}

/*路由约定，学习panjiachen，菜单从路由获取
* path:路径
* name:'router-name' //用于keep-alive，必须设置
* hidden:true，不显示在菜单中
* redirect:noRedirect  如果设置则在breadCrumb中不跳转
*
* meta:{
*   roles:['admin','editor']角色管理时使用
*   title:'title'，显示在菜单和面包屑中的名字
*   icon:'el-icon-x',显示在菜单尚的icon
*   breadcrumb:false,不显示在面包屑
*   activeMenu：‘’，高亮显示，暂时用不尚
* }
* */



export const constantRoutes = [
    {
        path:'/login',
        name:'Login',
        component:()=>import('@/views/Login'),
    },
    // {
    //         path: '/',
    //         component: Layout,
    //         redirect: '/dashboard',  //给 breadcrumb
    //
    //         children: [
    //             {
    //                 path: 'dashboard',
    //                 name: 'DashBoard',   //keep alive
    //                 component: () => import('@/views/DashBoard'),
    //                 meta: {title: '首页', icon: 'el-icon-s-home'},
    //             }
    //         ]
    //     },
    // {
    //     path: '/sales',
    //     name: 'Sales',
    //     component: Layout,
    //     meta: {title: '销售中心', icon: 'el-icon-sell'},
    //     children: [{
    //         path: 'member',
    //         component: () => import('@/views/Sales/Member'),
    //         meta: {title: '会员管理', icon: 'el-icon-s-custom'}
    //     },
    //
    //     ]
    // },
    // {
    //     path: '/purchase',
    //     name: 'Purchase',
    //     component: Layout,
    //     meta: {title: '采购管理', icon: 'el-icon-shopping-cart-full'},
    //     children: [{
    //         path: 'purchaseorder',
    //         component: () => import('@/views/Purchase/Purchase'),
    //         meta: {title: '采购下单', icon: 'el-icon-s-order'}
    //     }
    //     ]
    // },
    //
    // {
    //     path: '/HR',
    //     name: 'HR',
    //     component: Layout,
    //     meta: {title: '人事管理', icon: 'el-icon-coordinate'},
    //     children: [
    //     {
    //         path: 'employee',
    //         component: () => import('@/views/HR/Employee'),
    //         meta: {title: '职员列表', icon: 'el-icon-user'}
    //     },
    //     {
    //         path: 'bonus',
    //         component: () => import('@/views/HR/Bonus'),
    //         meta: {title: '绩效计算', icon: 'el-icon-s-marketing'}
    //     }
    //     ]
    // },
    // {
    //     path:'/baseInfo',
    //     name:'BaseInfo',
    //     component:Layout,
    //     meta:{title:'基本信息',icon:'el-icon-document-copy'},
    //     children: [{
    //         path:'company',
    //         name:'Company',
    //         component:()=>import('@/views/BaseInfo/BaseInfo'),
    //         meta:{title:'企业信息',icon:'el-icon-school'}
    //     },
    //     {
    //         path: 'posedu',
    //         component: () => import('@/views/BaseInfo/PosEdu'),
    //         meta: {title: '职位/学历', icon: 'el-icon-s-flag'}
    //     },
    //     {
    //         path: 'goods',
    //         component: () => import('@/views/BaseInfo/Goods'),
    //         meta: {title: '商品信息', icon: 'el-icon-coin'}
    //     }
    //     ]
    // },
    //     {
    //     path:'/Setting',
    //     name:'Setting',
    //         component: Layout,
    //         meta: {title: '设置', icon: 'el-icon-setting'},
    //         children: [{
    //             path: 'menu',
    //             component: () => import('@/views/Setting/Menu'),
    //             meta: {title: '菜单管理', icon: 'el-icon-menu'}
    //         },
    //             {
    //                 path: 'roll',
    //                 component: () => import('@/views/Setting/Roll'),
    //                 meta: {title: '角色管理', icon: 'el-icon-menu'}
    //             },
    //             {
    //                 path: 'user',
    //                 component: () => import('@/views/Setting/User'),
    //                 meta: {title: '系统用户', icon: 'el-icon-menu'}
    //             }
    //         ]
    //
    //     }
    ];

const createRouter = ()=>new VueRouter({
    scrollBehavior:()=>({y:0}),      //路由滚动条的设置
    routes:constantRoutes
})

const router = createRouter();

const whiteList = ['/login'];  //直接放行不需要token验证的清单，避免死循环

router.beforeEach( (to, from, next) => {
    if(to.meta.title){
        document.title =  to.meta.title+'[RaySys]';
    }
    const token = getToken();
    if(token){
        //如果cookie里有Token，如果访问登录页重定向到Login
        if(to.path === '/login'){  //如果有token，访问login页直接转到首页
            next({path:'/'});
        }
        //todo:判断是否要获取用户信息，存储到全局Store中,待完成
        if(store.state.user.user.name ===''){
            getRequest('/admin/employees/user/info').then(resp=>{
                if(resp){
                    store.state.user.user = resp.data;
                }
            })
        }
        //todo:判断是否要获取企业信息，存储到全局Store中,待完成
        if(store.state.company.info.name ===''){
            getRequest('/admin/company').then(resp=>{
                if(resp){
                    store.state.company.info = resp.data;
                }
            })
        }
        initMenu(router,store);
        next();
    }else {
        //没有token，重定向到Login页面
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        }
        else {
            next({
                path:'/login',
                query:{
                    redirect:to.path,
                }
            });
        }

    }
})

export default router;
