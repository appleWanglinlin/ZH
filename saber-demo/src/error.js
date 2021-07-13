import Vue from 'vue'
import { env } from '@/config/env'
// import store from './store'

const cache = []
const isPushError = /^(test|pre)-/.test(location.hostname)

Vue.config.errorHandler = function(err, vm, info) {
  // Vue.nextTick(() => {
  //   store.commit('ADD_LOGS', {
  //     type: 'error',
  //     message: err.message,
  //     stack: err.stack,
  //     info
  //   })
  // })

  // 收集测试环境和演示环境的js报错
  if (isPushError && cache.every(el => el.message !== err.message)) {
    cache.push({
      message: err.message,
      stack: err.stack,
      info,
      href: location.href
    })
  }
  throw err
}

isPushError && setInterval(() => {
  if (cache.length > 0) {
    fetch(env.VUE_APP_MONITOR_URL + '/log/loading.gif', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(cache)
    })
    cache.length = 0
  }
}, 5000)
