/**
 * 同步登录状态
 * 处理场景：
 *   1. 登录后打开多个页面，在其中一个页面退出登录，则在其他页面中提示已退出登录。
 *   2. 打开未登录页面，在其中一个进行登录也是一样的处理逻辑
 */

import { MessageBox } from 'element-ui'
import config from '@/config/website'
import { clearStore, getStore } from '@/util/store'
import store from '@/store/index'
import md5 from 'js-md5'

const userInfoKey = config.key + 'userInfo'
let pending = false // 是否已弹窗显示退出登录

function syncState() {
  const data = getStore({ type: 'local', name: 'userInfo' })
  let hash = null
  let msg = ''

  if (data) {
    hash = data.hash
    data.hash = null
    msg = '您已登录其他账号，请刷新页面'
  } else {
    msg = '您已退出登录'
  }

  // 登录时在data中有存data数据的md5值(hash字段)，用于校验userInfo数据是否是合法修改
  if (!data || md5(JSON.stringify(data)) !== hash) {
    clearStore('session')

    // 如果已弹窗则将前面的弹窗关闭
    if (pending) MessageBox.close()

    const older = store.getters.userInfo
    // 新登录的用户 与 之前登录的用户 为同一人时
    if (data && older && data.user_id === older.user_id) return

    pending = true
    MessageBox.alert(msg, {
      type: 'info',
      title: '登录提示',
      showClose: false
    }).then(action => {
      if (action === 'confirm') {
        location.reload() // 如果不是刷新页面则需要去重置pending值
      }
    })
  }
}

/** 获取退出登录的弹窗状态 */
export function getPending() {
  return pending
}

window.addEventListener('storage', ev => {
  // 只监听localStorage
  if (ev.storageArea !== localStorage) return

  // 检测是不是 userInfo 发生变化
  if (ev.key === userInfoKey) {
    syncState()
  }
})
