<template>
  <el-card v-loading="loading" class="box-card border home-module">
    <div slot="header" class="d-flex align-items-center justify-content-between">
      <el-button v-if="link" size="mini" type="text" class="fw-bold" @click="$router.push(link)">{{ title }}</el-button>
      <b v-else>{{ title }}</b>
      <el-button-group class="custom">
        <el-button v-for="btn in buttons"
                   :key="btn.label"
                   size="mini"
                   :type="btn.value===defaultBtn?'primary':''"
                   @click="onTabClick(btn)"
        >{{ btn.label }}</el-button>
      </el-button-group>
    </div>
    <component :is="component" ref="cmp" @hook:mounted="childMounted" />
  </el-card>
</template>

<script>
export default {
  name: 'HomeMoudle',
  props: {
    title: String,
    // 点击标题跳转的地址
    link: String,
    /** @type {ZHKJ.VueProps<{label:string;value:any;default:boolean}[]>} */
    buttons: Array,
    // 显示的组件
    component: [Object, Function],
    /**
     * `componentRef` 传入组件 `component` 的 `ref`
     * `buttonValue` 被点击按钮的 `value`
     * @type {ZHKJ.VueProps<(componentRef, buttonValue) => Promise>}
    */
    handler: Function,
    // 是否立即执行`handler`
    immediate: {
      type: Boolean,
      default: true
    },
    // 是否允许当前选中的按钮可以再次点击执行`handler`
    duplicateClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let defaultBtn = null
    if (Array.isArray(this.buttons)) {
      const d = this.buttons.find(item => item.default)
      defaultBtn = d ? d.value : this.buttons[0].value
    }
    return {
      loading: true,
      defaultBtn
    }
  },
  mounted() {
    if (!this.immediate) {
      this.loading = false
    }
  },
  methods: {
    onTabClick(data) {
      if (!this.duplicateClick && this.defaultBtn === data.value) return
      this.defaultBtn = data.value
      this.emitHandler()
    },
    emitHandler() {
      this.loading = true
      this.handler(this.$refs.cmp, this.defaultBtn).finally(() => {
        this.loading = false
      })
    },
    childMounted() {
      if (this.immediate) {
        this.emitHandler()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-module ::v-deep {
  .el-card__header {
    padding: 3px 1rem !important;
    b {line-height: 28px;}
  }
}
</style>
