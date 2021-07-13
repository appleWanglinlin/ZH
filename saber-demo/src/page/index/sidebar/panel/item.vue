<template>
  <div class="px-3" :class="{'m-item':level===1&&hasChildren}">
    <div v-if="hasChildren"
         :class="{'border-bottom':hasChildren}"
         class="fw-bold p-1 my-2"
    >{{ itemMenu.name }}</div>
    <div v-else class="p-1">
      <span v-if="isRouteActive" class="text-disabled">{{ itemMenu.name }}</span>
      <router-link v-else
                   :to="itemMenu[config.path]"
                   :class="{'fw-bold py-2 d-block':level===0}"
                   class="text-primary"
      >{{ itemMenu.name }}</router-link>
    </div>
    <div v-if="hasChildren" :class="{'d-flex':level===0}" class="flex-wrap w-100">
      <ItemMenu v-for="item in itemMenu[config.children]"
                :key="item.id"
                :item-menu="item"
                :level="level+1"
      />
    </div>
  </div>
</template>

<script>
import config from '../config'

export default {
  name: 'ItemMenu',
  props: {
    itemMenu: Object,
    level: Number
  },
  computed: {
    config() {
      return config.propsDefault
    },
    hasChildren() {
      return (this.itemMenu?.[this.config.children] || []).length > 0
    },
    isRouteActive() {
      return this.$route.path === this.itemMenu[this.config.path]
    }
  }
}
</script>
