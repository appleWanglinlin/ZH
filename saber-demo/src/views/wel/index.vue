<template>
  <basic-container>
    <div class="d-flex flex-wrap">
      <div v-for="(item,index) in configures" :key="index" :style="{width:getWidth(item.width)}">
        <HomeModule v-if="canShow(item.link)" v-bind="item" class="m-1" />
      </div>
    </div>
  </basic-container>
</template>

<script>
import { HomeModule } from '@/components/home-module/index'
import configures from './index'
import commonConfigures from './common'
import config from '@/page/index/sidebar/config'

export default {
  name: 'Wel',
  components: { HomeModule },
  computed: {
    configures() {
      const list = configures.filter(item => this.canShow(item.link))
      return list.length > 0 ? list : commonConfigures
    }
  },
  methods: {
    getWidth(val) {
      return /^(100|\d{1,2})%$/.test(val) ? val : '100%'
    },
    canShow(path) {
      if (!path) return true
      const walk = arr => {
        // 判断菜单中是否包含 `path`（即配置中的`link`）
        return arr.some(item => {
          if (item[config.propsDefault.path] === path) return true
          if (Array.isArray(item[config.propsDefault.children])) {
            return walk(item[config.propsDefault.children])
          }
          return false
        })
      }
      return walk(this.$store.getters.menu)
    }
  }
}
</script>
