// 作用与 GAuth组件 一样，只是用法不一样
import Vue from 'vue'
import store from '@/store/index'

export default () => {
  Vue.prototype.$auth = (...args) => {
    const p = store.state.user.permission || {}
    return args.some(item => p[item])
  }
}
