<template>
  <li class="bg-white w-100 menu-wrap">
    <div class="p-2 fw-bold border-bottom position-sticky top-0 bg-light text-center">{{ parentName }}</div>
    <div class="p-2">
      <ItemMenu v-for="item in menus" :key="item.id" :item-menu="item" :level="0" />
    </div>
  </li>
</template>

<script>
import ItemMenu from './item.vue'

export default {
  components: { ItemMenu },
  props: {
    menus: Array,
    parentName: String
  }
}
</script>

<style lang="scss" scoped>
.menu-wrap {
  max-height: calc(100vh - 20px);
  overflow: auto;

  ::v-deep {
    a:hover {
      text-decoration: underline;
    }

    .m-item {
      transition: all 0.01s;
      &:hover {
        box-shadow: 0 0 10px rgba(0,0,0,0.15);
      }
    }
    .text-disabled {
      color: #999 !important;
    }
  }
}
</style>
