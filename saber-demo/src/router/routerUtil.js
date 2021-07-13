import { pathToUpperCamelCase } from '@/util/util'
import i18n from '@/lang/index'
import RouterError from '@/components/error-page/router.vue'
import { isSaas } from '@/config/env'
import store from '@/store/index'

// 缓存数据
const cache = {
  group: '',
  meta: {}
}

/** 设置浏览器标签名称 */
export function setTitle(title) {
  const defaultTitle = isSaas ? store.getters.website.title : i18n.t('title')
  title = title ? `${title}-${defaultTitle}` : defaultTitle
  document.title = title
}

/** 生成标题 */
export function generateTitle(title, key) {
  if (!key) return title
  const hasKey = i18n.te('route.' + key)
  if (hasKey) {
    return i18n.t('route.' + key)
  }
  return title
}

/** 处理路由，处理 路径 与 网址 两种情况 */
export function getPath(params) {
  const src = params.src
  let result = src || '/'
  if (isURL(src)) {
    result = `/myiframe/urlPath?${objToform(params)}`
  }
  return result
}

/** 根据参数来决定返回 { path } 还是 { name } */
export function getRouteNameOrPath(params) {
  const src = params.src
  if (!src) return { path: '/' }
  if (isURL(src)) return { name: 'iframe', query: params }

  // 确保newTab标签通过path跳转（确保可以进入到404路由）
  if (/^\/common\//.test(src)) return { path: src }

  const name = pathToUpperCamelCase(src)
  return { name }
}

/** 获取路由的路径 */
export function getValue(route) {
  return route.query.src || route.path
}

/**
 * 将菜单的数据注入到对应的路由中
 * @param {array} menus
 */
export function injectDataToRoute(router, menus = []) {
  // 设置 props默认值 作用就是将字段设置成配置的
  const propsDefault = { label: 'name', path: 'path', icon: 'icon', children: 'children', meta: 'meta' }
  Object.assign(propsDefault, store.getters.website.menu.props)
  const { label, children } = propsDefault
  const routeRecords = router.getRoutes()
  const recursion = (data) => {
    if (Array.isArray(data)) {
      data.forEach(item => recursion(item))
    } else {
      const routeName = pathToUpperCamelCase(data.path)
      const route = routeRecords.find(route => route.path === data.path || route.name === routeName)
      if (route) {
        route.meta = Object.assign(route.meta || {}, {
          name: data[label],
          id: data.id,
          isAuth: true
        })
      } else {
        // 路由不存在，则动态创建404页面
        router.addRoute('MainLayout', {
          path: data.path,
          name: routeName,
          component: RouterError,
          meta: {
            name: data[label],
            id: data.id,
            isAuth: true
          }
        })
      }
      recursion(data[children])
    }
  }
  recursion(menus)
}

/**
 * 设置 缓存路由数据
 * @param {{group:any;meta:object}} data
 */
export function setRouterCache(data) {
  if (hasOwnProperty(data, 'group')) {
    cache.group = data.group
  }
  if (hasOwnProperty(data, 'meta')) {
    cache.meta = data.meta
  }
}

/**
 * 获取值。未提供`key`则返回`cache`对象
 * @param {'group'|'meta'} key
 */
export function getRouterCache(key) {
  return key ? cache[key] : cache
}

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/** 这个的作用是 为了检查出网页链接，因为本项目用到了 iframe */
function isURL(s) {
  if (s.includes('html')) return true
  return /^http[s]?:\/\/.*/.test(s)
}

/** 将参数处理为参数的形式拼接 */
function objToform(obj) {
  const result = []
  Object.keys(obj).forEach(ele => {
    result.push(`${ele}=${obj[ele]}`)
  })
  return result.join('&')
}
