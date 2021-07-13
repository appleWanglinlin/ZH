import { validatenull } from './validate'
import axios from 'axios'

// 表单序列化
export const serialize = data => {
  const list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
export const getObjType = obj => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
export const getViewDom = () => {
  return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + ' grayMode'
  } else {
    document.body.className = document.body.className.replace(' grayMode', '')
  }
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen()
  } else {
    reqFullScreen()
  }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }

  document.addEventListener('fullscreenchange', function() {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function() {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function() {
    listen()
  })
  document.addEventListener('msfullscreenchange', function() {
    listen()
  })
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i]
        } else {
          if (menu[i].children[j].children.length !== 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
}

/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = ''
  if (validatenull(dic)) return value
  if (typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean') {
    let index = 0
    index = findArray(dic, value)
    if (index !== -1) {
      result = dic[index].label
    } else {
      result = value
    }
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach(ele => {
      index = findArray(dic, ele)
      if (index !== -1) {
        result.push(dic[index].label)
      } else {
        result.push(value)
      }
    })
    result = result.toString()
  }
  return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i
    }
  }
  return -1
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
  if (date) random = random + Date.now()
  return random
}
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
  return window.location.href.split('/#/')[0]
}

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(decodeURI(r[2]))
  return null
}
/**
 * @param that vue的实例对象
 * @param refsArr vue模板上的ref
 * @param fixedHei 不需要计算的已知高度
 */
export const getMaxTableHei = (that, refsArr, fixedHei = 0) => {
  const totalHeight = document.documentElement.clientHeight || document.body.clientHeight // window.screen.availHeight
  let subtractedHei = 0
  try {
    refsArr.length && refsArr.forEach(ref => {
      subtractedHei += that.$refs[ref].clientHeight || that.$refs[ref].$el.clientHeight
    })
  } catch (e) {}

  return totalHeight - subtractedHei - fixedHei
}
/**
 防抖（debounce）
所谓防抖，就是指触发事件后 n 秒后才执行函数，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
防抖函数分为非立即执行版和立即执行版。
 */
export const debounce = (func, wait, immediate) => {
  let timeout
  return function() {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 节流（throttle）
所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率。
对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版。
 */
export function throttle(func, wait) {
  var previous = 0
  return function() {
    const now = Date.now()
    const context = this
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

/**
 * 下载exc文件
 * @param {any} data 文件流（或者下载的url）
 * @param {string} name 文件名
 * @param {boolean} [isUrl=false] data是否url地址，默认否
 */
export function dowloadExc(data, name = '文件.xls', isUrl = false) {
  function dowload() {
    // const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
    const blob = new Blob([data], { type: 'application/octet-stream' })
    if ('download' in document.createElement('a')) {
      const aNode = document.createElement('a')
      const url = isUrl ? data : window.URL.createObjectURL(blob)
      aNode.download = name
      aNode.style.display = 'none'
      aNode.href = url
      document.body.appendChild(aNode)
      aNode.click()
      document.body.removeChild(aNode)
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    } else {
    // IE 10+
      window.navigator.msSaveBlob(blob, name)
    }
  }
  if (!isUrl) return dowload()
  axios({ url: data, responseType: 'blob' }).then(res => {
    data = res.data
    isUrl = false
  }).finally(dowload)
}

/**
 * 将路径转换成大驼峰，如将 /home/index 转换成 HomeIndex
 * @param {string} pathname 路径
 */
export function pathToUpperCamelCase(pathname) {
  return pathname.replace(/\?.+$/, '').split(/[/-]/).map(el => el.slice(0, 1).toUpperCase() + el.slice(1)).join('')
}

/**
 * 将大驼峰转成需要的格式，如 HomeIndex 转成 home/index
 * @param {string} str 大驼峰字符串
 * @param {string} split 分隔符
 */
export function upperCamelCaseToString(str = '', split = '/') {
  return str.split('').map((s, index) => {
    if (/^[A-Z]$/.test(s)) {
      s = s.toLowerCase()
      return index > 0 ? split + s : s
    }
    return s
  }).join('')
}

/**
 * 字符超过指定长度后，后面补省略号
 * @param {string} str 需要处理的字符串
 * @param {number} len 限制长度
 */
export function stringEllipsis(str, len) {
  if (typeof len !== 'number') return str

  const reg = new RegExp(`^(.{${len}})(.+)$`)
  return (str || '').replace(reg, '$1...')
}

/***
 * @description 保存两位小数位数
 */
export function toFixed2(inputStr) {
  let val = inputStr
  // 过滤成两位小数位数
  // eslint-disable-next-line
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
  // 返回最终输入的内容
  return val
}

function pickOrOmitFromObj(target = {}, keys = [], isPick = true) {
  if (keys.length === 0) return isPick ? {} : Object.assign({}, target)
  return Object.entries(target).reduce((prev, [key, value]) => {
    if (keys.includes(key) === isPick) prev[key] = value
    return prev
  }, {})
}

/**
 * 根据提供的keys从对象中提取对应的属性，返回一个新的对象
 * @param {object} obj 目标对象
 * @param {string[]} keys 提取的属性
 * @returns {object}
 */
export function pick(target = {}, keys = []) {
  return pickOrOmitFromObj(target, keys, true)
}

/**
 * 根据提供的keys从对象中排除对应的属性，返回一个新的对象
 * @param {object} obj 目标对象
 * @param {string[]} keys 排除的属性
 * @returns {object}
 */
export function omit(target = {}, keys = []) {
  return pickOrOmitFromObj(target, keys, false)
}
