/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import md5 from 'js-md5'
import store from '@/store/index'
import router from '@/router/router'
import { serialize, throttle } from '@/util/util'
import { dateFormat } from '@/util/date'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
import website from '@/config/website'
import { Base64 } from 'js-base64'
import NProgress from 'nprogress'

// 生成唯一ID
function generateUid() {
  const s = dateFormat(new Date(), 'yyyyMMddhhmmssS')
  const r = Number(String(Math.random()).slice(-6)).toString(32)
  return [s, r].join('_')
}
const logIdKey = 'zhkj-req-id'

/**
 * 节流处理错误提示，避免一次显示多个错误提示
 */
const errorMessage = throttle((message, uid) => {
  const errcode = uid ? `<div class="fs-6 mt-2 text-muted">错误代码 ${uid}</div>` : ''
  Message({
    dangerouslyUseHTMLString: true,
    customClass: 'p-3',
    message: `<div>${message}</div>${errcode}`,
    type: 'error'
  })
}, 500)

/** 缓存所有请求的cancelHandler */
const cancelHandler = []

function removeCancelHandlerItem(config) {
  const index = cancelHandler.findIndex(el => el.uid === config.headers[logIdKey])
  const item = cancelHandler.splice(index, 1)
  if (config.componentInstance && config.componentInstance.$off) {
    config.componentInstance.$off('hook:beforeDestroy', item.handler)
  }
}

const instance = axios.create({
  baseURL: '/api',
  // 默认超时时间
  timeout: 30000,
  // 返回其他状态码
  validateStatus(status) {
    return status >= 200 && status <= 500
  },
  // 跨域请求，允许保存cookie
  withCredentials: true
})

NProgress.configure({
  showSpinner: false
})

// http request拦截
instance.interceptors.request.use(config => {
  if (config.url === '') return

  // 开启 progress bar
  NProgress.start()
  const meta = (config.meta || {})
  // 是否提示错误
  config = Object.assign({ reportError: true }, config || {})

  Object.assign(config.headers, getAuthHeader(meta.isToken !== false))

  const isToken = meta.isToken === false

  // 后端要求传menu-id
  const routeMeta = router.app.$route.meta
  const menuId = routeMeta.id || (routeMeta.data ? routeMeta.data.menuId : '')
  config.headers['Blade-Menu-id'] = menuId

  const uid = generateUid()
  if (!config.cancelToken) {
    config.cancelToken = new axios.CancelToken(c => {
      const obj = {
        uid,
        c,
        handler() {
          removeCancelHandlerItem(config)
          c()
        }
      }
      if (config.componentInstance && config.componentInstance.$once) {
        config.componentInstance.$once('hook:beforeDestroy', obj.handler)
      }
      cancelHandler.push(obj) // 可根据链路id去移除元素
    })
  }
  config.headers[logIdKey] = uid // 链路id
  // 让每个请求携带token
  if (getToken() && !isToken) {
    config.headers[website.tokenHeader] = 'bearer ' + getToken()
  }
  // headers中配置text请求
  if (config.text === true) {
    config.headers['Content-Type'] = 'text/plain'
  }

  if (config.method === 'get') {
    config.params = Object.assign({ _: Date.now() }, config.params || {})
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})

// http response 拦截
instance.interceptors.response.use(async res => {
  // 关闭 progress bar
  NProgress.done()

  let data = res.data
  // 如果是blob 且 类型为json，则转成 对象
  if (Object.prototype.toString.call(data) === '[object Blob]' && data.type.indexOf('application/json') === 0) {
    try {
      data = JSON.parse(await data.text())
    } catch (err) {}
  }

  // 获取状态码
  const status = data.code || res.status
  const statusWhiteList = website.statusWhiteList || []
  const message = data.msg || data.message || data.error_description || '未知错误'
  // 如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) {
    return Promise.reject(res)
  }
  // 如果是401则跳转到登录页面
  if (status === 401) {
    cancelHandler.forEach(el => el.c())
    cancelHandler.length = 0
    store.dispatch('FedLogOut').then(() => router.replace('/login').then(() => errorMessage(message)))
    return Promise.reject(new Error(message))
  }

  // 非401状态则移除相应的元素，避免cancelHandler数组不断增长
  removeCancelHandlerItem(res.config)

  // 如果请求为非200否者默认统一处理
  if (status !== 200 && res.config.reportError) {
    errorMessage(message, res.config.headers[logIdKey])
    const err = new Error(message)
    err.data = data
    return Promise.reject(err)
  }
  return data
}, error => {
  if (error.code === 'ECONNABORTED' && error.config.reportError) {
    errorMessage('接口请求超时', error.config.headers[logIdKey])
  }
  NProgress.done()
  return Promise.reject(new Error(error))
})

/**
 * 返回权限验证需要的头部信息
 * @param {boolean} isToken 是否需要token
 */
export function getAuthHeader(isToken = true) {
  const token = getToken()
  const headers = {
    Authorization: `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
  }
  if (token && isToken) {
    headers[website.tokenHeader] = token
  }
  return headers
}

const prefixKey = 'req:'

/**
 * 根据请求的 url、method、params、data 数据生成唯一key
 *
 * 请求返回的数据缓存到本地，下次请求时直接读取缓存
 * @param {Object} options
 * @param {string} options.url 请求地址
 * @param {string} options.method 请求方法，默认为`get`
 * @param {Object} options.data 请求的body
 * @param {Object} options.params 请求的url参数
 * @param {boolean} options.recache 请求接口重新缓存数据，默认`false`
 * @param {Promise}
 */
export function requestCache(options) {
  const { url, data = '', params = '', recache = false } = options
  const method = (options.method || 'get').toLowerCase()
  const uniqueKey = prefixKey + md5([url, method, JSON.stringify(data), JSON.stringify(params)].join(''))
  if (!recache) {
    const result = sessionStorage.getItem(uniqueKey)
    if (result) {
      try {
        return Promise.resolve(JSON.parse(result))
      } catch (err) {
        //
      }
    }
  }

  return instance(options).then(res => {
    sessionStorage.setItem(uniqueKey, JSON.stringify(res))
    return res
  })
}

/**
 * 清空通过 requestCache 方法请求产生的缓存数据
 * @param {string} [key] 删除的key，key为空时则清空所有
 */
export function clearRequestCache(key) {
  if (key) {
    sessionStorage.removeItem(key)
  } else {
    Object.keys(sessionStorage).forEach(key => {
      if (key.indexOf(prefixKey) === 0) {
        sessionStorage.removeItem(key)
      }
    })
  }
}

export { axios }

export default instance
