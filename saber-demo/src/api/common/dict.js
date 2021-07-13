import request from '@/plugins/request'

function getKey(code = '', appCode = '') {
  return ['req:dict', appCode.toLowerCase(), code.toLowerCase()].join(':')
}

function getDictRequest(code, appCode, componentInstance) {
  return request({
    url: '/dict/dict-biz/dictionary',
    params: { code, appCode },
    componentInstance
  })
}

function getStorage(code = '', appCode, includeDelete) {
  const key = getKey(code, appCode)
  const data = sessionStorage.getItem(key)
  try {
    const list = JSON.parse(data)
    return includeDelete ? list : list.filter(item => item.isDeleted !== 1)
  } catch (err) {
    sessionStorage.removeItem(key)
    return null
  }
}

function setStorage(code = '', appCode, data, includeDelete) {
  // 返回的数据为空则不缓存
  if (data.length === 0) return data

  sessionStorage.setItem(getKey(code, appCode), JSON.stringify(data))
  return includeDelete ? data : data.filter(item => item.isDeleted !== 1)
}

function catchError(val) {
  console.error(`获取字典失败： ${Array.isArray(val) ? val.join(', ') : val}`)
}

/**
 * 获取单个字典
 * @param {String} code code值
 * @param {String} appCode 模块code值，默认`all`，为`all`时查找系统字典。可选值有`ams`、`pms`等
 * @param {Boolean} includeDelete 返回列表中是否包含已删除的项。默认`true`
 * @returns {Promise<{label:string,value:string}[]>}
 */
export function getDict(code, appCode = 'all', includeDelete = true, componentInstance) {
  const result = getStorage(code, appCode, includeDelete)
  if (result) return Promise.resolve(result)

  return getDictRequest(code, appCode, componentInstance).then(({ data = [] }) => {
    const result = data.map(({ dictKey: value, dictValue: label, isDeleted }) => ({ label, value, isDeleted }))
    return setStorage(code, appCode, result, includeDelete)
  }).catch(catchError)
}

/**
 * 获取多个字典
 * @param {String[]} codes code值
 * @param {String} appCode 模块code值，默认`all`，为`all`时查找系统字典。可选值有`ams`、`pms`等
 * @param {Boolean} includeDelete 返回列表中是否包含已删除的项。默认`true`
 * @returns {Promise<{[key:string]:{label:string,value:string}[]}>}
 */
export function getDicts(codes, appCode = 'all', includeDelete = true, componentInstance) {
  if (!Array.isArray(codes)) return Promise.reject(new Error('codes必须为数组'))

  const unExistCodes = []
  const existMapping = {}
  codes.forEach(item => {
    const result = getStorage(item, appCode, includeDelete)
    if (result) {
      existMapping[item] = result
    } else {
      unExistCodes.push(item)
    }
  })

  if (unExistCodes.length === 0) {
    return Promise.resolve(existMapping)
  }

  return getDictRequest(unExistCodes.join(','), appCode, componentInstance).then(({ data = [] }) => {
    const obj = unExistCodes.reduce((prev, current) => {
      prev[current] = []
      return prev
    }, {})
    data.forEach(({ code, dictKey, dictValue, isDeleted }) => {
      if (!obj[code]) obj[code] = []
      obj[code].push({ label: dictValue, value: dictKey, isDeleted })
    })

    for (const key in obj) {
      setStorage(key, appCode, obj[key], includeDelete)
    }
    return Object.assign(existMapping, obj)
  }).catch(catchError)
}
