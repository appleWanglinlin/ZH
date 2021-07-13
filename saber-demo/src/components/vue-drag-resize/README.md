## 关于使用`vue-drag-resize`拖拽缩放组件

#### props
- `title {String}`：标题提示，默认`提示`
- `w {Number}`：组件宽度，默认`200`
- `h {Number}`：组件高度，默认`200`
- `z {Number}`：组件层级，默认`2000`
- `visible {Boolean}`：是否显示，注意`uploading`需要用`.sync`修饰符，默认`false`
- `appendToBody {Boolean}`：是否将弹层放置于body内，默认`true`
- `isActive {Boolean}`： 是否激活状态，默认`false`
- `isResizable {Boolean}`： 是否允许缩放，默认`true`
- `isDraggable  {Boolean}`： 是否允许拖拽 ，默认`true`

```html
<template>
  <vue-drag-resize :visible.sync="visible" :w="500" :h="300" title="'产品属性'" />
</template>

<script>
import VueDragResize from '@/components/vue-drag-resize'
export default {
  components: { VueDragResize },
  data() {
    return {
      visible: false
    }
  }
}
</script>
```
[更多参数](https://www.npmjs.com/package/vue-drag-resize)