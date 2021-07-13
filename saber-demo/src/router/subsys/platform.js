// 平台服务中心 子系统的路由
import { isSaas } from '@/config/env'
import * as opms from 'zh-opms'
import * as pms from 'zh-pms'
import * as cams from 'zh-cams'
import * as ims from 'zh-ims'
import * as ips from 'zh-ips'
import * as pss from 'zh-pss'
import * as scrs from 'zh-scrs'
import * as ers from 'zh-ers'
import * as prs from 'zh-prs'
import * as fps from 'zh-fps'
import * as ltms from 'zh-ltms'
import * as otms from 'zh-otms'
import * as trs from 'zh-trs'
import * as lps from 'zh-lps'

const subs = [
  opms,
  pms,
  cams,
  ims,
  ips,
  pss,
  scrs,
  ers,
  prs,
  fps,
  ltms,
  otms,
  trs,
  lps
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
