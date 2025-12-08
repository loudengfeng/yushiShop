import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
// import ParentView from '@/components/ParentView';
// import InnerLink from '@/layout/components/InnerLink'
let routes = []
// 公共路由
export const constantRoutes = [
    {
        path: '/',
        component: () => import('@/views/home/index.vue'),
        redirect: '/user',
        meta: {
            title: '自述文件'
        },
        children: [{
            path: '/user',
            component: () => import('@/views/user.vue'),
            meta: {
                title: '用户管理'
            }
        },
          {
            path: '/checkUser',
            component: () => import('@/views/realnameVerification.vue'),
            meta: {
              title: '用户审核'
            }
          },
            {
                path: '/vip',
                component: () => import('@/views/vip.vue'),
                meta: {
                    title: '会员管理'
                }
            },
            {
                path: '/menu',
                component: () => import('@/views/menu.vue'),
                meta: {
                    title: '菜单管理'
                }
            },
            {
                path: '/shopManagement',
                component: () => import('@/views/shopManagement.vue'),
                meta: {
                    title: '商品管理'
                }
            }, {
                path: '/shopAdd',
                component: () => import('@/views/shopAdd.vue'),
                meta: {
                    title: '商品新增'
                }
            },
            {
                path: '/order',
                component: () => import('@/views/order.vue'),
                meta: {
                    title: '全部订单'
                }
            }]
    },
    {
        path: '/login',
        component: (resolve) => require(['@/views/login'], resolve),
        hidden: true
    },
    // {
    //   path: '/test',
    //   component: (resolve) => require(['@/views/test'], resolve),
    //   hidden: true
    // },
    {
        path: '/404',
        component: (resolve) => require(['@/views/error/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: (resolve) => require(['@/views/error/401'], resolve),
        hidden: true
    },
    {
        path: '*',
        component: (resolve) => require(['@/views/error/401'], resolve),
        hidden: true
    }
]

export default new Router({
    routes: constantRoutes
})
