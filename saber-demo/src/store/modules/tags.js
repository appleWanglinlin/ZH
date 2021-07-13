import { setStore, getStore } from '@/util/store'
import { diff } from '@/util/util'
import website from '@/config/website'
import Router from '@/router/router'

const isFirstPage = website.isFirstPage
const tagWel = website.fistPage
const tagObj = {
  label: '', // 标题名称
  value: '', // 标题的路径
  params: '', // 标题的路径参数
  query: '', // 标题的参数
  meta: {}, // 额外参数
  group: [] // 分组
}

// 处理首个标签
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false
  } else {
    list.forEach(ele => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}

const nameTagList = 'tagList'
const newTabRegExp = /^\/common\//i

function getTagList() {
  return (getStore({ name: nameTagList }) || []).filter(item => !newTabRegExp.test(item.value))
}

function getCurrentTag() {
  const cache = getStore({ name: 'tag' })
  if (!cache || newTabRegExp.test(cache.content?.value)) return tagObj
  return cache
}

export default {
  state: {
    tagList: getTagList(),
    tag: getCurrentTag(),
    tagWel: tagWel
  },
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action
      setStore({
        name: 'tag',
        content: state.tag
      })
      if (action.value === tagWel.value) return
      if (state.tagList.some(ele => diff(ele.value, action.value))) return

      action.meta.referer = Router.currentRoute.fullPath // 设置来源地址页面的路由名称
      state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({
        name: nameTagList,
        content: state.tagList
      })
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action)
      })
      setFistTag(state.tagList)
      setStore({
        name: nameTagList,
        content: state.tagList
      })
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [state.tagWel]
      setStore({
        name: nameTagList,
        content: state.tagList
      })
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true
        } else if (!website.isFirstPage && item.value === website.fistPage.value) {
          return true
        }
      })
      setFistTag(state.tagList)
      setStore({
        name: nameTagList,
        content: state.tagList
      })
    },
    SET_TAG_LIST(state, tagList) {
      state.tagList = tagList
      let obj = {}
      state.tagList = state.tagList.reduce((item, next) => {
        if (!obj[next.value]) {
          obj[next.value] = true
          item.push(next)
        }
        return item
      }, [])
      obj = null
      setStore({
        name: nameTagList,
        content: state.tagList
      })
    },
    // 根据value值来更新tagList中的meta.name（即更新标题）
    UPDATE_TAG_NAME_BY_VALUE(state, { value, title }) {
      state.tagList = state.tagList.map(item => {
        if (item.value === value) {
          item.meta.name = title
        }
        return item
      })
    }
  }
}
