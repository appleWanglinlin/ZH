import Vue from 'vue'
import './index.scss'

export default Vue.extend({
  name: 'Modal',
  data() {
    return {
      list: []
    }
  },
  watch: {
    // 路由变化时清空窗口
    '$route'() {
      if (this.list.length > 0) this.list = []
    }
  },
  created() {
    Vue.prototype.$modal = (options = {}) => {
      if (!options.component) throw new Error('必须传入组件')
      this.list.push(Object.assign({
        closeOnClickModal: false,
        customClass: 'custom-modal'
      }, options, {
        visible: true
      }))
    }
  },
  render(h) {
    const that = this
    const list = this.list.map(item => {
      const { component, data: myData, padding = '10px', minHeight = 'auto', height, callback, title, ...props } = item

      let overflow
      if (height) overflow = 'auto'

      let loadingInstance
      const dialog = h('ElDialog', {
        props,
        on: {
          close(...args) {
            item.visible = false
            that.$nextTick(() => {
              that.list = that.list.filter(el => {
                if (el === item) {
                  if (typeof callback === 'function') callback.apply(this, args)
                  return false
                }
                return true
              })
            })
          },
          loading(status) {
            if (status === false) {
              loadingInstance && loadingInstance.close()
            } else {
              loadingInstance = that.$loading({
                target: dialog.elm.querySelector('.el-dialog__body')
              })
            }
          }
        }
      }, [
        h('g-text-ellipsis', {
          staticClass: 'fw-bold fs-5',
          slot: 'title',
          domProps: {
            innerHTML: title
          }
        }),
        h('div', {
          style: {
            padding,
            minHeight,
            height,
            overflow
          }
        }, [
          typeof component === 'string'
            ? h('div', {
              props: myData,
              domProps: {
                innerHTML: component
              }
            })
            : h(component, {
              props: myData
            })
        ])
      ])
      return dialog
    })

    return h('div', [
      ...list
    ])
  }
})
