## 关于代码编辑器
- 建议优先使用vscode
- 确保已安装`eslint`插件

## 关于路由问题
- 所有的路由名全部由路径转换而来(大驼峰)，如：路径为`/user/my-home`会转换成`UserMyHome`
- 路由与文件名的约定规则： 路由为`/pms/test/myList`则对应的视图文件为`views/pms/test/_myList.vue`（文件以`_`开头`.vue`结尾）
- 使用`this.$newPage`方法的路由与文件名的约定规则：传入的参数为`{path: '/pms/test/myPage'}`则对应的视图文件为`views/pms/test/~myPage.vue`（文件以`~`开头`.vue`结尾）。（2021-03-24补充：$newPage优先找`~`开头的文件，再找`_`开头的文件，都没找到走404）

## 关于弹窗显示
如果需要用到`el-dialog`，请优先参考 [文档](src/plugins/modal/README.md)

## 新建tab标签
目前项目使用的是动态创建路由，在开发的过程中基本上不需要再额外的创建路由。
但也存在一些特殊情况，比如新增、修改、详情需要在新tab标签打开，这些页面并没有相应的路由，所以我们需要创建相应的路由。
为了避免大家创建大量的路由，添加了 `this.$newTab`方法，具体参考 [文档](src/plugins/newTab/README.md)

## env配置文件字段说明
- `VUE_APP_API_URL` 配置代理的api地址
- `VUE_APP_DEV_PORT` 访问开发环境的端口
- `VUE_APP_LIBS` 该字段用于容错处理
- `zh-xxx` 配置包的映射路径（绝对路径 或 相对于本项目的路径），如`zh-pms=D:\\ZH1478\\j1478\\Code\\zh-pms`意思是将引用的依赖`zh-pms`映射到配置的路径中（用于替代`npm link`）

## 本地模拟生产环境
> 注意：下面的操作需要确保在项目的根目录下执行
1. 先打包。服务中心执行 `npm run build` ，租户中心执行 `npm run build-saas`
2. 打包完成后执行 `npm run preview`