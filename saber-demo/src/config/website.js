/**
 * 全局配置文件
 */
import { isSaas } from './env'

const saasConfig = {
  // 客户端密钥
  clientSecret: 'saber_secret',
  title: '供应链系统',
  enTitle: 'SAAS'
}

const platConfig = {
  clientSecret: 'cams_saber_secret',
  title: '服务中心系统',
  enTitle: 'Service center system'
}

export default {
  host: 'saber.izehui.com',
  logo: 'ZH',
  key: 'zh-', // 配置主键,目前用于存储
  clientId: 'saber', // 客户端id
  tenantMode: true, // 是否开启租户模式
  tenantId: '000000', // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  lockPage: '/lock',
  /** 单位：秒。检测token的频率 */
  tokenRefreshRate: 300,
  tokenHeader: 'Blade-Auth',
  // http的status默认放行列表
  statusWhiteList: [],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  ...isSaas ? saasConfig : platConfig
}
