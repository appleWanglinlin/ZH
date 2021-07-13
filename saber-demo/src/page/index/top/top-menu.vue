<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex" mode="horizontal" text-color="#333">
      <el-menu-item index="0" @click.native="openHome(itemHome)">
        <template slot="title">
          <i :class="itemHome.source" />
          <span id="idd">{{ generateTitle(itemHome) }}</span>
        </template>
      </el-menu-item>
      <template v-for="(item,index) in items">
        <el-menu-item :key="index" :index="item.id+''" @click.native="openMenu(item)">
          <template slot="title">
            <i :class="item.source" style="padding-right: 5px;" />
            <span>{{ generateTitle(item) }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { generateTitle, getPath } from '@/router/routerUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'TopMenu',
  data() {
    return {
      itemHome: {
        name: '首页',
        source: 'el-icon-home-fill'
      },
      activeIndex: '0',
      items: []
    }
  },
  inject: ['index'],
  computed: {
    ...mapGetters(['tagCurrent', 'menu'])
  },
  methods: {
    openHome(itemHome) {
      this.index.openMenu(itemHome)
      this.$router.push({
        path: getPath({ name: itemHome.name, src: '' }, {})
      })
    },
    openMenu(item) {
      this.index.openMenu(item)
    },
    getMenu() {
      this.$store.dispatch('GetTopMenu').then(res => {
        this.items = res
      })
    },
    generateTitle(item) {
      return generateTitle(
        item.name,
        (item.meta || {}).i18n
      )
    }
  }
}
</script>
