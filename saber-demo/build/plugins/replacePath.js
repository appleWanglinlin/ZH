const Path = require('path')
const Fs = require('fs-extra')
const webpack = require('webpack')
const { pathTypeSync } = require('../util')
const deps = require('../../package.json').dependencies

class ReplacePath {
  rootDir = process.cwd()
  // 外部映射包的路径（通过在env文件中配置）
  replaceModuleMapping = {}
  cacheLinkDependency = []
  subsys = []

  constructor(deps) {
    this.subsys = this.getSubSys(deps)
    this.replaceModuleMapping = this.getReplacementModules()
  }

  // 从package.json中的依赖中过滤出子项目（规则：子项目名称`zh-[*]`，引用地址：`git+http://...`）
  getSubSys(arr = []) {
    return Object.entries(arr).reduce((prev, [key, value]) => {
      if (/^zh-.+/.test(key) && /^git\+http:/i.test(value)) {
        prev.push(key)
      }
      return prev
    }, [])
  }

  // 从一个地址中获取依赖的地址
  getDependencyNameFromPath(p = '') {
    const arr = p.split(Path.sep)
    try {
      for (let i = 1; i < arr.length; i++) {
        const path1 = arr.slice(0, i).join(Path.sep)
        if (!path1) continue
        const filepath = Path.join(path1, 'package.json')
        if (Fs.pathExistsSync(filepath)) {
          const pkgName = require(filepath).name
          if (/^zh-/.test(pkgName)) {
            return { name: pkgName, path: path1 }
          }
        }
      }
    } catch (err) { }
    return null
  }

  // 从环境变量中读取zh-xxx映射关系
  getReplacementModules() {
    const mapping = {}
    Object.entries(process.env).forEach(([key, val]) => {
      if (/^zh-\w+/.test(key)) {
        try {
          if (!Path.isAbsolute(val)) {
            val = Path.join(this.rootDir, val)
          }
          const filepath = Path.join(val, 'package.json')
          if (pathTypeSync(filepath) === 1 && require(filepath).name === key) {
            mapping[key] = val
          }
        } catch (err) {}
      }
    })
    return mapping
  }

  handler(resource) {
    let filepath = resource.request
    if (/\?/.test(filepath)) return

    // 过滤zh-开头 或 包含node_modules/zh- 的路径
    if (/(^zh-)|([/\\]node_modules[/\\]zh-\w+)/.test(filepath)) {
      if (Path.isAbsolute(filepath)) {
        filepath = Path.relative(Path.join(process.cwd(), 'node_modules'), filepath)
      }
      const arr = filepath.split(/[/\\]/)
      if (this.replaceModuleMapping[arr[0]]) {
        if (arr.length === 1) arr.push('src', 'route.js') // zh-xxx 模块的入口文件为 `src/route.js`
        arr.splice(0, 1, this.replaceModuleMapping[arr[0]])
        resource.request = arr.join(Path.sep)
      }
      return
    }

    // 处理 @ 开头的地址
    if (/^@\/api\/common\//i.test(resource.request)) return
    if (/^@\/(api|views)\//.test(resource.request)) {
      let subSysName = '' // 从 resource.context 中获取 resource.request 文件所属的模块名称
      // 软链引入模式 或 环境变量配置中重写子系统路径 的处理
      if (!resource.context.startsWith(this.rootDir)) {
        // 从缓存中读取
        let result = this.cacheLinkDependency.find(item => {
          if (resource.context.indexOf(item.path) === 0) return true
        })

        if (!result) {
          result = this.getDependencyNameFromPath(resource.context)
        }

        if (result) {
          subSysName = result.name
          this.cacheLinkDependency.push(result)
        }
      } else {
        // node module模式的处理
        const arr = Path.relative(this.rootDir, resource.context).split(Path.sep)
        if (arr[0].toLocaleLowerCase() === 'node_modules') {
          subSysName = arr[1]
        }
      }

      if (subSysName) {
        const index = this.subsys.indexOf(subSysName)
        if (index > -1) {
          if (this.replaceModuleMapping[subSysName]) {
            const arr = resource.request.split(/[/\\]/)
            arr.splice(0, 1, this.replaceModuleMapping[subSysName], 'src')
            resource.request = arr.join(Path.sep)
          } else {
            resource.request = resource.request.replace(/^@/, this.subsys[index] + '/src')
          }
        }
      }
    }
  }
}

/**
 * 1. 将子系统的引用地址以 @ 开头转成 相对路径(如：`@/api/test.js` -> `zh-pms/src/api/test.js` )
 * 2. 根据环境变量中的包映射 来替换引用地址的路径
 */
module.exports = () => {
  const replacePath = new ReplacePath(deps)
  return new webpack.NormalModuleReplacementPlugin(/./, resource => replacePath.handler(resource))
}
