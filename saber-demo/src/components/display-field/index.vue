<template>
  <el-tooltip :content="setLabelName(label,labelEn)"
              :disabled="tooltipDisabled"
              placement="top-start"
              :open-delay="300"
  >
    <el-form-item v-if="type!==5"
                  ref="formItem"
                  :label="setLabelName(label,labelEn)"
                  :prop="uniqueValue"
                  :rules="rules"
                  class="display-field"
    >
      <div class="d-flex">
        <template v-if="validate(1,2)">
          <g-select v-if="avaValues.length>50"
                    v-model="fieldValue"
                    :items="avaValues"
                    :multiple="type===2"
                    v-bind="attrs"
                    key-field="code"
                    class="flex-grow-1"
                    :label-field="getLabelName"
          />
          <el-select v-else v-model="fieldValue" :multiple="type===2" v-bind="attrs" class="flex-grow-1" clearable>
            <el-option v-for="el in avaValues" :key="el.code+'-'+el.value" :label="getLabelName(el)" :value="el.code" />
          </el-select>
        </template>
        <template v-else-if="validate(3,4)">
          <el-input v-model="fieldValue" :type="type===4?'textarea':'text'" v-bind="attrs" resize="none" />
        </template>
        <template v-else-if="validate(6)">
          <div>
            <el-radio-group v-model="fieldValue">
              <el-radio v-for="el in avaValues" :key="el.code+'-'+el.value" :label="el.code">{{ getLabelName(el) }}</el-radio>
            </el-radio-group>
          </div>
        </template>
        <template v-else-if="validate(7)">
          <div>
            <el-checkbox-group v-model="fieldValue">
              <el-checkbox v-for="el in avaValues" :key="el.code+'-'+el.value" :label="el.code">{{ getLabelName(el) }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
        <slot />
      </div>
    </el-form-item>
  </el-tooltip>
</template>

<script>
/**
 * 支持的显示类型：
 * 单选列表 1 select
 * 多选列表 2 select:multiple
 * 输入框 3 input:text
 * 文本框 4 textarea
 * 复杂值 5
 * 单选框 6 radio
 * 多选框 7 checkbox
 */
export default {
  props: {
    // 具有唯一性的值（用作表单验证）
    uniqueValue: String,
    // 字段显示的名称
    label: String,
    labelEn: String,
    // 已设置的值
    value: [String, Array, Number],
    /**
     * 可用值，对应cutName值(json数组)
     * [ {value: '', valueEn: '', code: '', default: true} ]
     */
    availableValue: {
      validator(value) {
        try {
          const list = JSON.parse(value)
          return list.every(item => {
            return item.value !== undefined && item.code !== undefined
          })
        } catch (err) {
          console.error('传入的availableValue不是json')
          return false
        }
      }
    },
    // 显示类型
    type: {
      validator(value) {
        return [1, 2, 3, 4, 5, 6, 7].indexOf(value) > -1
      }
    },
    placeholder: String,
    size: {
      type: String,
      default: 'mini'
    },
    // 是否是必填项
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldValue: null,
      listType: [1, 2, 6, 7],
      cacheValue: null,
      tooltipDisabled: true
    }
  },
  computed: {
    // 根据类型转换成 数组或字符串
    avaValues() {
      let list
      try {
        list = JSON.parse(this.availableValue)
      } catch (err) {
        list = this.availableValue
      }

      if (this.listType.indexOf(this.type) > -1) {
        const result = Array.isArray(list) && list.every(item => {
          return item.value !== undefined && item.code !== undefined
        })
        if (!result) {
          console.error('json数据格式错误')
          return []
        }
      } else {
        list = null
      }
      return list
    },
    attrs() {
      const placeholder = this.placeholder
        ? this.placeholder
        : (Array.isArray(this.avaValues) ? '请选择' : '请输入')
      return {
        size: this.size,
        placeholder
      }
    },
    rules() {
      return this.isRequired ? [{ required: true, message: '必填项' }] : []
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === this.cacheValue) return
      if (newVal !== oldVal) {
        this.fieldValue = this.getVal()
      }
    },
    fieldValue(val) {
      this.cacheValue = val
      this.$emit('input', val)
    }
  },
  created() {
    this.fieldValue = this.getVal()
  },
  mounted() {
    this.setTooltipDisabled()
  },
  methods: {
    getVal() {
      const multipleValueType = [2, 7] // 多选值必须为数组
      if (multipleValueType.indexOf(this.type) > -1) {
        // 如果有传入值则取传入的值，否则取默认值
        if (this.value) {
          return Array.isArray(this.value)
            ? this.value
            : this.value
              ? [this.value] : []
        } else {
          return this.avaValues.map(item => (item.default || item.ifDefault) ? item.code : undefined).filter(item => item)
        }
      }

      // 如果有传入值则取传入的值，否则取默认值
      if (this.value) {
        return Array.isArray(this.value) ? this.value.join() : this.value
      } else if (Array.isArray(this.avaValues)) {
        const defaultItem = this.avaValues.find(item => (item.default || item.ifDefault))
        return defaultItem ? defaultItem.code : ''
      }
    },
    validate(...args) {
      return args.indexOf(this.type) > -1
    },
    setLabelName(cn, en) {
      return cn + (en ? `(${en})` : '')
    },
    getLabelName(data) {
      return this.setLabelName(data.value, data.valueEn)
    },
    // 如果出现省略号则启用气泡
    setTooltipDisabled() {
      const labelEl = this.$refs.formItem.$el.firstElementChild
      this.tooltipDisabled = labelEl.scrollWidth <= labelEl.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.display-field ::v-deep {
  .el-form-item__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 0.5em;
  }
}
</style>
