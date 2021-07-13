<template>
  <!-- eslint-disable-next-line -->
  <div class="fs-5 top-logo h-100 d-flex align-items-center justify-content-center" v-html="content" />
</template>

<script>
import { mapGetters } from 'vuex'
import { isSaas } from '@/config/env'

export default {
  name: 'Logo',
  computed: {
    ...mapGetters(['website', 'keyCollapse']),
    logo() {
      return isSaas ? '<i class="el-icon-home fs-2"></i>' : this.website.logo
    },
    content() {
      return this.keyCollapse ? this.logo : this.reduceName(this.website.title)
    }
  },
  methods: {
    reduceName(name) {
      return name ? name.replace(/有限公司$/, '') : ''
    }
  }
}
</script>
