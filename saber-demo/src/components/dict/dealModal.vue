<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" size="small" inline label-width="80px">
      <template v-if="childOpen">
        <el-form-item label="上级字典" prop="$parentId">
          <el-select v-model="form.$parentId" :disabled="disabled" style="width:178px;">
            <el-option v-for="(item,index) in treeList" :key="index" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictKey">
          <el-input v-model="form.dictKey" />
        </el-form-item>
      </template>
      <el-form-item label="字典编号" prop="code">
        <el-input v-model="form.code" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictValue">
        <el-input v-model="form.dictValue" />
      </el-form-item>
      <el-form-item label="字典排序" prop="sort">
        <el-input v-model="form.sort" v-input.number.positive />
      </el-form-item>
      <el-form-item label="封存" prop="isSealed">
        <el-switch v-model="form.isSealed" />
      </el-form-item>
      <el-form-item label="字典备注" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
    </el-form>
    <el-row v-if="['edit','add'].includes(type)" type="flex" justify="end">
      <el-button type="primary" size="small" @click="submit">保存</el-button>
      <el-button size="small" @click="close(false)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    childOpen: {
      type: Boolean,
      default: false
    },
    parentId: String,
    params: Object,
    addApi: Function,
    detailApi: Function,
    updateApi: Function
  },
  data() {
    return {
      form: {
        isSealed: false
      },
      rules: {
        code: [{ required: true, message: '字典编码不能为空' }],
        dictValue: [{ required: true, message: '字典名称不能为空' }],
        sort: [{ required: true, message: '字典排序不能为空' }],
        isSealed: [{ required: true, message: '封存不能为空' }],
        dictKey: [{ required: true, message: '字典键值不能为空' }]
      },
      treeList: []
    }
  },
  computed: {
    disabled() {
      return this.type && this.childOpen
    }
  },
  mounted() {
    this.id && this.getData()
    if (this.type === 'add' && this.childOpen) {
      Object.entries(this.params).forEach(([key, val]) => {
        this.$set(this.form, key, val)
      })
      // getDictTree(this.params.code).then(res => {
      //   this.treeList = res.data
      // })
    }
  },
  methods: {
    getData() {
      this.detailApi(this.id).then(res => {
        this.form = res.data
        this.form.isSealed = !!res.data.isSealed
        this.type === 'look' && (this.form.$parentId = res.data.parentName)
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const request = {
            add: this.addApi,
            edit: this.updateApi
          }
          const params = Object.assign({}, this.form)
          params.isSealed = params.isSealed ? 1 : 0
          request[this.type](params).then(res => {
            res.success && this.$message.success(res.msg)
            this.close(true)
          })
        } else {
          return false
        }
      })
    },
    close(isRefresh = false) {
      this.$parent.$emit('close', isRefresh, this.childOpen)
    }
  }
}
</script>
