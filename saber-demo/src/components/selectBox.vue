<template>
  <el-form :label-width="msg[1]" :rules="rules" :model="form" size="mini">
    <el-row :gutter="10">
      <el-col :span="[!msg[0]?6:24]" :class="[!msg[0]?'':'inputBox']">
        <el-form-item label="物流商" prop="diId">
          <el-select
            ref="input"
            v-model="form.diId"
            :class="[!msg[0]?'toInput':'input']"
            clearable
            placeholder="请选择物流商"
            filterable
            @input="change($event)"
          >
            <el-option
              v-for="item in logisticsList"
              :key="item.id"
              :label="item.lpAbbreviation"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!msg[0]" :span="6">
        <el-form-item label="发货方式" prop="dgId">
          <el-select
            ref="input2"
            v-model="form.dgId"
            class="toInput"
            placeholder="请选择"
            clearable
            filterable
            @input="change2($event)"
          >
            <el-option
              v-for="item in deliveryList"
              :key="item.id"
              :label="item.deliveryGroupName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-else :span="24" class="inputBox">
        <el-form-item label="发货方式" prop="dgId">
          <el-select
            ref="input2"
            v-model="form.dgId"
            class="input"
            placeholder="请选择"
            clearable
            multiple
            collapse-tags
            filterable
            @change="allChoose"
            @input="change2($event)"
          >
            <el-option
              v-for="item in deliveryList"
              :key="item.id"
              :label="item.deliveryGroupName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!msg[0]" :span="6">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchDebounce()"
          >搜索</el-button>
          <el-button
            icon="el-icon-delete"
            @click="reset()"
          >重置</el-button>
        </el-form-item>
      </el-col>
      <el-col v-if="msg[0]" :span="24" :class="[!msg[0]?'':'inputBox']">
        <el-form-item label="服务地址" prop="serviceAddress">
          <el-input
            v-model="form.serviceAddress"
            class="input"
            placeholder="请输入服务地址"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { debounce } from '@/util/util'
import { mapState } from 'vuex'
export default {
  name: 'SelectBox',
  props: {
    msg: Array,
    form: Object,
    reset: {
      type: Function,
      default: null
    },
    search: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      deliveryList: [],
      rules: {
        diId: [
          { required: true, message: '请填写物流商', trigger: 'blur' }
        ],
        dgId: [
          { required: true, message: '请填写发货方式', trigger: 'blur' }
        ],
        serviceAddress: [
          { required: true, message: '请填写服务地址', trigger: 'blur' },
          { type: 'url', message: '请输入正确的网址', trigger: ['blur'] }
        ]
      },
      oldSearchJobType: [] // 全选转接数组
    }
  },
  watch: {
    //   二级联动
    'form.diId'(newVal, oldVal) {
      this.form.dgId = ''
      if (newVal === '') {
        this.deliveryList = []
        return
      }
      if (newVal !== oldVal) {
        this.deliveryList = this.getListOrData(newVal)
        if (this.deliveryList.length !== 0 && this.msg[0]) {
          // eslint-disable-next-line no-unused-vars
          let qued = true
          this.deliveryList.forEach(item => {
            if (item.id === 'all') {
              qued = false
            }
          })
          if (qued) {
            this.deliveryList.unshift({ id: 'all', deliveryGroupName: '全选' })
          }
        }
      }
    }
  },
  mounted() {
    if (!this.msg[0]) {
      this.rules = []
    }
  },
  computed: {
    ...mapState({
      logisticsList: state => state.trace.logisticsList
    })
  },
  methods: {
    searchDebounce: debounce(function() {
      this.search()
    }, 1000, true),
    //   子传给父
    change(val) {
      this.$emit('input', val)
    },
    change2(val) {
      this.$emit('input2', val)
    },
    // 获取发货方式
    getListOrData(diId, flag = false) {
      const list = this.logisticsList
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.id === diId) {
            if (flag) return item.lpAbbreviation
            return item.groups
          }
        }
      }
    },
    // 国家全选
    allChoose(val) {
      const allValues = []
      // 保留所有值
      for (const item of this.deliveryList) {
        allValues.push(item.id)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : []
      // 若是全部选择
      if (val.includes('all')) this.form.dgId = allValues
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) this.form.dgId = []
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1) // 排除全选选项
        this.form.dgId = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) this.form.dgId = ['all'].concat(val)
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldSearchJobType[0] = this.form.dgId
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form-item,el-form-item--mini{
    margin-bottom: 0;
    width: 100%;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item{
    margin-bottom: 0;
}
.input{
    width: 80%;
}
.toInput{
    width: 100%;
}
.inputBox {
    &:first-child{
        margin-top: 20px;
    }
        margin-bottom: 15px;
        .label {
          display: inline-block;
          width: 110px;
          font-size: 14px;
          text-align: right;
        }
      }
</style>
