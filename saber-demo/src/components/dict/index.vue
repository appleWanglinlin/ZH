<template>
  <basic-container class="d-flex">
    <div class="h-100 w-50">
      <g-table ref="table"
               :headers="headers"
               :fetch="fetch"
               @row-click="rowClick"
               @selection-change="(val,index)=>handleSelectionChange(val,0)"
      >
        <template slot="header">
          <div class="border-bottom p-1 fs-5 mb-2 fw-bold">字典列表</div>
          <Search ref="search" @add="deal('add')" @search="search" @del="rowDel('',0)" />
        </template>
        <el-table-column slot="handler" label="操作" width="120" fixed="right">
          <template slot-scope="{row:rows}">
            <el-button-group>
              <el-button type="text" @click.stop="deal('look',rows)">查看</el-button>
              <el-button type="text" @click.stop="deal('edit',rows)">编辑</el-button>
              <el-button type="text" @click.stop="rowDel(rows,0)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </g-table>
    </div>
    <div class="h-100 ms-2 w-50">
      <g-table ref="childTable"
               row-key="id"
               :fetch="childFetch"
               :headers="childHeaders"
               :page-show="false"
               @rendered="$refs.childTable.tableRef.doLayout()"
               @selection-change="(val)=>handleSelectionChange(val,1)"
      >
        <template slot="header">
          <div class="border-bottom p-1 fs-5 mb-2 fw-bold">【{{ dictValue }}】字典详情</div>
          <Search ref="childSearch" @add="deal('add','',true)" @search="rowClick" @del="rowDel('',1)" />
        </template>
        <el-table-column slot="isSealed" label="封存" width="50">
          <template slot-scope="{row:rows}">
            <span>{{ ['否','是'][rows.isSealed] }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="handler" label="操作" width="120" fixed="right">
          <template slot-scope="{row:rows}">
            <el-button-group>
              <el-button type="text" @click.stop="deal('look',rows,true)">查看</el-button>
              <el-button type="text" @click.stop="deal('edit',rows,true)">编辑</el-button>
              <el-button type="text" @click="rowDel(rows,1)">删除</el-button>
              <el-button v-if="userInfo.role_name.includes('admin')" type="text" @click="deal('add',rows,true)">新增子项</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </g-table>
    </div>
  </basic-container>
</template>

<script>
import Search from './search.vue'
import dealModal from './dealModal.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Search
  },
  props: {
    tableApi: Function,
    childTableApi: Function,
    delApi: Function,
    addApi: Function,
    detailApi: Function,
    updateApi: Function
  },
  data() {
    return {
      headers: [
        { type: 'selection' },
        { type: 'index', label: '#' },
        { prop: 'code', label: '编号' },
        { prop: 'dictValue', label: '名称' },
        { prop: 'isSealed', label: '封存', width: '50' },
        { prop: 'sort', label: '排序', width: '50' },
        { prop: 'remark', label: '备注' },
        { slot: true, slotName: 'handler' }
      ],
      childHeaders: [
        { type: 'selection' },
        { type: 'index', label: '#' },
        { slot: true, slotName: 'expand' },
        { prop: 'code', label: '编号' },
        { prop: 'dictValue', label: '名称' },
        { prop: 'dictKey', label: '键值' },
        { slot: true, slotName: 'isSealed' },
        { prop: 'sort', label: '排序', width: '50' },
        { prop: 'remark', label: '备注' },
        { slot: true, slotName: 'handler' }
      ],
      parentId: '',
      ids: [],
      childIds: [],
      row: {},
      dictValue: '暂无'
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission'])
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const params = this.$refs.search.form
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return this.tableApi({ current, size, ...params }).then(res => {
        return {
          records: res.data.records.map(item => {
            item.isSealed = ['否', '是'][item.isSealed]
            return item
          }), // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    childFetch({ current, size }, { row, params }) {
      const parentId = row?.id || this.parentId || ''
      if (row?.id) this.parentId = row.id
      return this.childTableApi({ current: 1, size: 100, parentId, ...params }).then(res => {
        return {
          records: res.data
        }
      })
    },
    rowClick(row) {
      if (row) {
        this.row = row
        this.dictValue = row.dictValue
      }
      const params = this.$refs.childSearch.form
      this.$refs.childTable.load(1, { row, params })
    },
    rowDel(row, index) {
      let ids
      const msg = '请选择要删除的数据'
      if (row) { // 单个删除
        ids = [row.id]
      } else if (index === 0) { // 左侧批量删除
        if (this.ids.length === 0) return this.$message.warning(msg)
        ids = this.ids
      } else if (index === 1) { // 右侧批量删除
        if (this.childIds.length === 0) return this.$message.warning(msg)
        ids = this.childIds
      }

      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delApi(ids.join(',')).then(() => {
            const event = [this.search, this.rowClick]
            event[index]()
            if (!index) {
              this.row = {}
              this.parentId = ''
            }
            this.$message.success('操作成功!')
          })
        }).catch(_ => {

        })
    },
    handleSelectionChange(val, index) {
      if (index) {
        this.childIds = val.map(item => item.id)
      } else {
        this.ids = val.map(item => item.id)
        this.rowClick(val[0])
      }
    },
    deal(type, row = {}, childOpen = false) {
      if (type === 'add' && this.row.id === undefined && childOpen) return this.$message.error('请先在左侧列表选择字典')

      const { addApi, detailApi, updateApi } = this
      const info = {
        look: { title: '查看', data: { id: row.id } },
        add: {
          title: '新增',
          data: {
            params: {
              code: row?.code || this.row?.code || '',
              parentId: row.id || this.row.id || '',
              $parentId: row?.dictValue || this.row?.dictValue || '',
              $isSealed: row?.isSealed || this.row?.isSealed || ''
            }
          }
        },
        edit: { title: '编辑', data: { id: row.id } }
      }
      this.$modal({
        component: dealModal,
        title: info[type].title,
        data: { type, ...info[type].data, childOpen, addApi, detailApi, updateApi },
        width: '560px',
        callback: (isRefresh, childData) => {
          if (isRefresh && childData) {
            this.rowClick()
          } else if (isRefresh) {
            this.search()
          }
        }
      })
    }
  }
}
</script>
