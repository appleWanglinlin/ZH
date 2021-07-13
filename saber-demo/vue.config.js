const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyDistLibPlugin = require('./build/plugins/copyDistLibPlugins')
const GenerateFilesWebpackPlugin = require('./build/plugins/generateFiles')
const ReplacePath = require('./build/plugins/replacePath')
const UploadSourceMapPlugin = require('./build/plugins/uploadSourceMapPlugin')
const { formatDate } = require('./build/util')

const isDev = process.env.NODE_ENV === 'development'
const isSaas = process.argv.includes('--saas')
const bootstrapTime = formatDate(new Date(), '1.Md.hm')

// 根据约定规则自动生成路由文件
new GenerateFilesWebpackPlugin().apply()

module.exports = {
  // 路径前缀
  publicPath: '/',
  lintOnSave: true,
  // productionSourceMap: true,
  css: {
    loaderOptions: {
      sass: {
        // 将element-ui的sass变量全局注入
        prependData: '@import "@/styles/element-var.scss";'
      }
    }
  },
  configureWebpack(config) {
    if (isDev) {
      config.devtool = process.env.VUE_DEVTOOL || 'eval-source-map'
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        __SAAS__: JSON.stringify(isSaas),
        __BUILD_TIME__: JSON.stringify(bootstrapTime)
      }),
      // 将构建的资源文件输出到json文件中
      new HtmlWebpackPlugin({
        inject: false,
        templateParameters: { bootstrapTime },
        template: 'src/asserts.ejs',
        filename: 'asserts.json'
      }),
      new CopyDistLibPlugin(),
      ReplacePath(),
      ...UploadSourceMapPlugin(),
      new CompressionPlugin({
        test: /\.(js|css|html)$/,
        threshold: 8192 // 8kb
      })
    )

    if (!isDev) {
      Object.assign(config.optimization, {
        splitChunks: {
          minSize: 10000,
          maxSize: 500000
        },
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                pure_funcs: ['console.log']
              }
            },
            extractComments: false
          })
        ]
      })
    }
  },
  chainWebpack: config => {
    if (!isDev) {
      // 正式环境忽略的打包文件
      // 配置规则： `{key: value}` 等价于 `import value form 'key'`
      config.externals({
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'element-ui': 'ELEMENT'
      })
    }
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()

    // 对 global-components 和 zh-xxx 包进行包含处理
    config.module.rule('compile')
      .test(/\.jsx?$/).include.add(/node_modules[\\/](global-components|zh-)/).end()
      .use('babel').loader('babel-loader').options({
        presets: [
          ['@babel/preset-env', { modules: false }]
        ]
      })

    config.plugin('html').tap(options => {
      if (Array.isArray(options)) {
        options[0].title = isSaas ? '...' : '服务中心系统'
      }
      return options
    })
  },
  /**
   * 开发模式反向代理配置（请移步至 dev.config.js 文件中修改！！！！）
   * 生产模式请使用Nginx部署并配置反向代理
   */
  devServer: isDev ? require('./dev.config') : undefined
}
