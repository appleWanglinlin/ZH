<script>
import md5 from 'js-md5'
import { keyPrefix } from '@/plugins/newPage/index'
import RouterError from '@/components/error-page/router.vue'
import watermark from '@/util/watermark'
import AutoRefreshToken from '@/plugins/utils/autoRefreshToken'

export default {
  provide: {
    // 当前页面是否是通过`window.open`打开
    isChild: document.referrer.indexOf(location.origin) > -1
  },
  created() {
    const userInfo = this.$store.getters.userInfo
    const text = (userInfo.real_name || userInfo.nick_name) + `(${userInfo.account})`
    watermark(text)

    const art = new AutoRefreshToken()
    this.$once('hook:beforeDestroy', () => art.destroy())
  },
  methods: {
    /**
     * status 1关闭， 0不关闭
     */
    setLocal(status, args) {
      const hash = md5(decodeURIComponent(this.$route.fullPath))
      localStorage.setItem(keyPrefix + hash, `${Date.now()}-${status}-${JSON.stringify(args)}`)
    }
  },
  render(h) {
    // /-/ 前面部分为路径，后面部分为参数 （这样子做只为了减少url参数的数量，稍微美观点）
    const arr = this.$route.path.replace(/^\/p\//i, '/').split('/-/')
    const path = arr[0]
    const props = {}
    const routeParams = arr.length > 1 ? arr[1].split(/\/+/) : []
    Object.entries(this.$route.query || {}).forEach(([key, value]) => {
      props[key] = decodeURIComponent(value)
    })

    // 优先匹配 newPage，未匹配到则从普通路由中找
    const routePath = '/_np' + path
    const routes = this.$router.getRoutes()
    let normalIndex = -1
    let pageIndex = -1
    routes.some((item, index) => {
      if (item.path === routePath) pageIndex = index
      if (item.path === path) normalIndex = index
      return normalIndex > -1 && pageIndex > -1
    })

    // 默认未匹配到路由则跳到 RouterError 组件，不走 404 页面
    let main = h(RouterError, {
      props: {
        type: 'page'
      }
    })

    if (normalIndex > -1 || pageIndex > -1) {
      const comps = this.$router.getMatchedComponents(pageIndex > -1 ? routePath : path)
      const comp = comps[comps.length - 1]
      if (comp.name !== 'RouterError') {
        main = h(comp, {
          ref: 'childRef',
          props: Object.assign({}, props, { routeParams, routeQuery: props }),
          on: {
            title(title) {
              document.title = title
            },
            close: (...args) => {
              this.setLocal(1, args)
            },
            update: (...args) => {
              this.setLocal(0, args)
            }
          }
        })
      }
    }

    return h('basic-container', { class: 'm-0 p-0' }, [main])
  }
}
</script>
