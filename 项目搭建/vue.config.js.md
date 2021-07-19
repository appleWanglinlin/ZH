由@vue/cli创建项目，即Vue Cli 3+

- [x] `/server`表示匹配以/server开头的路径的请求将被代理

  `changeOrigin`表示-https://blog.csdn.net/qq_39291919/article/details/108807111

  如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。这个问题可以通过 `vue.config.js` 中的 `devServer.proxy` 选项来配置。

  ```js
  devServer: {
      proxy: {
        '/server': {
          target: 'http://qa-els.izehui.com/',
          changeOrigin: true
        }
      }
    }
  // http://localhost:8080/api/foo/bar -> http://qa-els.izehui.com/api/foo/bar
  ```

  >搜索路径：
  >
  >https://cli.vuejs.org/zh/config/#devserver
  >
  >https://github.com/chimurai/http-proxy-middleware#context-matching
  >
  >createProxyMiddleware({...}) - 匹配任何路径，所有请求将被代理。
  >createProxyMiddleware('/', {...}) - 匹配任何路径，所有的请求都将被代理。
  >createProxyMiddleware('/api', {...}) - 匹配以/api开头的路径。

- [ ] 1

- [ ] 2

- [ ] 3

- [ ] 4



