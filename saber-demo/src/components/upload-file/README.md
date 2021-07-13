# 上传文件组件
```html
<template>
  <upload-file v-model="files" :limit="10" :uploading.sync="uploading">
    <template v-slot="{info}">
      <div>文件不能超过 {{info.displaySize}}</div>
    </template>
  </upload-file>
</template>

<script>
import UploadFile from '@/components/upload-file/index.vue'

export default {
  components: { UploadFile },
  data() {
    return {
      files: [],
      uploading: false
    }
  }
}
</script>
```

## `v-model="files"`
`files`必须是数组，格式如 `[ { url: '地址', name: '文件名' } ]`，其中`url`必须含有，`name`如果不存在则从url中提取

## props属性
- `readonly {Boolean}` 是否是只读（只能查看列表，不能上传和删除）。默认`false`
- `disabled {Boolean}` 与`readonly`效果一致。默认`false`
- `mimetype {String}` 允许上传的文件类型。如: `.jpg,.xml`
- `video {Boolean}` 是否是视频，为`true`时会忽略mimetype的设置。默认`false`
- `limit {Number}` 上传文件数量限制，0不限制。默认`0`
- `size {Number}` 单个文件字节数限制，0不限制，单位: b。默认`0`
- `multiple {Boolean}` 是否支持选择多个文件。默认`false`
- `buttonSize {String}` 上传按钮的大小。默认`small`
- `buttonText {String}` 上传按钮显示的文本。默认`点击上传`
- `download {Boolean}` 是否显示下载按钮。默认`true`
- `uploading {Boolean}` 当前是否有文件正在上传中， `true`有文件正在上传中，`false`没有文件在上传中。**注意`uploading`需要用`.sync`修饰符**。提交表单时可以通过此属性判断当前是否有文件正在上传中再决定是否可以提交表单

## 默认slot作用域
- `size {Number}` 对应props中的`size`
- `displaySize {String}` 将`size`转换成含有单位的值
