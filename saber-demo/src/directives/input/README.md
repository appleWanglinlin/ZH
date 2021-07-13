# 输入框 输入控制

##  使用
```html
<template>
  <div>
    <input v-model="amount" v-input.number.positive />
    <input v-model="name" v-input="handler">
    <input v-model="age" v-input="[1,100]" placeholder="输入的值在1-100之间，含1和100">
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: '',
      name: '',
      age: ''
    }
  },
  methods: {
    // 只允许输入字母
    handler(inputStr) {
      // 过滤非字母的字符
      const val = inputStr.replace(/[^a-z]+/i, '')

      // 返回最终输入的内容
      return val
    }
  }
}
</script>
```

## 可用的修饰符（可多个修饰符组合使用）
- `.number` 允许输入任意数值
- `.positive` 允许输入任意正数
- `.negative` 允许输入任意负数
- `.numeric` 允许输入任意整数
- `.!0` 不允许输入的值为0（失去焦点时如果值为则清空）

## 指令绑定值
- `{Function}` 为函数时，第一个参数为输入的内容，必须返回字符串，返回的字符串为最终输入的内容
- `{Array}` `[min, max]` 为数组时，则控制取值范围（包含min和max），失去焦点时会去检查值是否在范围内，不存在则清空
