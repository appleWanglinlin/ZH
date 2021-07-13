import config from '@/config/website'

export default {
  tip: '提示',
  title: config.title,
  logoutTip: '退出系统, 是否继续?',
  submitText: '确定',
  cancelText: '取消',
  search: '请输入搜索内容',
  menuTip: '没有发现菜单',
  wel: {
  },
  route: {
  },
  login: {
    title: '登录 ',
    info: config.title,
    tenantId: '请输入租户ID',
    username: '请输入账号',
    password: '请输入密码',
    wechat: '微信',
    qq: 'QQ',
    github: 'github',
    gitee: '码云',
    phone: '请输入手机号',
    code: '请输入验证码',
    submit: '登录',
    userLogin: '账号密码登录',
    phoneLogin: '手机号登录',
    thirdLogin: '第三方系统登录',
    msgText: '发送验证码',
    msgSuccess: '秒后重发'
  },
  navbar: {
    logOut: '退出登录',
    userinfo: '个人信息',
    dashboard: '首页',
    lock: '锁屏',
    bug: '没有错误日志',
    bugs: '条错误日志',
    screenfullF: '退出全屏',
    screenfull: '全屏',
    language: '中英文',
    notice: '消息通知',
    theme: '主题',
    color: '换色'
  },
  tagsView: {
    search: '搜索',
    menu: '更多',
    clearCache: '清除缓存',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  }
}
