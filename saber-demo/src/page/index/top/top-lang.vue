<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <el-button icon="el-icon-language" size="mini" class="border-0" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { generateTitle, setTitle } from '@/router/routerUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'TopLang',
  computed: {
    ...mapGetters(['language', 'tag'])
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.commit('SET_LANGUAGE', lang)
      const tag = this.tag
      const title = generateTitle(
        tag.label,
        (tag.meta || {}).i18n
      )
      // 根据当前的标签也获取label的值动态设置浏览器标题
      setTitle(title)
    }
  }
}
</script>
