// 表单验证规则集合
const messageTip = '必填项'

/**
 * 表单字段 必填 规则
 * @param {String} trigger 触发验证规则事件，默认 blur
 * @param {Boolean} isTrim 是否清除字符串首尾空白再判断是否为空，默认 true
 */
export function required(trigger = 'blur', isTrim = true) {
  const list = [{ required: true, message: messageTip, trigger }]
  if (isTrim) {
    list.push({
      validator(rule, value, callback) {
        if (typeof value === 'string') {
          if (value.trim() === '') {
            callback(new Error(messageTip))
          }
        }
        callback()
      },
      message: messageTip,
      trigger
    })
  }
  return list
}

/**
 * 自定义规则
 * @param {any} condition 任意类型：
 *
 * 为函数时，函数返回true，则表示验证不通过
 *
 * 为正则时，正则test方法返回true，则表示不通过
 *
 * 为数组时，不包含在数组中，则表示不通过
 *
 * 否则，则匹配是否与condition相等
 * @param {string} message 错误提示
 * @param {string} trigger 触发事件。默认: `blur`
 */
export function customRule(condition, message = messageTip, trigger = 'blur') {
  return {
    validator(rule, value, callback) {
      const type = Object.prototype.toString.call(condition).match(/^\[object (\w+)\]$/)[1].toLowerCase()
      let invalid = false // 为true就是验证不通过
      switch (type) {
        // 函数返回true，则表示验证不通过
        case 'function':
          invalid = condition(value); break
        // 正则test方法返回true，则表示不通过
        case 'regexp':
          invalid = condition.test(value); break
        // 不包含在数组中，则表示不通过
        case 'array':
          invalid = condition.indexOf(value) === -1; break
        // 与condition不相等，则表示不通过
        default:
          invalid = value !== condition
      }
      callback(invalid ? new Error(message) : undefined)
    },
    trigger
  }
}
