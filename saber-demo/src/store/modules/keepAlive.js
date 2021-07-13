// 存储需要缓存的页面

export default {
  state: {
    reload: false,
    list: [],
    // 记录路由页面来源信息
    referer: {
      type: 0, // 0 不需要刷新， 1刷新路由
      from: ''
    }
  },
  mutations: {
    ADD_KEEP_ALIVE(state, componentName) {
      if (componentName && !state.list.includes(componentName)) {
        state.list.push(componentName)
      }
    },
    DEL_KEEP_ALIVE(state, componentName) {
      if (componentName) {
        state.list = state.list.filter(item => item !== componentName)
      }
    },
    UPDATE_RELOAD(state, status) {
      state.reload = status
    },
    UPDATE_REFERER(state, data) {
      state.referer = data
    }
  },
  actions: {
    // 切换路由时更新 state.list，避免 list 数组过长
    updateList({ rootState, state }) {
      const tagList = rootState.tags.tagList
      const tagNames = tagList.map(item => item.label)
      state.list = state.list.filter(item => tagNames.includes(item))
    },
    /**
     * 刷新当前路由（适用于keep-alive路由）
     * @param {object} payload 组件的this
     * @param {string} payload.scope 组件的this
     * @param {string} payload.name 组件名称(组件名称和路由名称必须保持一致)
     */
    reload({ commit }, payload) {
      commit('UPDATE_RELOAD', true)
      commit('DEL_KEEP_ALIVE', payload.name)
      payload.scope.$nextTick(() => {
        commit('UPDATE_RELOAD', false)
        commit('ADD_KEEP_ALIVE', payload.name)
      })
    }
  }
}
