<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                    :key="item[labelKey]"
                    :index="item[pathKey]"
                    :class="{'is-active':vaildAvtive(item)}"
                    @click="open(item)"
      >
        <i v-if="item.parentId === '0'&&!collapse" :class="item[iconKey]" />
        <span class="abbr">{{ generateTitle(item).slice(0,2) }}</span>
        <span slot="title" :alt="item[pathKey]">{{ generateTitle(item) }}</span>
      </el-menu-item>
      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                  :key="item[labelKey]"
                  :index="item[pathKey]"
                  :popper-class="keyCollapse?'popup-menu bg-white':''"
                  :class="{'is-collapse-active':isCollapseActive(item)}"
      >
        <template slot="title">
          <i v-if="item.parentId === '0'&&!collapse" :class="item[iconKey]" />
          <span v-if="!keyCollapse||first" class="abbr">{{ generateTitle(item).slice(0,2) }}</span>
          <span slot="title" :class="{'el-menu--display':collapse && first}" @click.once="todo(item)">{{ generateTitle(item) }}</span>
        </template>

        <MenuPanel v-if="keyCollapse" :menus="item[childrenKey]" :parent-name="item[labelKey]" />
        <template v-else>
          <template v-for="child in item[childrenKey]">
            <el-menu-item v-if="validatenull(child[childrenKey])"
                          :key="child.id"
                          :index="child[pathKey]"
                          :class="{'is-active':vaildAvtive(child)}"
                          @click="open(child)"
            >
              <span v-if="!keyCollapse" class="abbr">{{ generateTitle(child).slice(0,2) }}</span>
              <span slot="title">{{ generateTitle(child) }}</span>
            </el-menu-item>
            <sidebar-item v-else
                          :key="child.id"
                          :menu="[child]"
                          :props="props"
                          :screen="screen"
                          :collapse="collapse"
            />
          </template>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { validatenull } from '@/util/validate'
import MenuPanel from './panel/index.vue'
import config from './config.js'
import { generateTitle, getRouteNameOrPath, getValue, setRouterCache } from '@/router/routerUtil'

export default {
  name: 'SidebarItem',
  components: { MenuPanel },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    collapse: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['roles', 'keyCollapse']),
    labelKey() {
      return this.props.label || config.propsDefault.label
    },
    pathKey() {
      return this.props.path || config.propsDefault.path
    },
    iconKey() {
      return this.props.icon || config.propsDefault.icon
    },
    childrenKey() {
      return this.props.children || config.propsDefault.children
    },
    nowTagValue() {
      return getValue(this.$route)
    }
  },
  methods: {
    todo(item) {
      if (item.code === 'supplier') {
        this.$router.push({ path: '/supplier/index' })
      }
    },
    generateTitle(item) {
      // 为了在deliveryManagement.vue中的name使用英文名，这里的发货方式限制和运费试算简单处理一下
      // const alias = ['/optimize/freightTrial', '/optimize/deliveryRestriction'].some(path => item.path.indexOf(path) > -1)
      const title = this.labelKey
      // if (alias) title = 'alias'
      return generateTitle(
        item[title],
        (item.meta || {}).i18n
      )
    },
    vaildAvtive(item) {
      const groupFlag = (item.group || []).some(ele =>
        this.$route.path.includes(ele)
      )
      return this.nowTagValue === item[this.pathKey] || groupFlag
    },
    vaildRoles(item) {
      item.meta = item.meta || {}
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true
    },
    validatenull(val) {
      return validatenull(val)
    },
    open(item) {
      if (this.screen <= 1) this.$store.commit('SET_COLLAPSE')
      setRouterCache({
        group: item.group,
        meta: item.meta
      })

      const routeOption = getRouteNameOrPath({
        name: item[this.labelKey],
        src: item[this.pathKey]
      })

      this.$store.commit('UPDATE_REFERER', {
        type: 1,
        from: 'sideMenu'
      })
      this.$router.push({
        ...routeOption,
        query: item.query
      })
    },
    isCollapseActive(data) {
      return this.keyCollapse && this.$route.path.indexOf(data.path) === 0
    }
  }
}
</script>
