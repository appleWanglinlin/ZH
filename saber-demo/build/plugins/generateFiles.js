/**
 * 生成 src/router/subsys/index.js 和 `routesWritePath` 文件
 */

const Fs = require('fs-extra')
const Path = require('path')
const isSaas = process.argv.includes('--saas')
const pluginName = 'GenerateFilesWebpackPlugin'

module.exports = class {
  apply() {
    this.homePageFile()
    this.routeFile()
  }

  // 生成首页引用的文件
  homePageFile() {
    const content = `export { default } from './${isSaas ? 'saas' : 'service'}.config.js'\n`
    Fs.writeFileSync(Path.join(process.cwd(), 'src/views/wel/index.js'), content)
  }

  routeFile() {
    Fs.writeFileSync(Path.join(process.cwd(), 'src/router/subsys/index.js'), `export * from './${isSaas ? 'saas' : 'platform'}'\n`)
    const fileContent = this.routeTemplate()

    Fs.writeFileSync(Path.join(process.cwd(), 'src/router/views/all.js'), fileContent, 'utf8')
  }

  routeTemplate() {
    return `// 该文件通过${pluginName}插件自动生成。📌请勿手动修改
import Index from '@/page/index/index.vue'
import Layout from '@/page/index/layout.vue'
import * as subsysRoutes from '../subsys/index.js'

export default [
  {
    path: '',
    component: Index,
    children: [
      {
        path: '',
        name: 'MainLayout',
        component: Layout,
        children: subsysRoutes.routes
      }
    ]
  },
  ...subsysRoutes.pageRoutes
]
`
  }
}
