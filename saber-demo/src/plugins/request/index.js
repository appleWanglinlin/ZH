import request, { requestCache } from './axios'
import { apiPrefix } from '@/router/subsys'

export { axios, getAuthHeader, requestCache, clearRequestCache } from './axios'

const prefix = [
  ...apiPrefix,
  // ['方法名', '每个项目的实际url前缀']
  ['$system', 'blade-system'],
  ['$opsResource', 'ops-resource']
]

prefix.forEach(([alias, pathPrefix]) => {
  Object.defineProperty(request, alias, {
    get() {
      return (options, componentInstance) => {
        const url = `/${pathPrefix || alias.slice(1)}` + options.url
        if (options.useCache) {
          return requestCache({ ...options, url, componentInstance })
        }
        return request({ ...options, url, componentInstance })
      }
    }
  })
})

export default request
