import Vue from 'vue'
import Router from '@/router/router'
import $store from '@/store/index'
import Index from '@/page/index/index.vue'
import Layout from '@/page/index/layout.vue'
import { deepClone, pathToUpperCamelCase, upperCamelCaseToString } from '@/util/util'
import { getRouterCache } from '@/router/routerUtil'

// 添加标签路由
function addTabRoute({ name, path, component, meta, beforeEnter }) {
  return [
    {
      path: '/common',
      component: Index,
      children: [
        {
          path: '',
          component: Layout,
          children: [
            {
              name,
              path,
              component: Vue.extend({
                name,
                data() {
                  return {
                    props: this.$route.meta.data
                  }
                },
                activated() {
                  this.update()
                },
                created() {
                  if (!this.$route.meta.$keepAlive) {
                    this.update()
                  }
                },
                methods: {
                  update() {
                    this.props = this.$route.meta.data
                  }
                },
                render(h) {
                  return h(component, {
                    // 将路由params设置为组件的props
                    props: this.props,
                    on: {
                      update: (...args) => {
                        this.$route.meta.cache.callback.apply(null, args)
                      },
                      // 处理关闭标签后返回到来源页面，并执行回调
                      close: (...args) => {
                        const { referer, callback } = this.$route.meta.cache

                        // 将来源地址类型设为0，则不会刷新页面
                        this.$store.commit('UPDATE_REFERER', {
                          type: 0,
                          from: 'newTab'
                        })

                        callback.apply(null, args)
                        closeCurrentTab(this.$route.name)
                        this.$router.replace(referer)
                      }
                    }
                  })
                }
              }),
              meta: { ...meta },
              beforeEnter
            }
          ]
        }
      ]
    }
  ]
}

export function closeCurrentTab(closeRouteName) {
  const { tagList } = $store.state.tags
  const toRouteName = pathToUpperCamelCase(closeRouteName)
  const tagIndex = tagList.findIndex(item => item.label === toRouteName || item.value === closeRouteName)
  if (tagIndex > -1) {
    $store.commit('DEL_TAG', tagList[tagIndex])
  }
}

// src/router/page/index.js 中404路由调用
export function beforeEnter(to, from, next) {
  if (/^\/common\//.test(to.redirectedFrom)) {
    const { tagWel } = $store.state.tags
    closeCurrentTab(to.redirectedFrom)

    {
      const homeRouteName = 'WelIndex'
      const { value, meta } = tagWel
      $store.commit('ADD_TAG', {
        label: homeRouteName,
        value: value,
        meta: { ...meta },
        group: getRouterCache('group') || []
      })
      if (from.name === homeRouteName) {
        next(false)
      } else {
        next({ name: homeRouteName, replace: true })
      }
    }
    return
  }
  next()
}

export default function() {
  Vue.prototype.$newTab = (options) => {
    const router = Router
    const {
      path,
      component,
      data,
      callback = () => {},
      clearCache = false,
      menuId
    } = options
    const title = options.title.slice(0, 20)

    // 没有严格的判断是否是vue组件
    if (Object.prototype.toString.call(component) !== '[object Object]') {
      throw new Error('component参数必须为组件')
    }

    if (!path && typeof component.name !== 'string') {
      const pathMsg = component.__file || ''
      throw new Error(`传入的组件 ${pathMsg} 未配置 name 属性`)
    }

    let pathname = path || upperCamelCaseToString(component.name)
    pathname = '/common/' + pathname.replace(/^\//, '')
    const name = pathToUpperCamelCase(pathname)
    const { name: routeName, params, query, meta } = router.currentRoute
    const cacheData = {
      referer: {
        name: routeName,
        params: deepClone(params),
        query: deepClone(query)
      },
      callback
    }

    // 未匹配到路由则创建
    if (router.getRoutes().findIndex(item => item.name === name) === -1) {
      const route = addTabRoute({
        name,
        path: pathname,
        component,
        meta: {
          id: menuId || meta.id, // 对应 menuId
          name: title,
          cache: cacheData,
          data,
          $keepAlive: true,
          isAuth: true
        }
      })
      route.forEach(item => router.addRoute(item))
    } else {
      const r = router.resolve({ name })
      // 匹配到路由则更新缓存的数据
      Object.assign(r.route.meta, {
        id: menuId || meta.id,
        name: title,
        cache: cacheData,
        data,
        $keepAlive: true
      })
      // 更新meta.name
      $store.commit('UPDATE_TAG_NAME_BY_VALUE', { value: pathname, title })
    }

    $store.commit('UPDATE_REFERER', {
      type: Number(clearCache),
      from: 'newTab'
    })

    router.push({ name })
  }
}
