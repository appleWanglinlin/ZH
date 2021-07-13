// 审核流程图
<template>
  <div>
    <div v-if="!loading&&list.length===0" class="text-center text-gray-400">暂无数据</div>
    <el-steps v-loading="loading" :active="currentStep" finish-status="success">
      <el-step v-for="item in list" :key="item.nodeName" :title="item.nodeName">
        <template v-slot:description>
          <div>{{ item.handlerUserName }}</div>
          <div>{{ item.updateTime }}</div>
          <div>{{ item.eventName }}</div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import { queryFlowById } from 'zh-pms/src/api/myAudit'
export default {
  name: 'FlowChart',
  props: {
    flowId: [String, Number]
  },
  data() {
    return {
      list: [],
      loading: true
    }
  },
  computed: {
    // 当前所在的步骤
    currentStep() {
      const index = this.list.findIndex(item => item.nodeType === 'now')
      return index > -1 ? index : this.list.length
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      queryFlowById(this.flowId).then(res => {
        this.list = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
