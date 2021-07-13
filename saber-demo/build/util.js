const Fs = require('fs-extra')
const Path = require('path')

/**
 * 读取环境变量文件中的配置
 * @param {string} envFile
 * @returns {string}
 */
exports.readEnvFile = (envFile) => {
  const config = {}
  if (Fs.pathExistsSync(envFile)) {
    const content = Fs.readFileSync(envFile, 'utf8')
    content.split(/[\r\n]+/).forEach(el => {
      const s = el.trim()
      if (s && s.indexOf('#') !== 0) {
        const [key, value] = s.split('=')
        if (value) {
          config[key] = value
        }
      }
    })
  }
  return config
}

/**
 * 根据当前的环境获取对应的环境变量文件
 */
exports.getEnvFilepath = (env) => {
  const envFile = Path.join(process.cwd(), `.env.${env || process.env.NODE_ENV || 'development'}`)
  const localEnvFile = envFile + '.local'
  let filepath
  if (Fs.pathExistsSync(localEnvFile)) {
    filepath = localEnvFile
  } else if (Fs.pathExistsSync(envFile)) {
    filepath = envFile
  }
  return filepath
}

/**
 * 判断路径类型
 * @param {string} filepath
 * @returns {Promise<0|1|2>} 0路径不存在，1路径为文件，2路径为文件夹
 */
exports.pathType = async(inputPath) => {
  return Fs.promises.stat(inputPath).then(stat => {
    if (stat.isFile()) return 1
    if (stat.isDirectory()) return 2
    return 0
  }).catch(() => 0)
}

/**
 * 判断路径类型
 * @param {string} filepath
 * @returns {0|1|2} 0路径不存在，1路径为文件，2路径为文件夹
 */
exports.pathTypeSync = inputPath => {
  try {
    const stat = Fs.statSync(inputPath)
    if (stat.isFile()) return 1
    if (stat.isDirectory()) return 2
  } catch (err) {}
  return 0
}

exports.formatDate = function(_d = new Date(), format = 'y/M/d h:m') {
  // 客户端任意时区转东八区
  const date = new Date(_d.getTime() + _d.getTimezoneOffset() * 60000 + 3600000 * 8)

  const y = date.getFullYear()
  const M = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  const p = s => String(s).padStart(2, '0')
  return format.replace(/y+/ig, y).replace(/M+/g, p(M)).replace(/d+/g, p(d)).replace(/h+/g, p(h)).replace(/m+/g, p(m))
}
