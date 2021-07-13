<template>
  <el-autocomplete v-model="value"
                   :fetch-suggestions="querySearch"
                   :placeholder="$t('search')"
                   popper-class="my-autocomplete"
                   size="mini"
                   style="max-width:240px"
                   prefix-icon="el-icon-search"
                   @select="handleSelect"
  >
    <template slot-scope="{ item }">
      <i class="mx-2" :class="[item[iconKey],'icon']" />
      <div>{{ item[labelKey] }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import config from '../sidebar/config.js'
import { mapGetters } from 'vuex'
import { getRouteNameOrPath } from '@/router/routerUtil.js'

export default {
  data() {
    return {
      config: config,
      value: '',
      menuList: []
    }
  },
  computed: {
    labelKey() {
      return this.website.menu.props.label || this.config.propsDefault.label
    },
    pathKey() {
      return this.website.menu.props.path || this.config.propsDefault.path
    },
    iconKey() {
      return this.website.menu.props.icon || this.config.propsDefault.icon
    },
    childrenKey() {
      return this.website.menu.props.children || this.config.propsDefault.children
    },
    ...mapGetters(['menu', 'website'])
  },
  watch: {
    menu() {
      this.getMenuList()
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      const flatMenus = []
      const recursion = (d = [], p = []) => {
        if (Array.isArray(d)) {
          d.forEach(item => {
            recursion(item, p)
          })
        } else if (Array.isArray(d[this.childrenKey]) && d[this.childrenKey].length > 0) {
          recursion(d[this.childrenKey], p.concat(d[this.labelKey]))
        } else {
          flatMenus.push({
            [this.labelKey]: p.concat(d[this.labelKey]).join(' / '),
            [this.pathKey]: d[this.pathKey],
            [this.iconKey]: d[this.iconKey]
          })
        }
      }
      recursion(this.menu)
      this.menuList = flatMenus
    },
    querySearch(queryString, cb) {
      queryString = queryString.trim()
      const restaurants = this.menuList
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        const qs = queryString.toLowerCase()
        return restaurant[this.labelKey].toLowerCase().indexOf(qs) > -1 ||
        (qs.length > 2 && restaurant[this.pathKey].toLowerCase().indexOf(qs) > -1)
      }
    },
    handleSelect(item) {
      this.value = ''
      this.$store.commit('UPDATE_REFERER', {
        type: 0,
        from: 'search'
      })
      this.$router.push({
        ...getRouteNameOrPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }),
        query: item.query
      })
    }
  }
}
</script>

<style lang="scss">
.my-autocomplete {
  width: auto !important;
  li {
    line-height: 1 !important;
    padding: 7px !important;
    display: flex;
    align-items: center;
  }
}
</style>
