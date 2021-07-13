// 组织架构
<template>
  <div class="o10n-box">
    <div class="o10n-left" :style="{width:treeWidth}">
      <el-input v-model="orgKeyword" class="tree-search" size="mini" placeholder="输入关键词搜索部门" />
      <el-tree ref="tree"
               v-loading="loadingTree"
               :data="tree"
               :props="defaultProps"
               node-key="id"
               :default-expanded-keys="expandedIds"
               :filter-node-method="filterNode"
               @node-click="nodeClickHandler"
      />
    </div>
    <div class="o10n-right" :style="{width:tableWidth}">
      <g-table ref="table"
               :headers="headers"
               :fetch="fetch"
               :fixed-height="false"
               :page-size="9"
               page-layout="total, prev, pager, next"
               :pager-count="5"
               @row-click="selectUserHandler"
               @select="checkedHandler"
               @select-all="checkedHandler"
               @rendered="renderedSelect"
      >
        <div slot="header" class="o10n-right-sb">
          <el-form inline size="mini" class="no-message" @submit.native.prevent="getUsers(2)">
            <el-form-item>
              <el-input v-model="userKeyword" placeholder="请输入姓名或工号进行搜索" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </g-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrgListWithAuth, getOrgListWithoutAuth, getUserListWithoutAuth, getUserListWithAuth } from './api'
export default {
  props: {
    // 树结构的宽度
    treeWidth: {
      type: String,
      default: '200px'
    },
    tableWidth: {
      type: String,
      default: '360px'
    },
    multiple: Boolean,
    selected: [String, Array, Object],
    // 是否根据当前用户的权限过滤数据（根据该字段判断使用的接口）
    own: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingTree: false,
      loadingUsers: false,
      tree: [],
      expandedIds: [], // 默认展开的节点
      users: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      headers: this.getHeaders(),
      // 当前选中的组织id
      checkedOrganizationId: '',
      fullPathIds: [], // 组织架构全路径id（id顺序为由下往上）
      orgKeyword: '',
      userKeyword: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    orgKeyword(val) {
      this.$refs.tree.filter(val)
    },
    selected() {
      this.renderedSelect()
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    getHeaders() {
      const h = [
        { label: '工号', prop: 'jobNumber' },
        { label: '姓名', prop: 'name' }
      ]
      if (this.multiple) h.unshift({ type: 'selection', width: 50 })
      return h
    },
    getTree() {
      this.loadingTree = true
      ;(this.own ? getOrgListWithAuth : getOrgListWithoutAuth)({ tenantId: this.userInfo.tenant_id }).then(res => {
        this.tree = res.data
        this.getLevelIds(res.data, 1)
      }).finally(() => {
        this.loadingTree = false
      })
    },
    /**
     * @type {number} type 1根据部门id查询，2根据搜索关键词查询
     */
    getUsers(type) {
      const condition = { organizationId: this.checkedOrganizationId }
      if (type === 2) {
        const keyword = this.userKeyword.trim()
        condition.criteria = keyword
      }
      this.$refs.table.load(1, condition)
    },
    fetch(page, params) {
      if (this.loadingUsers) return
      this.loadingUsers = true
      return (this.own ? getUserListWithAuth : getUserListWithoutAuth)({ ...page, ...params })
        .then(res => res.data)
        .finally(() => {
          this.loadingUsers = false
        })
    },

    /**
     * 获取设定层级的id
     * @param {Array} data tree数据
     * @param {Number} depth 显示的层级深度
     */
    getLevelIds(data, depth = Infinity) {
      if (depth < 1) return
      depth--
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.expandedIds.push(item.id)
          this.getLevelIds(item.children || [], depth)
        })
      } else {
        this.expandedIds.push(data.id)
        Array.isArray(data.children) && this.getLevelIds(data.children, depth)
      }
    },
    // 点击 叶节点 时根据部门信息获取用户列表
    nodeClickHandler(data, node, currentComponent) {
      if (node.isLeaf) {
        this.fullPathIds = this.getFullPathIds(node)
        this.checkedOrganizationId = data.id
        this.getUsers(1)
      }
    },
    getFullPathIds(node) {
      let n = node
      const ids = []
      while (n.parent) {
        ids.push(n.data.id)
        n = n.parent
      }
      return ids
    },
    filterNode(value, data) {
      if (!value) return true
      return new RegExp(value.split('').join('.*')).test(data.title)
    },
    getItemData(d) {
      const { id, account, name, jobNumber } = d
      return { id, account, name, jobNumber, fullPathIds: this.fullPathIds }
    },
    selectUserHandler(row, column, event) {
      if (this.multiple) return
      this.$emit('checked', this.getItemData(row))
    },
    checkedHandler(selection, row) {
      if (!this.multiple) return

      if (row) {
        if (selection.includes(row)) {
          this.$emit('checked', [...this.selected, this.getItemData(row)])
        } else {
          const checked = this.selected.filter(item => {
            return item.id !== row.id
          })
          this.$emit('checked', checked)
        }
      } else {
        // 先过滤掉selected中所有当前列表的项
        const restList = this.selected.filter(item => {
          return this.$refs.table.tableList.findIndex(el => el.id === item.id) === -1
        })
        const currentChecked = selection.map(this.getItemData)
        this.$emit('checked', [...restList, ...currentChecked])
      }
    },
    renderedSelect() {
      if (this.multiple) {
        this.$refs.table.tableList.forEach(item => {
          this.$refs.table.tableRef.toggleRowSelection(item, this.selected.some(el => el.id === item.id))
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.o10n-box {
  overflow: hidden;
  display: flex;
  background: #fff;
  max-height: 390px;
  .o10n-left {
    width: 200px;
    padding: 5px 10px 5px 5px;
    border-right: 1px #eee solid;
    overflow: auto;
    .tree-search {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
  .o10n-right {
    padding: 5px 5px 5px 10px;
    flex-grow: 1;
    .o10n-right-sb {
      text-align: right;
    }
    ::v-deep .el-table--small td {
      padding: 4px 0;
    }
  }
}
</style>
