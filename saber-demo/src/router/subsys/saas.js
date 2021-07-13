// SaaS 子系统的路由
import { isSaas } from '@/config/env'
import * as ams from 'zh-ams'
import * as lms from 'zh-lms'
import * as pms from 'zh-pms'
import * as sams from 'zh-sams'
import * as oms from 'zh-oms'
import * as pps from 'zh-pps'
import * as ips from 'zh-ips'
import * as ims from 'zh-ims'
import * as pss from 'zh-pss'
import * as fas from 'zh-fas'

const subs = [
  ams,
  lms,
  pms,
  sams,
  oms,
  pps,
  ips,
  ims,
  pss,
  fas
]

const routes = []
const pageRoutes = []
const apiPrefix = []

subs.forEach(item => {
  routes.push(...item.routes)
  pageRoutes.push(...item.pageRoutes)
  apiPrefix.push(...typeof item.apiPrefix === 'function' ? item.apiPrefix(isSaas) : item.apiPrefix)
})

export { routes, pageRoutes, apiPrefix }
