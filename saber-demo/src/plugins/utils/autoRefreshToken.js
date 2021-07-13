import { throttle } from '@/util/util'
import website from '@/config/website'
import store from '@/store/index'
import { getStore, setStore } from '@/util/store'
import { resetRouter } from '@/router/router'
import { getPending } from './syncLoginState'

export const tokenNameKey = 'tokenTime'

/** 获取token的过期时间 */
export function getTokenExpired() {
  return (store.getters.userInfo.expires_in || 3600) * 1000 // 默认设置过期时间1小时
}

/**
 * 需求是 用户不做任何操作则不去更新token
 * 通过监听事件 去触发更新token
 */
export default class AutoRefreshToken {
  /** 监听的事件 */
  events = ['mousemove', 'keydown']

  /** 满足条件回调 */
  callback = null

  refreshing = false

  /** 遮罩层dom */
  maskEl = null

  /** 最后一次操作页面的时间 */
  useTime = 0

  constructor() {
    this.events.forEach(type => {
      window.addEventListener(type, this.listenHandler)
    })
  }

  /** 检测token是否过期 */
  check() {
    if (this.refreshing) return

    const tokenTime = getLocalTokenTime()
    const expired = getTokenExpired()
    // 服务端token有效时长为1小时，所以如果: 1h - 用户取得token时长 <= website.tokenRefreshRate 则刷新token
    const t = expired - (Date.now() - tokenTime)

    if (this.useTime === 0) {
      this.useTime = Date.now()
      if (t < 0) {
        // 已过期（此时不要去刷新token，后端可能会生成新的token）
        this.logout()
      }
    } else {
      // 距离上次操作超过过期时长
      if (Date.now() - this.useTime > expired) {
        if (t < 0) {
          // 且token过期，则直接退出登录
          this.logout()
        } else {
          // token未过期（可能其他页面更新了token，但当前页面长时间未操作）
          this.useTime = Date.now()
        }
      } else if (t < 0 && Date.now() - this.useTime < expired) {
        // token已过期，但距离上一次操作没有超过过期时长，则去刷新token
        this.useTime = Date.now()
        this.mask() // 显示遮罩层，避免用户操作发起请求导致被T下线
        this.refresh()
      } else if (t <= website.tokenRefreshRate * 1000) {
        // 临近过期
        this.refresh()
      }
    }
  }

  /** 刷新token */
  refresh() {
    this.refreshing = true
    const newTokenTime = Date.now() // 提前设置时间，避免请求占用时间(宁愿提前也不能延后)
    store.dispatch('refreshToken')
      .then(() => {
        // 更新获取token的时间
        setRefreshTokenTime(newTokenTime)
      })
      .finally(() => {
        this.refreshing = false
        if (this.maskEl) {
          document.body.removeChild(this.maskEl)
          this.maskEl = null
        }
      })
  }

  /** 退出登录 */
  logout() {
    // 如果页面已有提示登录状态，则不处理
    if (getPending()) return

    store.dispatch('LogOut', false).then(() => {
      resetRouter()
      location.replace('/login')
    })
  }

  /** 显示遮罩层，避免token未更新成功而去请求其他接口导致被下线 */
  mask() {
    if (this.maskEl) return
    const div = document.createElement('div')
    const i = document.createElement('i')
    div.className = 'position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center'
    div.style.zIndex = 99
    div.style.backgroundColor = '#ffffff30'
    i.className = 'el-icon-loading'
    div.appendChild(i)
    this.maskEl = div
    document.body.appendChild(div)
  }

  listenHandler = throttle(() => {
    this.check()
  }, 10000)

  destroy() {
    this.events.forEach(type => {
      window.removeEventListener(type, this.listenHandler)
    })
  }
}

/**
 * 获取 token 最后一次更新的时间
 * @returns 毫秒数
 */
export function getLocalTokenTime() {
  const tokenTime = parseInt(getStore({ name: tokenNameKey, type: 'local' }) || '', 36)
  if (isNaN(tokenTime)) return 0
  return tokenTime
}

/**
 * 检测缓存中的 token 是否过期。true为过期
 */
export function isExpired() {
  return Date.now() - getLocalTokenTime() > getTokenExpired()
}

/**
 * 设置刷新token的时间
 * @param {number} [newTokenTime] 毫秒数。默认值为`Date.now()`
 */
export function setRefreshTokenTime(newTokenTime = Date.now()) {
  if (!(typeof newTokenTime === 'number' && !isNaN(newTokenTime))) throw new Error('参数必须为数值')
  setStore({ type: 'local', name: tokenNameKey, content: newTokenTime.toString(36) })
}
