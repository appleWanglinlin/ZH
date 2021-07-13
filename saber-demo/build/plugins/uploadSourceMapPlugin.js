const webpack = require('webpack')
const Path = require('path')
const Fs = require('fs-extra')
const Axios = require('axios')
const FormData = require('form-data')
const PLUGIN_NAME = 'UploadSourceMapPlugin'

// 检测服务器是否运行中
let serverOnRunning = true
Axios.get(process.env.VUE_APP_MONITOR_URL, { timeout: 3000 }).catch(err => {
  if (err && ['ECONNABORTED', 'EHOSTUNREACH'].includes(err.code)) serverOnRunning = false
})

class UploadSourceMapPlugin {
  async getAssets(distDir) {
    const files = await Fs.readdir(distDir)
    return files.filter(el => /\.js\.map$/i.test(el)).map(el => Path.join(distDir, el))
  }

  async upload(filepath) {
    const stream = Fs.createReadStream(filepath)
    const formData = new FormData()
    formData.append('file', stream)
    return Axios.default({
      url: process.env.VUE_APP_MONITOR_URL + '/upload',
      method: 'put',
      headers: {
        auth: 'source map',
        ...formData.getHeaders()
      },
      timeout: 8000,
      data: formData
    }).then().catch((err) => {
      console.log(Path.basename(filepath), err.message)
    })
  }

  apply(compiler) {
    // 路径需要与 SourceMapDevToolPlugin 插件存放sourcemap文件的地址一致
    const sourcemapDir = Path.join(compiler.options.output.path, 'sourcemap')

    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async() => {
      // 避免本地构建上传文件
      if (serverOnRunning && process.env.USE_BRANCH && process.env.VUE_APP_MONITOR_URL) {
        const files = await this.getAssets(Path.join(sourcemapDir, 'js')) // 只上传js的sourcemap文件
        for (const file of files) {
          await this.upload(file)
        }
      }
      await Fs.remove(sourcemapDir)
    })
  }
}

module.exports = () => {
  return process.env.NODE_ENV === 'production'
    ? [
      new webpack.SourceMapDevToolPlugin({
        filename: 'sourcemap/[file].map', // 修改生成sourcemap文件的路径（对应dist/sourcemap）
        append: false // 不在文件末尾添加 sourcemapUrl
      }),
      new UploadSourceMapPlugin()
    ]
    : []
}
