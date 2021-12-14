
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import {
    MailOutlined,
    QqOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from "@ant-design/icons-vue";
export const asyncRoutes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页',
            icon: MailOutlined
        },
        component: () => import('@/views/home/home.vue')
    },
    {
        path: '/about',
        meta: {
            title: '关于',
            icon: QqOutlined
        },
        redirect: '/about/about1',
        component: () => import('@/views/about/index.vue'),
        children: [
            {
                path: '/about/about1',
                name: 'about1',
                meta: {
                    title: '关于1',
                    icon: AppstoreOutlined
                },
                component: () => import('@/views/about/about.vue')
            },
            {
                path: '/about/about2',
                name: 'about2',
                meta: {
                    title: '关于2',
                    icon: SettingOutlined
                },
                component: () => import('@/views/about/about1.vue')
            }
        ]
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
