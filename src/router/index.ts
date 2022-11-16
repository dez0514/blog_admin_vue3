
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import {
  ReadOutlined,
  HighlightOutlined,
  ProfileOutlined,
  PictureOutlined,
  TagsOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons-vue";
import Login from '@/views/login/index.vue'
import Main from '@/views/main.vue'
import RouterView from '@/components/routerview.vue'
import { getUserInfo } from '../api/user'
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
    path: '/resume',
    name: 'resume',
    meta: {
      title: '简历管理',
      icon: UserOutlined,
      badge: true
    },
    redirect: '/resume/config',
    component: RouterView,
    children: [
      {
        path: '/resume/config',
        name: 'resumeConfig',
        meta: {
          title: '简历配置',
          icon: PictureOutlined,
        },
        component: () => import('@/views/resume/config.vue')
      },
      {
        path: '/resume/company',
        name: 'resumeCompany',
        meta: {
          title: '工作经历',
          icon: PictureOutlined,
        },
        component: () => import('@/views/resume/company.vue')
      },
      {
        path: '/resume/projects',
        name: 'resumeProjects',
        meta: {
          title: '项目经历',
          icon: PictureOutlined,
        },
        component: () => import('@/views/resume/projects.vue')
      },
    ]
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
// 登录拦截
router.beforeEach(async(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (typeof (to.meta.title) === 'string') document.title = to.meta.title
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (!token) {
      localStorage.clear()
      next('/login')
    } else {
      const userinfo = localStorage.getItem('userinfo') || ''
      if(!userinfo || !(JSON.parse(userinfo) && JSON.parse(userinfo).username)) {
        const res: any = await getUserInfo()
        if (Number(res.code) === 0) {
          localStorage.setItem('userinfo', JSON.stringify(res.data))
          next()
        } else {
          next('/login')
        }
      } else {
        next()
      }
    }
  } else {
    if (token) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
