<template>
  <div class="error-page">
    <div
      class="img"
      style=" background-image: url('/img/bg/404.svg');"
    />
    <div class="content">
      <h2 class="fs-3">路由未匹配到组件</h2>
      <div class="my-3 text-muted fs-4">{{ desc() }}</div>
      <div class="actions">
        <el-button type="primary" size="mini" @click="close">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { closeCurrentTab } from '@/plugins/newTab/index'

export default {
  name: 'RouterError',
  props: {
    type: {
      type: String,
      default: 'main' // main: 正常路由， page: $newPage用到的路由
    }
  },
  methods: {
    close() {
      closeCurrentTab(this.$route.path)
      this.$router.replace('/')
    },
    desc() {
      const d = {
        main: {
          prefix: '_',
          pathFn: p => p
        },
        page: {
          prefix: '~',
          pathFn: p => p.replace(/^\/p\//, '/')
        }
      }[this.type]
      const filepath = this.$route.path.replace(/[?#].*$/, '').replace(/\/(\w+)$/, `/${d.prefix}$1`)
      return `/views${d.pathFn(filepath)}.vue 文件不存在`
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
