import Vue from 'vue'
import { defineConfig } from '@/components/home-module/index'

export default defineConfig([
  {
    title: '欢迎',
    component: Vue.extend({
      render(h) {
        return h('h2', this.$store.getters.website.title + ' 欢迎您！')
      }
    }),
    immediate: false
  }
])
