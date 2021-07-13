/**
 * 到iconfont打开saber字体项目，打开控制台执行下面的js，即可获取到所有图标

const icons = []
document.querySelectorAll('ul.block-icon-list > li').forEach(el => {
  const codeName = el.querySelector('span.icon-code-show').textContent
  icons.push(codeName.replace(/^\w+-\w+-/, ''))
})
console.log(JSON.stringify(icons) + '.map(el=> "el-icon-"+el)')

 */

export default [
  {
    label: '默认图标',
    type: 'common',
    list: ['ams', 'crm', 'ers', 'fas', 'fps', 'ims', 'ips', 'lms', 'ltms', 'oms', 'opms', 'otms', 'pms', 'pps', 'prs', 'pss', 'sams', 'scrs', 'tms'].map(el => 'el-icon-' + el)
  }
]
