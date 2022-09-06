
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import {
  ReadOutlined,
  HighlightOutlined,
  ProfileOutlined,
  PictureOutlined,
  TagsOutlined,
  MailOutlined,
  SettingOutlined
} from "@ant-design/icons-vue";
import Login from '@/views/login/index.vue'
import Main from '@/views/main.vue'
import RouterView from '@/components/routerview.vue'
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/article',
    meta: {
      title: '文章管理',
      icon: ReadOutlined
    },
    redirect: '/article/create',
    component: RouterView,
    children: [
      {
        path: '/article/create/:id?',
        name: 'articleCreate',
        meta: {
          title: '创建/编辑文章',
          icon: HighlightOutlined
        },
        component: () => import('@/views/article/articleCreate.vue')
      },
      {
        path: '/article/list',
        name: 'articleList',
        meta: {
          title: '文章列表',
          icon: ProfileOutlined
        },
        component: () => import('@/views/article/articleList.vue')
      },
      {
        path: '/article/detail/:id',
        name: 'articleDetail',
        meta: {
          title: '文章详情'
        },
        component: () => import('@/views/article/articleDetail.vue')
      }
    ]
  },
  {
    path: '/picture',
    name: 'picture',
    meta: {
      title: '图片管理',
      icon: PictureOutlined,
    },
    component: () => import('@/views/pics/index.vue')
  },
  {
    path: '/tags',
    name: 'tags',
    meta: {
      title: '标签管理',
      icon: TagsOutlined,
    },
    component: () => import('@/views/tags/index.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    meta: {
      title: '留言管理',
      icon: MailOutlined,
      badge: true
    },
    component: () => import('@/views/comment/index.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '测试页面',
      icon: SettingOutlined
    },
    component: () => import('@/views/home/home.vue')
  }
]
const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录页面'
    }
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
      component: Main,
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
  if (typeof (to.meta.title) === 'string') document.title = to.meta.title
  if (to.path !== '/login' && localStorage.getItem('isLogin') !== 'true') next('/login')
  else next()
})

export default router
