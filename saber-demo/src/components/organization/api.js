import request from '@/plugins/request/index'

/**
 * 获取组织架构列表（获取所有列表）
 */
export function getOrgListWithoutAuth(data) {
  return request.$ams({
    url: '/org/tree',
    method: 'get',
    params: data
  })
}

/**
 * 获取组织架构列表（根据当前登录用户的权限过滤数据）
 */
export function getOrgListWithAuth(data) {
  return request.$ams({
    url: '/org/tree-with-filter',
    method: 'get',
    params: data
  })
}

/**
 * 得到的用户列表 会根据当前登录用户的权限进行过滤
 */
export function getUserListWithAuth(data) {
  return request.$ams({
    url: '/user/conciseInfo/page',
    params: data
  })
}

/**
 * 得到的用户列表 为所有的用户，不进行过滤（除非根据传入条件过滤）
 */
export function getUserListWithoutAuth(data) {
  return request.$ams({
    url: '/user/conciseInfo/without/filter/page',
    params: data
  })
}
