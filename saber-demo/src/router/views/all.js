// 该文件通过GenerateFilesWebpackPlugin插件自动生成。📌请勿手动修改
import Index from '@/page/index/index.vue'
import Layout from '@/page/index/layout.vue'
import * as subsysRoutes from '../subsys/index.js'

export default [
  {
    path: '',
    component: Index,
    children: [
      {
        path: '',
        name: 'MainLayout',
        component: Layout,
        children: subsysRoutes.routes
      }
    ]
  },
  ...subsysRoutes.pageRoutes
]
