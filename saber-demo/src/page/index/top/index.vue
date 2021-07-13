<template>
  <div class="top-header">
    <div class="d-flex align-items-center aside-menu-toggle-btn">
      <el-button icon="el-icon-menu2" size="mini" :class="{collapse:isCollapse}" class="border-0" @click="setCollapse" />
    </div>
    <div class="flex-grow-1 d-flex align-items-center mx-2 header-search">
      <top-search v-if="showSearch" class="w-100" />
    </div>
    <div class="d-flex align-items-center">
      <top-theme v-if="showTheme" />
      <!-- <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
        <top-lang />
      </el-tooltip> -->
      <el-tooltip v-if="showFullScren" :content="$t(`navbar.${isFullScren?'screenfullF':'screenfull'}`)" effect="dark" placement="bottom">
        <div>
          <el-button :icon="isFullScren?'el-icon-exit-full-screen':'el-icon-full-screen'" size="mini" class="border-0" @click="handleScreen" />
        </div>
      </el-tooltip>
      <el-dropdown trigger="click">
        <div>
          <el-button size="mini" class="border-0">{{ username }}<i class="el-icon-arrow-down el-icon--right" /></el-button>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editPwd">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { resetRouter } from '@/router/router'
import { mapGetters, mapState } from 'vuex'
import { fullscreenToggel, listenfullscreen } from '@/util/util'
import topSearch from './top-search.vue'
import topTheme from './top-theme.vue'
// import topLang from './top-lang.vue'
import UpdatePassword from '@/page/login/updatePassword.vue'

export default {
  name: 'Top',
  components: {
    topSearch,
    topTheme
    // topLang
  },
  computed: {
    username() {
      return this.userInfo.nick_name || this.userInfo.real_name || this.userInfo.user_name || ''
    },
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu
    }),
    data() {
      return {}
    },
    ...mapGetters([
      'userInfo',
      'isFullScren',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag'
    ])
  },
  watch: {
    themeName: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          const spanNode = document.getElementById('idd')
          if (spanNode) {
            const color = getComputedStyle(spanNode).color
            if (document.getElementById('username')) document.getElementById('username').style.color = color
          }
        })
      }
    }
  },
  mounted() {
    listenfullscreen(this.setScreen)
  },
  methods: {
    handleScreen() {
      fullscreenToggel()
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN')
    },
    logout() {
      this.$confirm(this.$t('logoutTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submitText'),
        cancelButtonText: this.$t('cancelText'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          resetRouter()
          this.$router.push({ path: '/login' })
        })
      })
    },
    editPwd() {
      this.$modal({
        title: '修改密码',
        component: UpdatePassword,
        data: { mode: 1 },
        width: '500px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-header {
  ::v-deep [class^="el-icon-"] {
    font-size: 1.25rem;
  }
}
</style>
