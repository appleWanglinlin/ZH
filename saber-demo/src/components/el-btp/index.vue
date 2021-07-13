/* eslint-disable vue/attributes-order */
// 在线文档：https://www.showdoc.com.cn/p/63821741e489fb6309e80ba2cea10cc3
<template>
  <div :key="$attrs.key" class="el-btp">
    <template v-for="(btn,index) in buttons">
      <el-button :key="index" v-bind="btn" class="btnClass" @click="btn.click">{{ btn.text }}</el-button>
    </template>
    <el-table ref="tableRef" :size="size" :data="data" :max-height="maxHeight" v-bind="$attrs" v-on="$listeners" @sort-change="sortchange">
      <template v-for="(column, index) of columns">
        <!-- render -->
        <el-table-column
          v-if="!column.hidden && (column.renderH || column.renderC)"
          :key="index"
          v-bind="Object.assign({}, defaultcolumnconfig, column)"
        >
          <!-- render table header-->
          <template slot="header" slot-scope="scope">
            <Render :render="column.renderH || defaultRenderH" :params="scope" />
          </template>
          <!-- render table column-->
          <template slot-scope="scope">
            <Render :render="column.renderC || defaultRenderC" :params="scope" />
          </template>
          <!-- <template v-if="column.renderH" slot="header" slot-scope="scope">
            <Render :render="column.renderH" :params="scope" />
          </template>
          <template v-if="column.renderC" slot-scope="scope">
            <Render :render="column.renderC" :params="scope" />
          </template> -->
        </el-table-column>
        <!-- no render -->
        <el-table-column
          v-else-if="!column.hidden && (!column.renderH && !column.renderC)"
          :key="index"
          v-bind="Object.assign({}, defaultcolumnconfig, column)"
        />
      </template>
      <slot name="handler" />
    </el-table>
    <el-pagination
      v-if="haspage"
      v-bind="pageDivision.attrs"
      :page-size.sync="page['page-size']"
      :current-page.sync="page['current-page']"
      :layout="page.layout ? page.layout : 'total, sizes, prev, pager, next, jumper'"
      :page-sizes="page['page-sizes'] ? page['page-sizes'] : [10, 20, 50, 100]"
      class="pageClass"
      v-on="pageDivision.events"
    />
  </div>
</template>
<script>
import Render from './render.js'
export default {
  name: 'ElBtp',
  components: { Render },
  props: {
    buttons: Array,
    data: Array,
    columns: Array,
    defaultcolumnconfig: Object,
    haspage: {
      type: Boolean,
      default: false
    },
    maxHeight: [String, Number],
    page: Object,
    size: {
      type: String,
      default: 'size'
    }
  },
  computed: {
    pageDivision() {
      const {
        'current-change': currentChange,
        'size-change': sizeChange,
        // 'prev-click': prevClick,
        // 'next-click': nextClick,
        ...attrs
      } = this.page
      return {
        attrs,
        events: {
          'current-change': currentChange,
          'size-change': sizeChange
          // 'prev-click': prevClick,
          // 'next-click': nextClick
        }
      }
    }
  },
  methods: {
    defaultRenderH: (h, scope) => <span>{scope.column.label}</span>,
    defaultRenderC: (h, scope) => <span>{scope.row[scope.column.property] || scope.$index + 1}</span>,
    sortchange({ column, prop, order }) { // 表头箭头排序
      this.$emit('changeSort', column, prop, order)
    }
  }
}
</script>
<style scoped lang="scss">
.el-btp .btnClass {
  margin: 0 10px 10px 0;
}
.el-btp .pageClass {
  text-align: right;
  margin-top: 10px;
}

/* 以下样式为修正表格多选框不对齐的样式 */
.el-btp ::v-deep {
  .el-table {
    thead th {
      background-color: #f7f7f7;
    }
    th.el-table-column--selection .el-checkbox:last-of-type {
      margin-right: 0;
    }
    .el-table__row td:first-child {
      padding: 0;
      cursor: default;
    }
    .el-table__row
      > .el-table-column--selection
      > .cell
      .el-checkbox:last-of-type {
      margin-right: 0;
    }
    .el-table__row td.el-table-column--selection .cell {
      padding-left: 14px;
    }
  }
}
.el-table .cell {
  text-align: center;
  white-space: pre-line; /*保留换行符*/
}
</style>
