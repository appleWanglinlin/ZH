# 适用于弹窗里面 加载另一个组件 的场景

## 初始化配置
在`src/App.vue`文件中引入：
```html
<template>
  <div id="app">
    <router-view />
    <my-modal />
  </div>
</template>

<script>
import MyModal from './plugins/modal/index'
export default {
  components: { MyModal },
}
</script>
```

## 在页面中使用
> 假设 在 `page.vue` 文件中需要弹窗显示 `foo.vue` 组件

`page.vue`:
```js
import FooComponent from './foo.vue'
export default {
  methods: {
    open() {
      this.$modal({
        title: 'this is title',
        component: FooComponent,
        data: { name: 'satrong' },
        callback(title, arr) {
          console.log(title) // hello
          console.log(arr) // [1, 2]
        }
      })
    }
  }
}
```

`foo.vue`:
```js
export default {
  props: {
    name: Object
  },
  methods: {
    close() {
      // 关闭弹窗
      this.$parent.$emit('close', 'hello', [1, 2])
    },
    showLoading() {
      this.$parent.$emit('loading', true) // 显示loading （第二个参数默认为true）
      // this.$parent.$emit('loading', false) // 关闭loading
    }
  },
  created() {
    alert(this.name)
  }
}
```

## 调用方法
```js
this.$modal(options)
```

## options参数说明
`options {Object}`:
- 继承ElementUI [dialog所有属性](https://element.eleme.cn/#/zh-CN/component/dialog#attributes)
- `title` `{string | htmlString}` 显示的标题（支持HTML）
- `component` 必须。需要显示在弹窗中的组件或字符串
- `data` 需要传递给component的props
- `padding` 弹窗的body的内边距，默认 `10px`
- `minHeight` 弹窗的body的最小高度，默认 `auto`
- `height` 弹窗的body的高度
- `callback` 窗口关闭时调用该函数，参数为 $emit 传入的参数。如： `$emit('close', 'a', 'b')` 则 callback 会传入 `'a'` 和 `'b'` 两个参数
