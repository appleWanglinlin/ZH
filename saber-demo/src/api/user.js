import request from '@/router/axios'
import website from '@/config/website'

export const loginByUsername = ({ tenantId, username, password, type, key, code, fp }) => request.$auth({
  url: '/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId,
    'Captcha-Key': key,
    'Captcha-Code': code
  },
  data: {
    tenantId,
    username,
    password,
    grant_type: (website.captchaMode ? 'captcha' : 'password'),
    scope: 'all',
    type,
    fp
  }
})

export const loginBySocial = (tenantId, source, code, state) => request.$auth({
  url: '/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grant_type: 'social',
    scope: 'all'
  }
})

export const refreshToken = (refreshToken, tenantId) => request.$auth({
  url: '/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'all'
  }
})

export const registerGuest = (form, oauthId) => request({
  url: '/blade-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
})

export const getButtons = () => request.$ams({
  url: '/menu/buttons',
  method: 'get'
})

export const getCaptcha = () => request.$auth({
  url: '/oauth/captcha',
  method: 'get'
})

export const logout = () => request.$auth({
  url: '/oauth/logout',
  method: 'get'
})

export const getUserInfo = () => request.$auth({
  url: '/oauth/user-info',
  method: 'get'
})

export const sendLogs = (list) => request.$auth({
  url: '/oauth/logout',
  method: 'post',
  data: list
})

export const clearCache = () => request.$auth({
  url: '/oauth/clear-cache',
  method: 'get'
})

// 修改密码
export const updatePwd = data => request.$ams({
  url: '/user/update-password',
  method: 'post',
  params: data
})
