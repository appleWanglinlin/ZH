<template>
  <el-row type="flex" class="flex-wrap">
    <template v-if="multipleList.length>0">
      <el-col v-for="(el,index) in multipleList" :key="el[multipleField]" :span="24" class="mb-3">
        <div class="p-2">
          <span>{{ el.label }}</span>
          <el-button v-if="showRemoveBtn(el.children[0])&&!disabled" icon="el-icon-minus" size="mini" class="py-2 ms-2" @click="removeMultiple(el.children,index)" />
        </div>
        <el-row class="border rounded px-3 py-2">
          <template v-for="(item) in el.children">
            <el-col v-if="item[typeField] !== 5" :key="item[uidField]" :span="item[typeField] === 4 ? 24 : 12">
              <display-field v-model="form[item[uidField]]"
                             :label="item[labelField]"
                             :label-en="item[labelEnField]"
                             :available-value="item[valuesField]"
                             :type="item[typeField]"
                             :is-required="!!item[isRequiredField]"
                             :unique-value="item[uidField]"
              />
            </el-col>
          </template>
        </el-row>
      </el-col>
    </template>
    <template v-for="(item,index) in singleList">
      <el-col v-if="item[typeField] !== 5" :key="item[uidField]" :span="item[typeField] === 4 ? 24 : 12">
        <display-field v-model="form[item[uidField]]"
                       :label="item[labelField]"
                       :label-en="item[labelEnField]"
                       :available-value="item[valuesField]"
                       :type="item[typeField]"
                       :is-required="!!item[isRequiredField]"
                       :unique-value="item[uidField]"
        >
          <el-button v-if="showRemoveBtn(item)&&!disabled" icon="el-icon-minus" size="mini" class="ms-1" @click="removeSingle(singleList,index)" />
        </display-field>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import DisplayField from '@/components/display-field/index.vue'

export default {
  components: { DisplayField },
  inject: {
    elForm: {
      default: null
    }
  },
  props: {
    value: Array,
    items: {
      type: Array,
      default: () => ([])
    },
    // 显示的字段类型 字段名
    typeField: {
      type: String,
      default: 'cutTypePerson'
    },
    // 每条数据具有唯一性的 字段名
    uidField: {
      type: String,
      default: 'id'
    },
    // 属于同一个多字段 的公用字段
    multipleField: {
      type: String,
      default: 'attributeId'
    },
    // 字段名的label对应的字段
    labelField: {
      type: String,
      default: 'fieldName'
    },
    // 字段名(英文)的label对应的字段
    labelEnField: {
      type: String,
      default: 'fieldNameEn'
    },
    // 属性名的label对应的字段
    labelTitleField: {
      type: String,
      default: 'attrName'
    },
    // 属性名(英文)的label对应的字段
    labelTitleEnField: {
      type: String,
      default: 'attrNameEn'
    },
    // 可用值的 字段名（json字符串）
    valuesField: {
      type: String,
      default: 'cutName'
    },
    // 已保存的值 字段名
    savedValueField: {
      type: String,
      default: 'fieldValue'
    },
    // 是否是必填 字段名
    isRequiredField: {
      type: String,
      default: 'requiredNo'
    },
    // 是否显示删除按钮
    showRemove: {
      type: [Boolean, Function],
      default: false
    }
  },
  data() {
    return {
      form: {},
      list: [],
      singleList: [], // 单字段
      multipleList: [] // 多字段
    }
  },
  computed: {
    disabled() {
      return (this.elForm || {}).disabled || false
    }
  },
  watch: {
    form: {
      deep: true,
      handler(form) {
        const mapping = {}
        const values = this.list.map((item) => {
          const { attributeId, fieldId } = item
          const fieldValue = form[item[this.uidField]]
          mapping[fieldId] = fieldValue
          return {
            attributeId,
            fieldId,
            // 如果是字符串则放到数组中并转成json，如：`abc`转成`'["abc"]'`（后端要求）
            fieldValue: JSON.stringify(typeof fieldValue === 'string' ? [fieldValue] : fieldValue)
          }
        })
        this.$emit('input', values)

        // 表单校验用到，最终将mapping合并到 el-form 的 model 对应的字段
        this.$emit('change', mapping)
      }
    },
    items: {
      handler(val) {
        this.list = val || [] // 后端接口字段可能会是null，添加容错处理
        this.singleList = []
        const obj = {}
        const multipleList = []
        this.list.forEach(item => {
          let savedValue
          const d = this.value.find(el => item.fieldId === el.fieldId)
          if (d) {
            // 如果 this.value 中存在，则优先取 this.value中的值
            savedValue = typeof d.fieldValue === 'string' ? JSON.parse(d.fieldValue) : d.fieldValue
          } else {
            // 设置 已保存的值（优先显示已保存的值，其次是默认值）
            savedValue = JSON.parse(item[this.savedValueField]) || ''
          }

          if ([2, 7].includes(item.configType)) {
            obj[item[this.uidField]] = savedValue
          } else {
            obj[item[this.uidField]] = Array.isArray(savedValue) ? savedValue[0] : savedValue
          }

          // 展示类型 为 多字段
          if (item.showType === 2) {
            multipleList.push(item)
          } else {
            // 单字段 类型
            this.singleList.push(item)
          }
        })
        this.groupMultipleList(multipleList)

        this.form = obj
      },
      immediate: true
    }
  },
  methods: {
    // 将同一类多字段归为一组
    groupMultipleList(list = []) {
      const mapping = {}
      list.forEach(item => {
        const id = item[this.multipleField]
        if (!mapping[id]) {
          mapping[id] = {
            label: item[this.labelTitleField] + (item[this.labelTitleEnField] ? `(${item[this.labelTitleEnField]})` : ''),
            [this.multipleField]: id,
            children: []
          }
        }
        mapping[id].children.push(item)
      })
      this.multipleList = Object.values(mapping)
    },
    // 删除多字段
    removeMultiple(list = [], index) {
      const id = this.uidField
      const mapping = {}
      const removedList = []
      this.list = this.list.filter(item => {
        const removedData = list.find(el => el[id] === item[id])
        if (removedData) {
          mapping[removedData[id]] = null
          removedList.push(removedData)
        }
        return !removedData
      })
      this.form = Object.assign({}, this.form, mapping)
      this.multipleList.splice(index, 1)
      this.$emit('remove', removedList)
    },
    // 删除单字段
    removeSingle(list = [], index) {
      const id = this.uidField
      const removedData = list.splice(index, 1)[0]
      this.list = this.list.filter(item => item[id] !== removedData[id])
      this.form[removedData[id]] = null
      this.$emit('remove', removedData)
    },
    showRemoveBtn(data) {
      switch (typeof this.showRemove) {
        case 'boolean':
          return this.showRemove
        case 'function':
          return this.showRemove(data)
        default:
          return false
      }
    }
  }
}
</script>
