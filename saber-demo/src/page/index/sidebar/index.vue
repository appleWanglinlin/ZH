<template>
  <el-scrollbar class="h-100">
    <div v-if="menu.length===0" class="text-center my-4 no-menu">{{ $t('menuTip') }}</div>
    <el-menu :default-active="nowTagValue"
             :collapse="keyCollapse"
             unique-opened
             mode="vertical"
    >
      <sidebar-item :menu="menu"
                    :screen="screen"
                    :props="website.menu.props"
                    :collapse="keyCollapse"
                    first
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { getValue } from '@/router/routerUtil'
import { mapGetters } from 'vuex'
import sidebarItem from './sidebarItem.vue'

export default {
  name: 'Sidebar',
  components: { sidebarItem },
  inject: ['index'],
  computed: {
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen', 'menuId']),
    nowTagValue: function() {
      return getValue(this.$route)
    }
  }
}
</script>
