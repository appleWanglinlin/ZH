# 展示组件 批量显示

## props
- `item` `{Array}` 批量的数据
- `typeField` `{String}` 显示的字段类型 字段名。默认`cutTypePerson`
- `uidField` `{String}` 每条数据具有唯一性的 字段名。默认`id`
- `multipleField` `{String}` 属于同一个多字段 的公用字段（用于归类分组）。默认`attributeId`
- `labelField` `{String}` 字段名的label对应的字段。默认`fieldName`
- `labelEnField` `{String}` 字段名(英文)的label对应的字段。默认`fieldNameEn`
- `labelTitleField` `{String}` 属性名的label对应的字段。默认`attrName`
- `labelTitleEnField` `{String}` 属性名(英文)的label对应的字段。默认`attrNameEn`
- `valuesField` `{String}` 可用值的 字段名（json字符串）。默认`cutName`
- `savedValueField` `{String}` 已保存的值 字段名。默认`fieldValue`
- `isRequiredField` `{String}` 是否是必填 字段名。默认`requiredNo`
- `showRemove` `{Boolean}` 是否显示删除按钮（删除字段）。默认`false`

## 事件
- `change(mapping)` 当组件里面的任意字段值发生变化时都会触发`change`事件，传入的参数`mapping`为对象，key为props中`uidField`对应的字段值。该事件主要用于配合表单验证，且组件里面的字段目前只支持必填的判断

## 使用例子
```html
<template>
  <el-form :model="form">
    <display-field-group v-model="valueList" :items="list" uid-field="fieldId" @change="fieldChange" />
  </el-form>
</template>

<script>
import DisplayFieldGroup from '@/components/display-field-group/index.vue'

export default {
  components: { DisplayFieldGroup },
  data() {
    return {
      form: {},
      list: [
        {
          "attrType": 9,
          "showType": 2,
          "configType": 2,
          "attrName": "多字段test1",
          "cutType": null,
          "attrNameEn": "Multiple Fields Test 1",
          "cutName": "[{\"value\":\"金\",\"valueEn\":\"Gold\",\"code\":\"gold\",\"default\":false},{\"value\":\"木\",\"valueEn\":\"Wood\",\"code\":\"wood\",\"default\":false}]",
          "attributeId": "1328162900653232129",
          "cutTypePerson": 6,
          "fieldName": "字段三",
          "fieldId": "1328162900892307458",
          "fieldValue": null
        },
        {
          "attrType": 9,
          "showType": 2,
          "configType": 2,
          "attrName": "多字段test1",
          "cutType": null,
          "attrNameEn": "Multiple Fields Test 1",
          "cutName": "[{\"value\":\"\",\"valueEn\":\"\",\"code\":\"\",\"default\":false}]",
          "attributeId": "1328162900653232129",
          "cutTypePerson": 3,
          "fieldName": "字段二",
          "fieldId": "1328162900888113154",
          "fieldValue": null
        }
      ],
      valueList: []
    }
  },
  methods: {
    fieldChange(mapping) {
      // 必须要给 this.form 重新赋值，否则无法监听 form 的变化
      // 通过将 mapping 合并到 this.form 来确保 this.form 与 字段值的变化联动
      this.form = Object.assign({}, this.form, mapping)
    }
  }
}
</script>
```