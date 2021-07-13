
/**
 * @typedef  button
 * @property {string} button.label 按钮显示的文本
 * @property {any} button.value 点击按钮将`value`传递给`handler`
 * @property {[boolean]} button.default 是否是默认选中的按钮
 *
 * @typedef options
 * @property {string} options.title 显示的 标题
 * @property {[string]} options.link 点击标题跳转的地址（即路由地址），同时会根据`link`是否在菜单中的`path`判断是否显示该组件
 * @property {button[]} options.buttons 点击标题跳转的地址（即路由地址）
 * @property {any} options.component 组件（建议使用异步组件，特别是大组件，使用方法：`{component: () => import('./xxx/xx.vue')}`）
 * @property {(componentRef, buttonValue) => Promise} options.handler 点击按钮执行的函数，必须返回promise
 * @property {[boolean]} options.immediate 是否立即执行`handler`。默认`true`
 * @property {[boolean]} options.duplicateClick 是否允许当前选中的按钮可以再次点击执行`handler`。默认`false`
 * @property {[string]} options.width 该组件占用的百分比（必须是百分比）。默认`100%`
 *
 */

/**
 * 定义类型(便于代码提示，类似vue3的defineComponent)
 * @param {options[]} configures
 */
export function defineConfig(configures) {
  return configures
}

export { default as HomeModule } from './component.vue'
