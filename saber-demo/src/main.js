import Vue from 'vue'
import App from './App'
import router from './router/router'
import './directives/index'
import './permission' // 权限
import './error' // 日志
import './cache'// 页面缓存
import store from './store'
import { debounce } from './util/util'
import Element from 'element-ui'
import Clipboard from 'v-clipboard'
import i18n from './lang' // Internationalization
import './styles/common.scss'
import GlobalComponents from 'global-components'
import registerGlobalComponent from './components/registerGlobalComponent'

// my table component
import website from '@/config/website'
import Plugins from '@/plugins/index'
import JsonExcel from 'vue-json-excel'
import { initTheme } from './util/theme'

import '@/plugins/utils/syncLoginState'

Vue.use(router)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
  size: 'small',
  tableSize: 'small',
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Plugins)
Vue.use(Clipboard)
Vue.use(GlobalComponents)
Vue.use(registerGlobalComponent)
Vue.use(JsonExcel)

// 加载website
Vue.prototype.website = website

Vue.config.productionTip = false

initTheme()

new Vue({
  router,
  store,
  i18n,
  mounted() {
    window.addEventListener('resize', debounce(() => {
      store.commit('SET_WINDOW_RESIZE')
    }, 200))
  },
  render: h => h(App)
}).$mount('#app')
