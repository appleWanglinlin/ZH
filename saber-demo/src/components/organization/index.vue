<template>
  <el-dropdown ref="dropdown" size="mini" :trigger="trigger" :placement="placement">
    <slot>
      <el-input ref="input" v-model="inputText" readonly clearable :size="inputSize" :style="{width: inputWidth}" :placeholder="inputPlaceholder" />
    </slot>
    <el-dropdown-menu slot="dropdown">
      <organization-panel v-bind="$attrs" :selected="value" :own="own" :multiple="multiple" @checked="checked" />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import OrganizationPanel from './panel.vue'

export default {
  components: { OrganizationPanel },
  props: {
    value: [String, Array, Object],
    // 是否选中用户后自动隐藏
    hideOnSelected: {
      type: Boolean,
      default: true
    },
    // 触发下拉的行为，只支持 click、hover
    trigger: {
      type: String,
      default: 'click'
    },
    // 弹出位置
    placement: {
      type: String,
      default: 'bottom'
    },
    // 输入框的尺寸
    inputSize: {
      type: String,
      default: 'mini'
    },
    // 输入框的宽度
    inputWidth: {
      type: String
    },
    // 输入框的placeholder
    inputPlaceholder: {
      type: String,
      default: '请选择开发人'
    },
    // 是否是多选，多选则选中用户不会自动关闭弹层
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否根据当前用户的权限过滤数据（根据该字段判断使用的接口）
    own: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputText: ''
    }
  },
  mounted() {
    this.overrideInput()
    this.multiple && this.stopPropagation()
  },
  methods: {
    checked(data) {
      this.inputText = this.multiple ? data.map(item => item.name).join(', ') : data.name
      this.$emit('input', data)
      if (!this.multiple && this.hideOnSelected) {
        this.$refs.dropdown.visible = false
      }
    },
    stopPropagation() {
      const handler = e => e.stopPropagation()
      const $dropdown = this.$refs.dropdown.$el
      $dropdown.addEventListener('click', handler)
      this.$once('hook:beforeDestroy', () => {
        $dropdown.removeEventListener('click', handler)
      })
    },
    // 重新 el-input 中的方法或属性
    overrideInput() {
      const that = this
      const inputRef = this.$refs.input
      if (inputRef) {
        const clearHandler = inputRef.clear

        // 重新包装el-input组件中的clear方法
        // 点击清除按钮阻止冒泡。避免点击清除按钮又弹出组织架构
        inputRef.clear = function(e) {
          e.stopPropagation()
          that.inputText = ''
          that.$emit('input', {})
          clearHandler()
        }

        // 重写el-input组件中 showClear 计算属性
        Object.defineProperty(inputRef, 'showClear', {
          get() {
            return inputRef.clearable &&
                !inputRef.inputDisabled &&
                inputRef.nativeInputValue &&
                (inputRef.focused || inputRef.hovering)
          }
        })
      }
    }
  }
}
</script>
