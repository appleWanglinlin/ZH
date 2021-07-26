[]

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

- [x] [publicPath](https://cli.vuejs.org/zh/config/#publicpath)

  部署应用包时的基本 URL。

  默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 `https://www.my-app.com/`。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 `https://www.my-app.com/my-app/`，则设置 `publicPath` 为 `/my-app/`。

  这个值在开发环境下同样生效。如果你想把开发服务器架设在根路径，你可以使用一个条件式的值：

  ```js
  module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/production-sub-path/'
      : '/'
  }
  ```

- [x] [标题](https://webpack.docschina.org/configuration/other-options/#name)

  ```html
  // index.html
  <title><%= webpackConfig.name %></title>
  ```

  ```json
  // vue.config.js
  configureWebpack: {
      // 在webpack的name字段中提供应用的标题，这样就可以在index.html中访问它，注入正确的标题。
      name: name,
  }
  ```

- [x] [outputDir](https://cli.vuejs.org/zh/config/#outputdir)

  当运行 `vue-cli-service build` 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 `--no-clean` 可关闭该行为)。

- [x] [assetsDir](https://cli.vuejs.org/zh/config/#assetsdir)

  放置生成的静态资源 (js、css、img、fonts) 的 (相对于 `outputDir` 的) 目录。

- [x] [lintOnSave](https://cli.vuejs.org/zh/config/#lintonsave)

  是否在开发环境下通过 [eslint-loader](https://github.com/webpack-contrib/eslint-loader) 在每次保存时 lint 代码。这个值会在 [`@vue/cli-plugin-eslint`](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint) 被安装之后生效。

  设置为 `true` 或 `'warning'` 时，`eslint-loader` 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。

  当 `lintOnSave` 是一个 truthy 的值时，`eslint-loader` 在开发和生产构建下都会被启用。如果你想要在生产构建时禁用 `eslint-loader`，你可以用如下配置：

  ```js
  // vue.config.js
  module.exports = {
    lintOnSave: process.env.NODE_ENV !== 'production'
  }
  ```

- [ ] 2



