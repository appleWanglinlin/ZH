# 根据传入的参数判断是否有权限

## JS中使用
```js
export default {
  created() {
    const auth = this.$auth('a', 'b', 'c') // 接受任意长度的参数
  }
}
```

## 模板中配合v-if使用
```html
<template>
  <div>
    <button v-if="$auth('add')">Add</button>
  </div>
</template>
```