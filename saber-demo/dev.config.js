
/**
 * 开发环境代理配置
 */
const autoUpdateEnv = require('./build/autoUpdateEnv')

let API_URL = process.env.VUE_APP_API_URL
autoUpdateEnv(config => {
  API_URL = config.VUE_APP_API_URL
})

const proxy = {
  // '/api/ams': {
  //   target: API_URL
  // },

  // '/api/pms': {
  //   target: API_URL,
  //   headers: {
  //     'service-ip': '127.0.0.1'
  //   }
  // },
  '/api': {
    target: API_URL
  }
}

for (const key in proxy) {
  if (!proxy[key].pathRewrite) {
    proxy[key].pathRewrite = {
      '^/api': '/'
    }
  }

  Object.assign(proxy[key], {
    // 使用router覆盖target
    router: () => API_URL,
    // https://github.com/chimurai/http-proxy-middleware/tree/v0.21.0#http-proxy-events
    onProxyRes(proxyRes, req, res) {
      proxyRes.headers['api-url'] = API_URL
    }
  })
}

module.exports = {
  host: process.env.host,
  port: process.env.VUE_APP_DEV_PORT,
  proxy
}
