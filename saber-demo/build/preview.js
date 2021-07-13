const Http = require('http')
const Fs = require('fs-extra')
const Path = require('path')
const Url = require('url')
const Proxy = require('http-proxy')
const Color = require('ansi-colors')
const { readEnvFile, getEnvFilepath } = require('./util')

const rootDir = Path.join(__dirname, '../dist')
// 合并配置
const config = Object.assign({
  VUE_APP_DEV_PORT: 8088,
  VUE_APP_API_URL: 'http://test-ams-gateway.zehui.local'
}, readEnvFile(getEnvFilepath('production')))

const agent = Proxy.createProxyServer().on('error', err => console.error(err.message))

const server = Http.createServer(async(req, res) => {
  const reg = /^\/api\//i
  // api 代理
  if (reg.test(req.url)) {
    req.url = req.url.replace(reg, '/')
    agent.web(req, res, {
      followRedirects: true,
      target: config.VUE_APP_API_URL,
      changeOrigin: true
    })
  } else {
    let { pathname } = new Url.URL(req.url, 'http://me.com')
    if (!/\.[a-z\d]+$/.test(pathname)) {
      pathname = 'index.html'
    }

    const filepath = Path.join(rootDir, pathname)
    if (await Fs.pathExists(filepath)) {
      Fs.createReadStream(filepath).pipe(res).once('error', err => {
        res.end(err.message)
      })
    } else {
      res.statusCode = 404
      res.end(`文件${filepath} 不存在`)
    }
  }
})

server.listen(config.VUE_APP_DEV_PORT)

server.once('listening', () => console.log(`
${Color.bold(Color.red('注意：\n     使用前请确保已执行 `npm run build` 或 `npm run build-saas`'))}

使用接口地址：${config.VUE_APP_API_URL}
模拟生产地址：${Color.blue('http://localhost:' + config.VUE_APP_DEV_PORT)}
`))

server.on('error', console.error)
