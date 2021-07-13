# 业务字典、系统字典 公用组件

## 使用demo
```html
<template>
  <Dict :table-api="getParentList"
           :child-table-api="getChildList"
           :del-api="remove"
           :add-api="add"
           :update-api="update"
           :detail-api="getDict"
  />
</template>

<script>
import {
  getParentList,
  getChildList,
  remove,
  update,
  add,
  getDict
} from '@/api/dict'

export default {
  components: {
    Dict: () => import('@components/dict/index.vue') // 懒加载
  },
  data() {
    return {
      getParentList: getParentList,
      getChildList: getChildList,
      update: update,
      add: add,
      remove: remove,
      getDict: getDict
    }
  }
}
</script>

```
## 属性
- `tableApi` `{Function}` 父表格接口
- `childTableApi` `{Function}` 子表格接口
- `delApi` `{Function}` 删除接口
- `addApi` `{Function}` 新增格接口
- `updateApi` `{Function}` 更新接口
- `detailApi` `{Function}` 详情接口
