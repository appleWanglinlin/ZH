## 关于使用`UploadImg`上传图片组件
#### files {Array}属性和updateFiles事件是必须的,files数组可以拿到上传后的图片名字和返回的url

#### props
- `limit {Number}`：限制最大可上传图片数量，默认不限制
- `uploadUrl {String}`：上传地址，默认值：`/ops-resource/oss/endpoint/put-file`
- `acceptImgType {String}`：上传图片允许类型，默认：`'.jpg,.jpeg,.png,.bmp'`
- `$key(String/Number)`： 通过updateFiles方法的第二个参数可以获取传入的$key值
- `hasTitle {Boolean}`： 是否显示图片头信息提示
- `isPlus {Boolean}`： 是否可以上传图片，默认`true`
- `showCheckIcon {Boolean}`： 是否显示对号图标 ，默认`true`
- `isAutoCheck {Boolean}`： 是否需要自动选择主图（打√），默认`true`
- `isRequiredImg {Boolean}`： 图片是否必填，默认`true`
- `ifCanDelete {Boolean}`： 是否显示删除图标，默认`true`
- `maxSize {Number}`：限制上传文件的最大字节数。默认为`0`，（0为不限制）
- `readonly {Boolean}`：增加只读属性。默认`false`
- `maxWidth {Number}`: 图片最大宽度大小（需大于0）
- `maxHeight {Number}`: 图片最大高度大小（需大于0）
- `uploading {Boolean}` 当前是否有文件正在上传中， `true`有文件正在上传中，`false`没有文件在上传中。注意`uploading`需要用`.sync`修饰符。提交表单时可以通过此属性判断当前是否有文件正在上传中再决定是否可以提交表单

#### 方法
- `validate()` 根据`isRequiredImg`和`files.length`判断是否满足上传条件。返回布尔值。`true`验证通过，`false`验证不通过
- `reset()` 重置上传列表和错误信息

```html
<template>
  <UploadImg :files="files" :$key="index" @updateFiles="updateFiles" :limit="5" :uploading.sync="uploading" />
</template>

<script>
import UploadImg from '@/components/uploadImg'
export default {
  components: { UploadImg },
  data() {
    return {
      files: [],
      $key: 2,
      uploading: false
    }
  },
   methods: {
    updateFiles(val, index) {
      if (Array.isArray(val)) {
        this.files = val
      } else this.files.splice(val, 1)
    }
  }
}
</script>
```