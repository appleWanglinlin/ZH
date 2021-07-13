/**
 * 复制库文件到 public/cdn/libs 中，
 * 确保开发环境与生产环境 依赖版本一致(同时省去手动更新文件)
 */

const fs = require('fs-extra')
const path = require('path')

const pluginName = 'CopyDistLibWebpackPlugin'
const rootDir = path.join(__dirname, '../../')
const libsDir = path.join(rootDir, 'public/cdn/libs')

class CopyDistLibWebpackPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync(pluginName, async(compilation, cb) => {
      await this.copy()
      cb()
    })
  }

  async copy() {
    await fs.emptyDir(libsDir)

    // 需要复制的文件（从node_modules中复制，确保对应的包有相应的压缩文件）
    // 确保在 public/index.html 文件中引用以下地址
    const arr = [
      'vue/dist/vue.min.js',
      'vuex/dist/vuex.min.js',
      'vue-router/dist/vue-router.min.js',
      'axios/dist/axios.min.js',
      'element-ui/lib/index.js'
    ]

    const filenameArr = []

    for (const item of arr) {
      const packageName = item.match(/^[^/]+/)[0]
      const version = require(`${packageName}/package.json`).version
      const filename = `${packageName}-${version}.min.js`

      filenameArr.push(filename)
      await fs.copy(path.join(rootDir, 'node_modules', item), path.join(libsDir, filename))
    }
    process.env.VUE_APP_LIBS = JSON.stringify(filenameArr)
    console.log('\n\x1B[42;30m DONE \x1B[;m', 'Copyed libs to `public/cdn/libs` success.')
  }
}

module.exports = CopyDistLibWebpackPlugin
