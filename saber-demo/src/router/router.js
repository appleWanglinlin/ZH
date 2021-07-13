/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import PageRouter from './page/' // 页面路由
import ViewsRouter from './views/' // 页面路由
import { injectDataToRoute } from './routerUtil' // 封装的路由控制方法
import AllRouter from './views/all'
import Store from '../store/' // vuex
import { buildTime } from '@/config/env'

Vue.use(VueRouter)
// 创建路由
export const createRouter = () => new VueRouter({
  mode: 'history',
  // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8
  // 这个方法 是控制滚动条
  // 如果 retuen falsy || {} ,则不发生滚动
  scrollBehavior(to, from, savedPosition) {
    // savedPosition 这个参数当且仅当导航 (通过浏览器的 前进/后退 按钮触发) 时才可用  效果和 router.go() 或 router.back()
    if (savedPosition) {
      // 返回savedPosition 其实就是 当用户点击 返回的话，保持之前游览的高度
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [...PageRouter, ...ViewsRouter, ...AllRouter]
})

const Router = createRouter() // 获得 route 实例
injectDataToRoute(Router, Store.state.user.menu)

// 解决重复路由引起的报错，在注册路由组建后使用下方重写路由
;['push', 'replace'].forEach(item => {
  const fn = VueRouter.prototype[item]
  VueRouter.prototype[item] = function(location, clearCache = false) {
    // 是否清除组件缓存
    if (clearCache) {
      Store.commit('UPDATE_REFERER', {
        type: Number(clearCache),
        from: 'router-push'
      })
    }
    return fn.call(this, location).catch(err => {
      if (err.name === 'NavigationDuplicated') return
      // 加载js文件失败可能是因为发布新版导致旧js文件不存在
      if (err.name === 'ChunkLoadError') {
        axios.get('/asserts.json?' + Date.now()).then(res => {
          if (buildTime !== res.data.version) {
            MessageBox.alert('发现新版本，为避免使用异常，需要刷新页面', {
              type: 'info',
              title: '版本更新提示',
              confirmButtonText: '刷新页面'
            }).then(action => {
              if (action === 'confirm') {
                window.location.reload()
              }
            })
          } else {
            routerLoadError('加载资源出错，请刷新重试')
          }
        })
      } else {
        routerLoadError(err.message)
      }
    })
  }
})

function routerLoadError(err) {
  MessageBox.alert(err, '操作失败', { type: 'error' })
}

export function resetRouter() { // 重置路由 比如用于身份验证失败，需要重新登录时 先清空当前的路有权限
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher // reset router
  injectDataToRoute(Router, Store.state.user.menu)
}

export default Router
