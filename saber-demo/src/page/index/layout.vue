<template>
  <div class="h-100 overflow-auto">
    <keep-alive :include="includes" :max="15">
      <router-view v-if="!reload" />
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Router from '@/router/router'
import Store from '@/store/index'
import watermark from '@/util/watermark'

export default {
  computed: {
    ...mapState({
      reload: state => state.keepAlive.reload,
      includes: state => state.keepAlive.list
    }),
    ...mapGetters(['userInfo'])
  },
  watch: {
    $route: {
      handler(to) {
        this.updateIncludes(to)
      },
      immediate: true
    }
  },
  created() {
    const text = (this.userInfo.real_name || this.userInfo.nick_name) + `(${this.userInfo.account})`
    watermark(text)
  },
  methods: {
    updateIncludes(to) {
      let componentName
      const matechedComponents = Router.getMatchedComponents(to)
      if (matechedComponents.length > 0) {
        const m = matechedComponents[matechedComponents.length - 1]

        // 是否是 Vue.extend 创建的组件（newTab使用了该方法）
        if (typeof m === 'function' && m.extendOptions && m.extendOptions.name) {
          componentName = m.extendOptions.name
        } else {
          componentName = m.name
        }
      }

      // 更新 keepAlive.list 数组，避免存储过多脏数据
      Store.dispatch('updateList')

      // 如果有组件名称 且 $keepAlive为true 且 来源类型为1 则刷新页面
      if (componentName && to.meta.$keepAlive && this.$store.state.keepAlive.referer.type === 1) {
        this.$store.dispatch('reload', {
          scope: this,
          name: componentName
        })
      } else {
        Store.commit(to.meta.$keepAlive ? 'ADD_KEEP_ALIVE' : 'DEL_KEEP_ALIVE', componentName)
      }
    }
  }
}
</script>
