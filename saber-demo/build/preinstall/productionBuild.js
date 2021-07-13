const fs = require('fs')
const path = require('path')

// 打包时src文件夹忽略eslint检查，减少打包时间
if (process.env.DISABLE_ESLIINT) {
  const pkgPath = path.join(process.cwd(), 'package.json')
  const pkg = require(pkgPath)
  Object.keys(pkg.devDependencies).forEach(key => {
    if (key.split(/[^a-z\d]+/).includes('eslint')) {
      delete pkg.devDependencies[key]
    }
  })
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8')
}
