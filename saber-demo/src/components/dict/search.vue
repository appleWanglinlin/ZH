<template>
  <el-form ref="form" size="small" :inline="true" :model="form" class="no-message">
    <el-form-item label="字典编号" prop="code">
      <el-input v-model="form.code" />
    </el-form-item>
    <el-form-item label="字典名称" prop="dictValue">
      <el-input v-model="form.dictValue" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="$emit('search')">搜索</el-button>
      <el-button icon="el-icon-reset" @click="reset">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="$emit('add')">新增</el-button>
      <el-button type="danger" plain icon="el-icon-delete" @click="$emit('del')">批量删除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {
        code: '',
        dictValue: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    disabled() {
      return (this.type === 'add' || this.type === 'edit') && this.childOpen
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
      this.$emit('search')
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form.no-message .el-form-item{
    margin-bottom: 12px;
  }
</style>
