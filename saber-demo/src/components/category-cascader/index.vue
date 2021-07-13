// 类目 多级联动
<template>
  <el-cascader
    ref="cascader"
    v-model="checked"
    :options="options"
    :style="style"
    :size="size"
    :props="cascaderProps"
    :filterable="filterable"
    v-bind="attrs"
    :placeholder="placeholder"
    :popper-class="popperClasses"
    class="custom-cascader-input"
    @blur="blur"
    @change="change"
  >
    <template slot-scope="{ node, data }">
      <slot :cascaderData="{ node, data}">
        <el-checkbox v-if="lazyMultipleMode" v-model="data.customChecked" :indeterminate="indeterminateStatus(node)" @click.native="checkboxClickHandler(node,$event)" />
        <span>{{ data[cascaderProps.label] }}</span>
        <span v-if="!node.isLeaf&&Array.isArray(data.children)&&data.children.length>0"> ({{ data.children.length }}) </span>
      </slot>
    </template>
  </el-cascader>
</template>

<script>
import { getChildren } from 'zh-pms/src/api/categoryManagement'

export default {
  props: {
    value: [Array, String, Number],
    width: String,
    size: {
      type: String,
      default: 'mini'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否可以选择节点（默认单选只能选叶子节点）
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 懒加载的多选（不支持回显）
    lazyMultiple: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default() {
        return {
          value: 'id',
          label: 'name'
        }
      }
    },
    // 外部传入获取数据的方法，必须调用resolve回调返回数据
    fetch: Function,
    placeholder: {
      type: String,
      default: '请选择类目'
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  data() {
    const lazyMultipleMode = typeof this.fetch === 'function' ? false : this.lazyMultiple
    return {
      lazyMultipleMode,
      inputValue: '', // 记录文本框显示的文本（lazyMultiple模式用到）
      cascaderProps: this.getProps(lazyMultipleMode),
      checked: [],
      options: [],
      attrs: Object.assign({
        'show-all-levels': false,
        'collapse-tags': true,
        clearable: true
      }, this.$attrs)
    }
  },
  computed: {
    style() {
      if (this.width) return { width: this.width }
      return {}
    },
    popperClasses() {
      const klass = ['custom-cascader', this.popperClass]
      if (this.lazyMultipleMode) {
        klass.push('custom-lazy-multiple-cascader')
      }
      return klass.join(' ')
    }
  },
  watch: {
    checked(a, b) {
      // 如果是懒加载多选，则通过 checkboxClickHandler 方法控制已勾选的值
      if (this.lazyMultipleMode) return
      if (!Array.isArray(a)) return
      if (a.length === 0 && b.length === 0) return
      // checked值发生变化，但界面并没用及时更新（导致获取的值异常）
      this.$nextTick(() => {
        this.handleChange(this.multiple ? this.getMultipleCheckedIds() : this.checked[this.checked.length - 1], a.length > 0)
      })
    },
    value(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        if ((newVal === '') || (Array.isArray(newVal) && newVal.length === 0)) {
          if (this.lazyMultipleMode) {
            this.uncheckedAll()
            this.$emit('input', [])
          } else {
            this.checked = []
          }
          this.$refs.cascader.handleClear()
        }
      }
    }
  },
  created() {
    if (!this.lazyMultipleMode) this.getData()
  },
  mounted() {
    if (this.lazyMultipleMode) {
      // 处理清空输入框时，清空全部勾选
      const ref = this.$refs.cascader.$children.find(el => el.$options.name === 'ElInput')
      const unwatch = this.$watch(() => ref.value, (newVal, oldVal) => {
        if (newVal === '') {
          this.uncheckedAll()
          this.handleChange([])
          this.inputValue = ''
        }
      })
      this.$once('hook:beforeDestroy', unwatch)
    }
  },
  methods: {
    getProps(lazyMultipleMode) {
      // 使用lazyMultiple模式强制将multiple设置为false
      const multiple = lazyMultipleMode ? false : this.multiple

      // 类目专用的属性配置
      const categoryProps = {
        lazy: true,
        lazyLoad: this.lazyLoad,
        leaf: 'isLeaf',
        checkStrictly: this.checkStrictly
      }
      const props = { children: 'children', ...this.props, multiple, checkStrictly: this.checkStrictly }
      return typeof this.fetch !== 'function' ? Object.assign(props, categoryProps) : props
    },
    blur() {
      this.$parent.$emit('el.form.blur')
    },
    // 根据最后一个选中的id查找所有直系父级的id（单选）
    getIdPathById(arr, id) {
      const fieldValue = this.cascaderProps.value
      let indexPath = []
      const ids = []

      function walk(data = [], value, indexes = []) {
        for (let i = 0; i < data.length; i++) {
          const idx = [...indexes, i]
          if (data[i][fieldValue] === value) {
            indexPath = idx
            return
          }
          walk(data[i].children, value, idx)
        }
      }
      walk(arr, id)
      indexPath.reduce((prevVal, item, index) => {
        const d = index === 0 ? prevVal[item] : prevVal.children[item]
        ids.push(d[fieldValue])
        return d
      }, arr)
      return ids
    },
    // 根据id找对应的所有父级id 及 所有的子孙节点 (多选)
    getFullPathIdsById(ids = []) {
      const { value: fieldValue, children: fieldChildren } = this.cascaderProps
      const fullIdPath = []

      // 递归查找所有上级的节点
      function walkParent(arr = [], id, idPath = []) {
        return arr.some(item => {
          const itemId = item[fieldValue]
          if (itemId === id) {
            walkChilren(item[fieldChildren], idPath.concat(itemId))
            return true
          } else if (Array.isArray(item[fieldChildren])) {
            return walkParent(item[fieldChildren], id, idPath.concat(itemId))
          }
        })
      }
      // 递归查找所有的子孙节点
      function walkChilren(arr = [], idPath = []) {
        if (!arr || (Array.isArray(arr) && arr.length === 0)) {
          fullIdPath.push(idPath)
        } else {
          arr.forEach(item => {
            const tempIdPath = idPath.concat(item[fieldValue])
            if (Array.isArray(item[fieldChildren])) {
              walkChilren(item[fieldChildren], tempIdPath)
            } else {
              fullIdPath.push(tempIdPath)
            }
          })
        }
      }

      ids.forEach(id => {
        walkParent(this.options, id, [])
      })

      return fullIdPath
    },
    lazyLoad(node, resolve) {
      const id = node.root ? undefined : node.data[this.cascaderProps.value]
      getChildren(id).then(({ data }) => {
        this.refactorData(data, { customChecked: node.root ? false : node.data.customChecked })
        resolve(data)
      })
    },
    getData() {
      if (typeof this.fetch === 'function') {
        this.fetch(data => {
          this.refactorData(data)
          this.options = data
          this.checked = this.multiple ? this.getFullPathIdsById(this.value) : this.getIdPathById(this.options, this.value)
        })
      } else {
        this.checked = this.value
      }
    },
    // children字段长度为0则删除。合并新的属性到item中
    refactorData(data = [], appendProps = {}) {
      data.forEach(item => {
        Object.assign(item, appendProps)
        if (Array.isArray(item.children)) {
          if (item.children.length === 0) {
            item.children = undefined
          } else {
            this.refactorData(item.children)
          }
        } else {
          item.children = undefined
        }
      })
    },
    // 再ElCascaderPanel组件中拿到menu数据，再通过递归根据checked属性来确定勾选状态
    // 如果节点的checked为true，则取该节点的id，并忽略其子节点
    getMultipleCheckedIds(callback) {
      const ref = this.$refs.cascader.$children.find(el => el.$options.name === 'ElCascaderPanel')
      const ids = []

      function walk(items) {
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (callback) {
              if (!callback(item)) {
                walk(item.children)
              }
            } else {
              if (item.checked) {
                ids.push(item.value)
              } else {
                walk(item.children)
              }
            }
          })
        }
      }
      walk(ref.menus[0])
      return ids
    },
    handleChange(ids, emit = true) {
      this.$emit('input', ids)
      emit && this.$parent.$emit('el.form.blur')
    },
    indeterminateStatus(node) {
      if (node.hasChildren) {
        let count = 0
        node.children.forEach(item => {
          if (item.data.customChecked) count++
        })
        return count > 0 && count < node.children.length
      }
      return false
    },
    // lazyMultiple模式 勾选CheckBox处理上下级的勾选状态，
    // 并返回勾选结果
    checkboxClickHandler(node, event) {
      event.stopPropagation()
      if (event.target.nodeName === 'INPUT') {
        const status = !node.data.customChecked
        node.data.customChecked = status

        // 处理父级勾选状态
        if (node.parent) {
          if (!status) {
            node.parent.data.customChecked = false
          } else if (status && !node.parent.data.customChecked) {
            const isAllChildrenChecked = node.parent.children.every(item => item.data.customChecked)
            if (isAllChildrenChecked) {
              node.parent.data.customChecked = true
            }
          }
        }
        // 处理子级的勾选状态
        if (node.hasChildren) {
          node.children.forEach(item => {
            item.data.customChecked = status
          })
        }

        // 获取勾选的id
        const ids = []
        let latestName = ''
        this.getMultipleCheckedIds(item => {
          if (item.data.customChecked) {
            ids.push(item.value)
            latestName = item.label
          }
          return item.data.customChecked
        })

        this.handleChange(ids)

        let inputValue = ''
        if (ids.length === 1) {
          inputValue = latestName
        } else if (ids.length > 1) {
          inputValue = `${latestName} +${ids.length - 1}`
        }
        this.inputValue = inputValue
        this.$refs.cascader.presentText = inputValue
      }
    },
    change() {
      // 选中时还原输入框的文本
      if (this.lazyMultipleMode) {
        this.$refs.cascader.$children.find(el => el.$options.name === 'ElInput').$nextTick(() => {
          this.$refs.cascader.presentText = this.inputValue
        })
      }
    },
    // lazyMultipleMode 清除全部勾选
    uncheckedAll() {
      const ref = this.$refs.cascader.$children.find(el => el.$options.name === 'ElCascaderPanel')

      ;(function walk(arr) {
        if (Array.isArray(arr)) {
          arr.forEach(item => {
            item.data.customChecked = false
            if (item.hasChildren) {
              walk(item.children)
            }
          })
        }
      })(ref.menus[0])
    }
  }
}
</script>

<style lang="scss">
.custom-cascader {
  .el-cascader-node {
    max-width: 20em;
  }
  &.hidden-disabled {
    .is-disabled {
      display: none;
    }
  }
}

.custom-lazy-multiple-cascader {
  .el-cascader-node__label {
    padding: 0;
  }
  .el-cascader-node__prefix {
    display: none;
  }
  .el-cascader-node__label {
    font-weight: normal;
    color: #606266;
  }
}

.custom-cascader-input {
  .el-input--mini .el-input__inner {
    height: 28px!important;
  }
}
</style>
