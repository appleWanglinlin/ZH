import Index from '@/page/index/index.vue'
import Layout from '@/page/index/layout.vue'

export default [{
  path: '/wel',
  component: Index,
  children: [
    {
      path: '',
      component: Layout,
      redirect: '/wel/index',
      children: [
        {
          path: 'index',
          name: 'WelIndex',
          meta: {
            name: '首页',
            i18n: 'dashboard',
            isAuth: true
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/wel/index.vue')
        }
      ]
    }
  ]
}, {
  path: '/updatePassword',
  name: 'UpdatePassword',
  meta: {
    name: '修改密码',
    i18n: 'updatepasWord',
    isAuth: true
  },
  component: () =>
    import(/* webpackChunkName: "views" */ '@/page/login/updatePassword')
}]
