<template>
  <el-dropdown @command="onSelect">
    <el-button icon="el-icon-skin" size="mini" class="border-0" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in list" :key="item.key" :command="item.key">
        <div class="d-flex align-items-center">
          <span class="rounded" style="height:18px;width:18px;" :style="{backgroundColor:item.vars.sideBg}" />
          <span class="ms-2">{{ item.name }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import themes from '@/config/theme'
import { setTheme } from '@/util/theme'

export default {
  data() {
    return {
      list: themes
    }
  },
  methods: {
    onSelect(key) {
      setTheme(key)
    }
  }
}
</script>
