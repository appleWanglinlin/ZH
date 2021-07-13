import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'
import admin from '@/util/admin'
import { ui } from '@/util/theme'

const collapsePropName = 'collapse'

const common = {
  state: {
    language: getStore({ name: 'language' }) || 'zh',
    isCollapse: ui.get(collapsePropName) || false,
    isFullScren: false,
    isMenu: true,
    isShade: false,
    screen: admin.getScreen(),
    isLock: getStore({ name: 'isLock' }) || false,
    showTag: true,
    showDebug: true,
    showCollapse: true,
    showSearch: true,
    showLock: true,
    showFullScren: true,
    showTheme: true,
    showMenu: true,
    showColor: true,
    lockPasswd: getStore({ name: 'lockPasswd' }) || '',
    website: website,
    // 只用于其他组件监听此值的变化（可以为任意值）
    windowResize: 0
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse
      ui.set({ [collapsePropName]: state.isCollapse })
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu
    },
    SET_LOCK: (state) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore('session', 'lockPasswd')
      removeStore('session', 'isLock')
    },
    SET_WINDOW_RESIZE(state) {
      // 只是用于其他组件监听 windowResize，所以可以设置任意值
      state.windowResize = Date.now()
    }
  }
}
export default common
