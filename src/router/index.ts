
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import {
    MailOutlined,
    QqOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from "@ant-design/icons-vue";
export const asyncRoutes: Array<RouteRecordRaw> = [
    {
        path: '/article',
        meta: {
            title: '文章管理',
            icon: QqOutlined
        },
        redirect: '/article/create',
        component: () => import('@/components/routerview.vue'),
        children: [
            {
                path: '/article/create',
                name: 'articleCreate',
                meta: {
                    title: '创建/编辑文章',
                    icon: AppstoreOutlined
                },
                component: () => import('@/views/article/articleCreate.vue')
            },
            {
                path: '/article/list',
                name: 'articleList',
                meta: {
                    title: '文章列表',
                    icon: SettingOutlined
                },
                component: () => import('@/views/article/articleList.vue')
            },
            {
                path: '/article/detail',
                name: 'articleDetail',
                meta: {
                    title: '文章详情'
                },
                component: () => import('@/views/article/articleDetail.vue')
            }
        ]
    },
    {
        path: '/comment',
        name: 'comment',
        meta: {
            title: '留言管理',
            icon: MailOutlined
        },
        component: () => import('@/views/comment/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '测试页面',
            icon: MailOutlined
        },
        component: () => import('@/views/home/home.vue')
    }
]
const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: "/:pathMatch(.*)*",
        name: '404',
        component: () => import('@/views/error/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(), //history模式使用HTML5模式
    routes: [
        {
            path: '/',
            redirect: asyncRoutes[0].path,
            component: () => import('@/views/main.vue'),
            children: [
                ...asyncRoutes
            ]
        },
        ...constantRoutes
    ],
});

router.beforeEach((
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    if (typeof (to.meta.title) === 'string') {
        document.title = to.meta.title
    }
    next()
})

export default router
