import { beforeEnter as commonTabBeforeEnter } from '@/plugins/newTab/index'
import NewPage from '@/page/newPage/index.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
      name: '登录页',
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    },
    beforeEnter: commonTabBeforeEnter
  },
  {
    path: '/403',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/500',
    component: () =>
      import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/',
    name: '主页',
    redirect: '/wel'
  },
  {
    path: '/p/*',
    component: NewPage,
    meta: {
      isAuth: true
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]
