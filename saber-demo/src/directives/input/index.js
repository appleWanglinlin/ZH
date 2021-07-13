// 输入控制
import Vue from 'vue'

function isInputOrTextarea(obj) {
  const t = Object.prototype.toString.call(obj).match(/\s(\w+)/)[1]
  return ['HTMLInputElement', 'HTMLTextAreaElement'].indexOf(t) > -1
}

Vue.directive('input', {
  trigger(el, eventName) {
    if (window.CustomEvent) {
      const event = new CustomEvent(eventName)
      event.myCustomInput = true
      el.dispatchEvent(event)
    } else if (document.createEvent) {
      const event = document.createEvent('HTMLEvents')
      event.initEvent(eventName, true, true)
      event.eventName = eventName
      event.myCustomInput = true
      el.dispatchEvent(event)
    } else {
      const event = document.createEventObject()
      event.eventName = eventName
      event.eventType = eventName
      event.myCustomInput = true
      el.fireEvent('on' + eventName, event)
    }
  },
  bind(el, binding, vnode) {
    /**
     * number 任意数值
     * positive 任意正数
     * negative 任意负数
     * numeric 任意整数
     */
    const { number, positive, negative, numeric } = binding.modifiers
    const bindingValue = binding.value

    const isModifier = (number || positive || negative || numeric)

    const isFucntion = typeof binding.value === 'function'
    const isArray = Array.isArray(bindingValue)

    if (isArray) {
      const [min, max] = bindingValue
      if (bindingValue.length !== 2) {
        throw Error('数组长度必须为2')
      }
      if (typeof min !== 'number' || typeof max !== 'number') {
        throw Error('取值范围的最小值和最大值必须是数值')
      }
      if (min > max) {
        throw Error('取值范围的最小值不能大于最大值')
      }
    } else if (bindingValue !== undefined && !isFucntion) {
      throw Error('绑定值必须是函数')
    }

    let $el = null
    if (!isInputOrTextarea(el)) {
      $el = el.querySelector('input,textarea')
    } else {
      $el = el
    }

    if (!$el) throw Error('v-input 必须使用在 input 或 textarea DOM元素上')

    el.$el = $el

    if (isModifier) {
      el.handler = event => {
        if (event.myCustomInput) return
        let val = event.target.value

        if (number && !/^[-.\d]+$/.test(val)) {
          val = val.replace(/[^-.\d]+/g, '')
        }

        // 整数判断
        if (numeric && !/^[-\d]+$/.test(val)) {
          val = val.replace(/[^-\d]+/g, '')
        }

        // 正数判断
        if (positive && !negative) {
          val = val.replace(/[^.\d]+/g, '')
        }

        if (val !== '' && val !== '-') {
          if (!isFinite(+val)) {
            const matched = val.match(/-?\d+\.?\d+/)
            if (matched) {
              val = matched[0]
            } else {
              val = ''
            }
          }
        }

        if (isFucntion) {
          val = binding.value(val)
        }

        // 针对elementUI的组件进行处理
        if (vnode.componentInstance && vnode.componentInstance.isComposing === true) {
          vnode.componentInstance.isComposing = false
        }

        event.target.value = val
        binding.def.trigger(event.target, 'input')
      }
    } else if (isFucntion) {
      let cacheVal
      el.handler = event => {
        if (cacheVal === event.target.value) return
        const val = binding.value(event.target.value)
        cacheVal = val
        event.target.value = val
        binding.def.trigger(event.target, 'input')
      }
    }

    // 失去焦点强制更新组件。避免输入的内容未及时更新到vue实例
    el.blurHandler = event => {
      const noZero = binding.modifiers['!0']
      const val = event.target.value

      function update(val) {
        event.target.value = val
        binding.def.trigger(event.target, 'input')
        vnode.context.$nextTick(() => {
          vnode.context.$forceUpdate()
        })
      }

      // 失去焦点时，如果值为 " - " 或 " 0 " 则置空
      if (val === '-' || (noZero && val === '0')) {
        update('')
      } else if (/(^0[^.])|(\.\d*0$)/.test(val)) { // 处理前后多余的0
        let v = String(Number(val))
        if (noZero && v === '0') v = ''
        update(v)
      } else if (isArray) {
        const [min, max] = bindingValue
        const v = Number(val)
        update(v < min || v > max ? '' : val)
      } else {
        vnode.context.$forceUpdate()
      }
    }

    el.$el.addEventListener('input', el.handler)
    el.$el.addEventListener('blur', el.blurHandler)
  },
  unbind(el) {
    el.$el.removeEventListener('input', el.handler)
    el.$el.removeEventListener('blur', el.blurHandler)
  }
})
