import Vue from 'vue'
import md5 from 'js-md5'

export const keyPrefix = 'new_page:'

export default function() {
  // 存储window和callback
  const winMap = new Map()

  // 通过监听storage来实现多页面间数据通信
  window.addEventListener('storage', ev => {
    const key = ev.key
    const w = winMap.get(key)

    if (new RegExp(`${keyPrefix}[a-f\\d]{32}`).test(key) && w) {
      const s = localStorage.getItem(key)
      if (s === null) return

      const [,, status, json] = s.match(/^(\d+)-(\d)-(.*)$/)

      const data = JSON.parse(json)
      w.callback && w.callback.apply(null, data)

      localStorage.removeItem(key)

      if (status === '1') {
        w.win.close()
        winMap.delete(key)
      }
    }
  })

  /**
   * 创建新页面
   * @param {object} options
   * @param {string} options.path 组件路径（相对于src/views目录）
   * @param {object} [options.data] 传递给组件的props的值
   * @param {Function} [options.callback] 回调函数（在组件中通过`$emit`触发`close | update`事件）
   */
  Vue.prototype.$newPage = (options) => {
    const path = options.path.replace(/^\//, '')
    const query = options.data
      ? '?' + Object.entries(options.data).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
      : ''
    const url = `/p/${path}${query}`
    const hash = md5(url)
    const key = keyPrefix + hash
    let winName = `${hash}-${Date.now()}`

    if (winMap.has(key)) {
      const w = winMap.get(key).win
      try {
        if (w.location.href !== location.origin + url) {
          winMap.delete(key)
        } else {
          winName = w.name
        }
      } catch (err) {
        // 跨域时 w.location.href 会报错
        winMap.delete(key)
      }
    }
    winMap.set(key, {
      win: window.open(url, winName),
      callback: options.callback
    })
  }
}
