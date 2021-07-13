import request from '@/router/axios'

export const getList = (current, size, params) => {
  return request.$ams({
    url: '/dict-biz/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getParentList = (current, size, params) => {
  return request.$ams({
    url: '/dict-biz/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getChildList = (current, size, parentId, params) => {
  return request.$ams({
    url: '/dict-biz/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId
    }
  })
}

export const remove = (ids) => {
  return request.$ams({
    url: '/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const add = (row) => {
  return request.$ams({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request.$ams({
    url: '/dict-biz/submit',
    method: 'post',
    data: row
  })
}

export const getDict = (id) => {
  return request.$ams({
    url: '/dict-biz/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const getDictTree = () => {
  return request.$ams({
    url: '/dict-biz/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  console.warn('getDictionary已废弃，请使用`@/api/common/dict`中的方法')
  return request.$ams({
    useCache: true,
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}

/**
 * 获取字典列表，并格式化数据
 * @param {string} code
 * @returns {Promise}
 */
export const getDictionaryList = code => {
  console.warn('getDictionaryList已废弃，请使用`@/api/common/dict`中的方法')
  return getDictionary({ code }).then(res => {
    return res.data.map(({ dictKey, dictValue: label }) => {
      return { label, value: dictKey }
    })
  })
}
