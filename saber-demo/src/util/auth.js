const TokenKey = 'zh-access-token'
const RefreshTokenKey = 'zh-refresh-token'
const storage = localStorage

export function getToken() {
  return storage.getItem(TokenKey)
}

export function setToken(token) {
  storage.setItem(TokenKey, token)
  return token
}

export function getRefreshToken() {
  return storage.getItem(RefreshTokenKey)
}

export function setRefreshToken(token) {
  storage.setItem(RefreshTokenKey, token)
  return token
}

export function removeToken() {
  return storage.removeItem(TokenKey)
}

export function removeRefreshToken() {
  return storage.removeItem(RefreshTokenKey)
}
