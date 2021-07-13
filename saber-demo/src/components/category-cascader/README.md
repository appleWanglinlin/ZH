# 类目 级联封装

## 使用方法
示例一（类目级联，单选，支持回显）：
```html
<template>
  <category-cascader v-model="values" :multiple="false" />
</template>

<script>
import CategoryCascader from '@/component/category-cascader'

export default {
  components: { CategoryCascader },
  data(){
    return {
      values: ['100', '1001', '10010'] // 如果需要回显需要传入全路径id
    }
  }
}
</script>
```

示例二：
```html
<template>
  <category-cascader v-model="values" :fetch="fetch" />
</template>

<script>
import CategoryCascader from '@/component/category-cascader'

export default {
  components: { CategoryCascader },
  data(){
    return {
      values: []
    }
  },
  methods: {
    fetch(resolve) {
      axios('...').then(res => {
        resolve(res.data)
      })
    }
  }
}
</script>
```

示例三（类目级联 多选，不支持回显）：
```html
<template>
  <category-cascader v-model="values" lazy-multiple />
</template>

<script>
import CategoryCascader from '@/component/category-cascader'

export default {
  components: { CategoryCascader },
  data(){
    return {
      values: []
    }
  }
}
</script>
```

## `props`
- `value` 默认已选择的项目。（多选为数组多个值，单选为单个值）
- `width` 宽度设置，必须含有单位或百分比
- `size` 尺寸。默认`mini`，可选值 `medium`, `small`, `mini`
- `multiple` 是否是多选，`true`为多选，`false`单选。默认为`true`
- `lazyMultiple` 是否是类目的懒加载模式。默认`false`
- `filterable` 是否启用搜索，默认为`false`
- `props` el-cascader配置，默认为{ value: 'id', label: 'name'},配置选项参考element-ui
- `fetch` `function(resolve)` 获取数据并通过`resolve`方法返回给CategoryCascader组件
> 继承`el-cascader`的属性，[参考ElementUI](https://element.eleme.cn/#/zh-CN/component/cascader#cascader-attributes)
> 注意：上面列出的属性和`props`不能继承

## `multiple`、`lazyMultiple` 、`fetch` 优先级关系
1. `fetch` 优先级最高，会覆盖`lazyMultiple`为`false`，不影响`multiple`的值
2. `lazyMultiple` 会覆盖`multiple`为`false`，使用`lazyMultiple`模式自定义的勾选方式

## 使用场景
- 搜索条件的类目多选：只需设置`lazyMultiple`为`true`即可
- 类目单选（支持回显）：只需设置`:lazyMultiple="false" :multiple="false"`
- (物流优选-物流费规则用到)外部传入`fetch`：目前支持将数据全部加载通过fetch的resolve传递给category-cascader组件。懒加载未测试。