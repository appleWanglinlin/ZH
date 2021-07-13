<template>
  <div v-if="showTag" class="avue-tags">
    <!-- tag盒子 -->
    <div v-if="contextmenuFlag" :style="{left:contentmenuX+'px',top:contentmenuY+'px'}" class="avue-tags__contentmenu">
      <div class="item" @click="clearCacheTags">{{ $t('tagsView.clearCache') }}
      </div>
      <div class="item" @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}
      </div>
      <div class="item" @click="closeAllTags">{{ $t('tagsView.closeAll') }}
      </div>
    </div>
    <div :class="{'avue-tags__box--close':!website.isFirstPage}" class="avue-tags__box">
      <el-tabs v-model="active" :closable="tagLen!==1" type="card" @contextmenu.native="handleContextmenu" @click.native="handleClick" @tab-click="openTag" @edit="menuTag">
        <el-tab-pane v-for="item in tagList" :key="item.value" :label="generateTitle(item)" :name="item.value" />

      </el-tabs>
      <el-dropdown class="avue-tags__menu">
        <el-button size="mini" class="p-2" plain icon="el-icon-arrow-down" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">{{ $t('tagsView.closeOthers') }}</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">{{ $t('tagsView.closeAll') }}</el-dropdown-item>
          <el-dropdown-item @click.native="clearCacheTags">{{ $t('tagsView.clearCache') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { clearCache } from '@/api/user'
import { generateTitle, getPath, getRouteNameOrPath } from '@/router/routerUtil'

export default {
  name: 'Tags',
  data() {
    return {
      active: '',
      contentmenuX: '',
      contentmenuY: '',
      contextmenuFlag: false
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'tagList', 'tag', 'website']),
    ...mapState({
      showTag: state => state.common.showTag
    }),
    tagLen() {
      return this.tagList.length || 0
    }
  },
  watch: {
    tag() {
      this.setActive()
    },
    contextmenuFlag() {
      window.addEventListener('mousedown', this.watchContextmenu)
    }
  },
  mounted() {
    this.setActive()
  },
  methods: {
    generateTitle(item) {
      return generateTitle(
        item.meta.name || item.label,
        (item.meta || {}).i18n
      )
    },
    watchContextmenu(event) {
      if (!this.$el.contains(event.target) || event.button !== 0) {
        this.contextmenuFlag = false
      }
      window.removeEventListener('mousedown', this.watchContextmenu)
    },
    handleClick() {
      this.contextmenuFlag = false
    },
    handleContextmenu(event) {
      let target = event.target
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false
      if (target.className.indexOf('el-tabs__item') > -1) flag = true
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    // 激活当前选项
    setActive() {
      this.active = this.tag.value
    },
    menuTag(value, action) {
      if (action === 'remove') {
        const { key, tag } = this.findTag(value)
        if (!tag) return // 容错 #15
        this.$store.commit('DEL_TAG', tag)
        if (tag.value === this.tag.value) {
          // 如果有来源地址，且tagList中存在 则关闭时跳到来源地址
          if (tag.meta.referer) {
            const newTag = this.tagList.find(item => item.value === tag.meta.referer)
            if (newTag) {
              this.openTag(newTag)
              return
            }
          }

          // 如果未匹配到，则关闭本标签让前推一个
          const newTag = this.tagList[key === 0 ? key : key - 1]
          this.openTag(newTag)
        }
      }
    },
    openTag(item) {
      let tag
      if (item.name) {
        tag = this.findTag(item.name).tag
      } else {
        tag = item
      }
      this.$store.commit('UPDATE_REFERER', {
        type: 0,
        from: 'tab'
      })
      this.$router.push({
        ...getRouteNameOrPath({
          name: tag.label,
          src: tag.value
        }),
        query: tag.query
      })
    },
    closeOthersTags() {
      this.contextmenuFlag = false
      this.$store.commit('DEL_TAG_OTHER')
    },
    findTag(value) {
      let tag, key
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item
          key = index
        }
      })
      return { tag: tag, key: key }
    },
    closeAllTags() {
      this.contextmenuFlag = false
      this.$store.commit('DEL_ALL_TAG')
      this.$router.push({
        path: getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })
    },
    clearCacheTags() {
      this.$confirm('是否需要清除缓存?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearCache().then(() => {
          this.$message.success('清除完毕')
        })
      })
    }
  }
}
</script>
