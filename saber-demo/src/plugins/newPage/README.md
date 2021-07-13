# 创建新页面
> 支持传递数据给新打开的页面、支持新页面操作回调、支持关闭新页面

## 使用例子
文件`src/views/pms/test.vue`，即新页面打开的组件:
```html
<template>
  <div>
    <h4>当前页面{{ isChild ? '是' : '不是' }}通过window.open打开</h4>
    <el-button @click="close">close</el-button>
    <el-button @click="update">update</el-button>
  </div>
</template>

<script>
export default {
  inject: [ 'isChild' ],
  props: {
    name: String, // 接受this.$newPage方法传过来的data中的name
    age: String // 接受this.$newPage方法传过来的data中的age（注意：此处为string类型）
  },
  methods: {
    close() {
      this.$emit('close', 1, 2, 3)
    },
    update() {
      this.$emit('update', new Date())
    }
  }
}
</script>
```

任意页面打开新页面：
```html
<template>
  <button @click="test">new page</button>
</template>

<script>
export default {
  methods: {
    test() {
      this.$newPage({
        path: 'pms/test', // 对应 src/views/pms/test.vue 文件
        data: {
          name: 'chc',
          age: 18
        },
        callback() {
          console.log(arguments)
        }
      })
    }
  }
}
</script>
```

## props
- `path` `{String}` 组件路径（相对于src/views目录）
- `data` `{Object}` 传给组件的属性（属性不支持传函数）。该数据是从url传给页面，所以尽量控制对象的数据不要太大，**并且所有的值都将会被转成字符串**
- `callback` `{Function}` 回调函数（在组件中通过`$emit`触发`close | update`事件）

## 事件
- `update` 触发回调函数，并将`$emit`中传递的参数全部传递给回调的`callback`
- `close` 包含`update`的特性，并关闭浏览器页签
- `title(customTitle)` 设置标题，即`document.title = customTitle`

## provider
- `isChild` `{Boolean}` 为`true`时则当前页面是通过`window.open`打开，此时`update`和`close`事件有效。在组件中通过`inject`引入。可参考示例

## 动态路径参数
路径格式 `/pms/spu/-/0/chc?id=123`，路径分成三部分（注意`/-/`）：
1. `/pms/spu` 此部分对应路由
2. `0/chc` 此部分为参数，以`/`对字符串拆分得到数组 `['0', 'chc']`，最终在组件的props的`routeParams`可得到（作用就是url地址美观些）
3. `?id=123` 正常的url参数
> 注意：url中不能存在多个`/-/`

示例：
> 需要在新页面打开的组件 `views/pms/~test.vue`
```html
<script>
export default {
  props: {
    routeParams: Array, // 参数的顺序与路径中的顺序一致，值为`['hello', 'world']`
    name: String // 对应`data`中的`name`
  }
}
</script>
```

> 打开新页面
```js
export default {
  method: {
    open() {
      this.$newPage({
        path: '/pms/test/-/hello/world',
        data: {
          name: 'Tom'
        }
      })
    }
  }
}
```

## 涉及的文件
- `router/page/index.js` 创建路由
- `page/newPage/index.vue` 路由对应的组件
