# 新建标签页面，并传入需要展示的组件
> 通过动态创建路由实现

## 使用
```js
this.$newTab(options);
```

Demo:
```js
import MyComponent from './foo.vue'
this.$newTab({
  path: '/foo',
  title: '我的标题',
  component: MyComponent,
  data: { name: 'chc' }, // 在 foo.vue组件中的 `props` 可得到`name`
  clearCache: true,
  callback: (a, b, c) => {
    // 在foo.vue组件中 执行 `this.$emit('close', 1, 2, 3)`时会触发该`callback`
    console.log(a, b, c) // 1 2 3
  }
});
```

## `options`参数
- `path {string}` 自定义路由路径。最终的路径为`/common/[path]`。默认为component组件的名称（建议设置该参数）
- `title {string}` tab标签的显示名称
- `component {VueComponent}` 传入的组件。在该组件中使用`this.$emit('close')`可关闭标签页并返回打开标签页时所在的页面
- `data {object}` 需要传递给component的数据，可在 `props`中获得
- `clearCache {boolean}` 创建标签后是否立即清除组件缓存。默认为`false`
- `callback {function}` 当新打开的标签通过`this.$emit('close')`关闭时会回调`callback`方法（$emit传入的所有参数会传递给callback）
- `menuId {string}` 传入权限的menuId。默认为 执行`this.$newTab`方法所在组件的`$route.meta.id`

## 事件
- `update` emit该事件后会调用`callback`方法且将$emit传入的参数全部带给`callback`方法
- `close` 与`update`一致，且会关闭当前的tab页签

## 涉及文件
- `src/router/page/index.js` 404路由添加 beforeEnter
- `src/router/avue-router.js` `getRouteNameOrPath` 方法判断如果是 /common/ 开头的路径则通过path跳转
