# 在组织架构中搜索人员

# 组件说明
- `panel.vue` 组织架构面板（左边tree + 右边table）
- `index.vue` 组织架构面板 + dropdown组件

# `panel.vue`组件
### `props`
- `treeWidth` `{string}` 左边tree的宽度，默认`200px`
- `tableWidth` `{string}` 右边table的宽度，默认`300px`
- `own` `{boolean}` 是否根据当前用户的权限过滤数据（根据该字段判断使用的接口）。默认`false`

### 事件
- `checked` 触发事件传递的参数 `{ id, account, name, jobNumber }`

# `index.vue`组件
### `props`
- 包含`panel.vue`组件的所有props
- `hideOnSelected` `{Boolean}` 是否选中用户后自动隐藏。默认`true`
- `trigger` `{click | hover}` 触发下拉的行为，只支持 click、hover。默认`click`
- `placement` `{top | top-start | top-end | bottom |bottom-start | bottom-end}` 弹出位置。默认`bottom`
- 以下三个属性只在默认slot中生效
  - `inputSize` `{String}` 输入框的尺寸。默认`mini`
  - `inputWidth` `{String}` 输入框的宽度
  - `inputPlaceholder` `{String}` 输入框的placeholder。默认`请选择开发人`
- `multiple` `{Boolean}` 是否是多选，多选则选中用户不会自动关闭弹层
- `own` `{boolean}` 是否根据当前用户的权限过滤数据（根据该字段判断使用的接口）。默认`false`

### 插槽
支持默认插槽

### 回显（只有多选支持回显）
- `v-model` `{Array}` 多选必须为数组，格式为 `[ {id: '123'}, {id: '124'} ]`

## `v-model` 返回的值 `{object}`
- `id` 用户的id
- `account` 用户的账号
- `name` 用户的名称
- `jobNumber` 工号
- `fullPathIds` 部门的全路径id（`[部门id， 上级部门id， 上上级部门id, ...]`）

### 使用示例
```html
<template>
  <organization-panel v-model="test">
    <el-input />
  </organization-panel>

  <organization-panel v-model="list" multiple>
    <el-button>选择人员</el-button>
  </organization-panel>
</template>

<script>
import OrganizationPanel from '@/components/organization/index.vue'

export default {
  components: { OrganizationPanel },
  data() {
    return {
      test: {},
      list: [
        {id: '123'},
        {id: '124'},
      ]
    }
  }
}
</script>
```