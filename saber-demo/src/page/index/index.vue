<template>
  <div class="h-100">
    <el-container v-if="showMain" class="h-100 zh-container" :class="{'aside-collapse':keyCollapse}">
      <el-header :height="topHeight" class="ps-0 pe-1 d-flex">
        <Logo class="site-logo" />
        <top class="d-flex flex-grow-1 border-bottom" />
      </el-header>
      <el-container :style="{height:`calc(100% - ${topHeight})`}">
        <el-aside class="aside-menu h-100 d-flex flex-column">
          <sidebar />
          <div class="text-center text-muted" style="opacity:0.6;transform:scale(0.95)">资源版本：{{ version }}</div>
        </el-aside>
        <el-main class="main-container">
          <tags />
          <div id="container" class="layout-container">
            <router-view id="avue-view" class="avue-view" />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div v-else v-loading="true" class="w-100 h-100" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/index.vue'
import sidebar from './sidebar/index.vue'
import admin from '@/util/admin'
import Logo from './logo.vue'
import { resetRouter } from '@/router/router'
import AutoRefreshToken, { isExpired } from '@/plugins/utils/autoRefreshToken'
import { buildTime } from '@/config/env'
import { injectDataToRoute } from '@/router/routerUtil'

export default {
  name: 'Index',
  components: {
    Logo,
    top,
    tags,
    sidebar
  },
  provide() {
    return {
      index: this
    }
  },
  data() {
    return {
      version: buildTime,
      topHeight: '50px',
      showMain: false
    }
  },
  computed: {
    ...mapGetters(['isMenu', 'isLock', 'keyCollapse', 'menu'])
  },
  created() {
    // 自动刷新刷新token
    const art = new AutoRefreshToken()
    this.$once('hook:beforeDestroy', () => art.destroy())

    this.getMenus()
  },
  mounted() {
    this.init()
  },
  methods: {
    showCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    // 初始化
    init() {
      this.$store.commit('SET_SCREEN', admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen())
        }, 0)
      }
      this.$store.dispatch('FlowRoutes').then(() => {
      })
    },
    // 打开菜单
    getMenus(item = {}) {
      const jumpToLogin = (needRequest = true) => {
        this.$store.dispatch('LogOut', needRequest).then(() => {
          resetRouter()
          location.replace('/login')
        })
      }

      if (isExpired()) return jumpToLogin(false)

      this.$store.dispatch('GetMenu', item.id).then(data => {
        if (data.length !== 0) {
          injectDataToRoute(this.$router, data)
        }
        this.showMain = true
      }).catch(() => jumpToLogin())
    }
  }
}
</script>
