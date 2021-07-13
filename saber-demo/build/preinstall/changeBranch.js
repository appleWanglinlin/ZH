// 根据环境变量`USE_BRANCH`来修改zh-xxx项目引用的分支
const fs = require('fs')
const URL = require('url').URL
const pkgFilepath = process.cwd() + '/package.json'
const pkg = require(pkgFilepath)

const branchName = process.env.USE_BRANCH

// 借用DISABLE_ESLIINT环境变量传值
const specifyTag = (process.env.DISABLE_ESLIINT || '').split(',')
  .map(item => item.trim())
  .reduce((prev, item) => {
    const [key, val] = item.split('=')
    prev[key] = val
    return prev
  }, {})

const mapping = {}

for (const key in pkg.dependencies) {
  const value = pkg.dependencies[key]
  if (/^git\+http:\/\//i.test(value)) {
    let tag = ''
    if (specifyTag[key]) {
      tag = specifyTag[key]
    } else if (branchName) {
      tag = branchName
    }

    if (tag) {
      pkg.dependencies[key] = value.replace(/(?<=#).+$/, tag)
    }

    const u = new URL(pkg.dependencies[key])
    mapping[key] = u.hash
  }
}

console.log(JSON.stringify(mapping, '', 2))

fs.writeFileSync(pkgFilepath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
