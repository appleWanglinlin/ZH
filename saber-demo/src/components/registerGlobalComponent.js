// 将组件注册为全局组件

import BasicContainer from './basic-container/main.vue'
import BasicBlock from './basic-block/main.vue'
import ThirdRegister from './third-register/main.vue'
import ElBtp from './el-btp/index.vue'

export default {
  install(Vue) {
    [
      ElBtp,
      BasicContainer,
      BasicBlock,
      ThirdRegister
    ].forEach(item => {
      if (Array.isArray(item)) {
        Vue.component(item[0], item[1])
      } else {
        if (item.name) {
          Vue.component(item.name, item)
        } else {
          console.error('未设置组件名，注册全局组件失败', item)
        }
      }
    })
  }
}
