const fs = require('fs')
const { readEnvFile, getEnvFilepath } = require('./util')

/**
 * 文件修改后重新读取配置
 * @param {(config:{[key:string]:string})} callback
 */
module.exports = (callback) => {
  const filepath = getEnvFilepath()

  if (!filepath) return console.log('文件不存在')

  let f = null
  const listener = (eventType) => {
    if (eventType === 'change') {
      clearTimeout(f)
      f = setTimeout(() => {
        callback(readEnvFile(filepath))
      }, 100)
    } else {
      fs.unwatchFile(filepath, listener)
    }
  }
  fs.watch(filepath, listener)

  callback(readEnvFile(filepath))
}
