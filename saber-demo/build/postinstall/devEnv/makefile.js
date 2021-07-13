// 生成文件

const fs = require('fs-extra')
const path = require('path')

async function getTplInfo(filepath) {
  const content = await fs.readFile(filepath, 'utf8')
  // 只支持 x.y 格式的版本
  const matched = content.match(/### ver (\d+\.\d+) ###/)
  return [matched ? Number(matched[1]) : 0, content]
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') return

  const rootDir = path.join(__dirname, '../../../')
  const configFile = path.join(rootDir, 'dev.config.js')
  const envFile = path.join(rootDir, '.env.local')
  const envDevFile = path.join(rootDir, '.env.development.local')
  const envTplFile = path.join(__dirname, '.env.local.tpl')

  if (!await fs.pathExists(configFile)) {
    await fs.copyFile(path.join(__dirname, 'dev.config.js.tpl'), configFile)
  }

  if (await fs.pathExists(envFile)) {
    await fs.move(envFile, envDevFile)
  } else if (!await fs.pathExists(envDevFile)) {
    await fs.copyFile(envTplFile, envDevFile)
  } else {
    const [existVer, existContent] = await getTplInfo(envDevFile)
    const [latestVer, latestContent] = await getTplInfo(envTplFile)

    if (latestVer > existVer) {
      const arr = existContent.split(/[\r\n]+/).map(line => {
        return line && '# ' + line
      })
      await fs.writeFile(envDevFile, [latestContent].concat(arr).join('\r\n'), 'utf8')
    }
  }
}

bootstrap()
