import { defineConfig } from '@/components/home-module/index'

export default defineConfig([
  {
    title: '订单分析',
    link: '/oms/analysis/order',
    buttons: [
      { label: '昨天', value: 1, default: true },
      { label: '7天', value: 2 },
      { label: '30天', value: 3 }
    ],
    component: () => import('zh-oms/src/views/analysis/order/pubChart.vue'),
    immediate: true,
    handler(componentRef, buttonValue) {
      return componentRef.getChartData({}, { payDtType: buttonValue })
    },
    width: '100%'
  }
])
