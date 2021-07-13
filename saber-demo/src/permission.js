/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from './store'
import { validatenull } from '@/util/validate'
import { getToken } from './util/auth'
import NProgress from 'nprogress' // progress bar
import { generateTitle, getRouterCache, setTitle } from './router/routerUtil'

NProgress.configure({
  showSpinner: false
})

router.beforeEach((to, from, next) => {
  const meta = to.meta || {}
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu

  const hasToken = getToken()
  hasToken && store.commit('SET_TOKEN', hasToken)
  store.commit('SET_IS_MENU', isMenu === undefined)
  if (hasToken) {
    if (to.path === '/login') { // 如果登录成功访问登录页跳转到主页
      next({ path: '/' })
    } else {
      // 如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      if (!store.getters.token || store.getters.token.length === 0) {
        store.dispatch('FedLogOut').then(() => {
          next({ path: '/login' })
        })
      } else {
        const value = to.query.src || to.fullPath
        const label = to.query.name || to.name
        const meta = to.meta || getRouterCache('meta') || {}
        const i18n = to.query.i18n

        // 拦截路由（主要拦截：路由存在但菜单不存在，避免用户知道路由地址可直接访问页面）
        if (meta.isAuth === undefined) return next('403')

        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            meta: !i18n ? (meta ? { ...meta } : {}) : { i18n },
            group: getRouterCache('group') || []
          })
        }
        next()
      }
    }
  } else {
    // 判断是否需要认证，没有登录访问去登录页
    if (meta.isAuth === false) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  const title = store.getters.tag.meta.name || store.getters.tag.label
  const i18n = store.getters.tag.meta.i18n
  // 根据当前的标签也获取label的值动态设置浏览器标题
  setTitle(generateTitle(title, i18n))
})
