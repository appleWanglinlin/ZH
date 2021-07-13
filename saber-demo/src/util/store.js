import { validatenull } from '@/util/validate'
import website from '@/config/website'

const keyName = website.key
const storageType = ['local', 'session']

function checkType(type) {
  if (!storageType.includes(type)) throw new Error('clearStore 传入的第一个参数错误')
}

/**
 * 存储localStorage
 * @param {object} params
 * @param {string} params.name 存储的键名
 * @param {'local'|'session'} params.type 存储类型，默认 `local`。可选值 `local`, `session`
 * @param {any} params.content 储存的内容，任意类型
 */
export const setStore = (params = {}) => {
  if (validatenull(params)) return
  let { name, type } = params
  type = storageType.includes(type) ? type : 'local'
  const { content } = params
  name = keyName + name
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  window[type + 'Storage'].setItem(name, JSON.stringify(obj))
}

/**
 *  获取localStorage
 * @param {object} params
 * @param {string} params.name 存储键名
 * @param {'local'|'session'} params.type 存储类型，未指定类型时先从sessionStorage查找，未找到再从localStorage中查找。可选值`local`,`session`
 */
export const getStore = (params = {}) => {
  if (validatenull(params)) return
  const type = params.type
  let { name } = params
  const { debug } = params
  name = keyName + name
  let obj = {}
  let content
  if (storageType.includes(type)) {
    obj = window[type + 'Storage'].getItem(name)
  } else {
    obj = window.sessionStorage.getItem(name)
    if (validatenull(obj)) obj = window.localStorage.getItem(name)
  }
  if (validatenull(obj)) return
  try {
    obj = JSON.parse(obj)
  } catch (err) {
    return obj
  }
  if (debug) {
    return obj
  }
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    // eslint-disable-next-line
    content = new Function(`return ${obj.content}`)()
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}

/**
 * 根据type和key 删除相应的Storage
 * @param {'local'|'session'} type 存储类型
 * @param {string} key 存储的key值
 */
export const removeStore = (type = 'local', key) => {
  checkType(type)
  window[type + 'Storage'].removeItem(keyName + key)
}

/**
 * 获取全部localStorage
 * @param {'local'|'session'} type
 */
export const getAllStore = (type = 'local') => {
  type = storageType.includes(type) ? type : 'local'

  return Object.keys(window[type + 'Storage']).map(key => {
    return { name: key, content: getStore({ name: key, type }) }
  })
}

/**
 * 清空全部localStorage
 * @param {object} params
 * @param {string[]} exclude 排除删除的key（key会自动添加配置的key前缀）
 */
export const clearStore = (type = 'local', excludes = []) => {
  checkType(type)
  const store = window[type + 'Storage']

  if (Array.isArray(excludes) && excludes.length > 0) {
    const excludeArr = excludes.map(el => keyName + el)
    Object.keys(store).forEach(key => {
      if (!excludeArr.includes(key)) {
        store.removeItem(key)
      }
    })
  } else {
    store.clear()
  }
}
