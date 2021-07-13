// 获取树型数据父级
export const getChidlren = (data, id) => {
  // eslint-disable-next-line one-var
  let hasFound = false, // 表示是否有找到id值
    result = null
  const fn = function(data) {
    if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
      data.forEach(item => {
        if (item.id === id) { // 数据循环每个子项，并且判断子项下边是否有id值
          result = item // 返回的结果等于每一项
          hasFound = true // 并且找到id值
        } else if (item.children) {
          fn(item.children) // 递归调用下边的子项
        }
      })
    }
  }
  fn(data) // 调用一下
  return result
}
// 树结构->扁平数据
export const treeReverse = (data) => {
  var res = []
  // 递归函数
  const fn = (data) => {
    data.forEach(el => {
      res.push(el)
      if (el.children && el.children.length > 0) {
        fn(el.children)
      }
    })
  }
  fn(data)
  return res
}
// 扁平数据->树结构
export const treeData = (source, id, parentId, children) => {
  const cloneData = JSON.parse(JSON.stringify(source))
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father[id] === child[parentId])
    if (branchArr.length > 0) father[children] = branchArr
    return father[parentId] - 0 === 0 || father[parentId] - 2 === 0 // 如果第一层不是parentId=0，请自行修改
  })
}
// 调用时，字段名以字符串的形式传参，如treeData(source, 'id', 'parentId', 'children')

// 对象数组去重
export const arrRemoveSame = (arr, id) => {
  arr = arr.filter((x, index) => {
    const ids = arr.map(item => item[id])
    return ids.indexOf(x[id]) === index
  })
  return arr
}
