import { Dialog } from 'element-ui'
import { Component } from 'vue'

interface IModalOptions extends Dialog {
  component: Component;
  /**
   * 对应传入组件的props
   * 如： data为 {name: 'a', age: 10}
   * 则传入组件的props为 { name: String, age: Number }
   */
  data?: {
    [key:string]: any;
  };
  /**
   * 设置body的内边距，默认 10px
   */
  padding?: string;
  /**
   * 设置body的最小高度，默认 auto
   */
  minHeight?: string;
  /**
   * 设置body的高度
   */
  height?: string;
  /**
   * 窗口关闭时调用该函数，参数为 $emit 传入的参数
   * 
   * 如： $emit('close', 'a', 'b') 则 callback 会传入 `'a'` 和 `'b'` 两个参数
   */
  callback?: (...args?: any[]) => void;
}

interface INewTabOptions {
  /**
   * 自定义路由的路径（对于路由的path），最终url显示的路径为`/commom/[path]`
   * 
   * 未设置该参数默认取component组件的名称作为path
   */
  path?: string;
  /**
   * tab标签显示的标题
   */
  title: string;
  /**
   * 在新标签中显示的组件
   * 
   * 在该组件中使用`this.$emit('close')`可关闭标签页并返回打开标签页时所在的页面
   */
  component: Component;
  /**
   * 对应组件的 props
   * 
   * 如： data 为 {name: 'a', age: 10}
   * 
   * 则组件的 props 为 { name: String, age: Number }
   */
  data?:{
    [key:string]: any;
  },
  /**
   * 当新打开的标签通过`this.$emit('close')`关闭时会回调`callback`方法
   * 
   * `this.$emit`传入的所有参数会传递给`callback`
   */
  callback?: (...args?: any[]) => void;
  /**
   * 创建标签后是否立即清除组件缓存。默认为`false`
   */
  clearCache?: boolean;
  /**
   * 传入权限的menuId。默认为 执行`this.$newTab`方法所在组件的`$route.meta.id`
   * 
   * ajax请求头Blade-Menu-id用到
   */
  menuId?: string;
}

interface INewPageOptions {
  /**
   * 组件路径（相对于src/views目录）
   */
  path: string;
  /**
   * 对应组件的 props
   * 
   * 如： data 为 {name: 'a', age: 10}
   * 
   * 则组件的 props 为 { name: String, age: Number }
   */
  data?:{
    [key:string]: any;
  },
  /**
   * 回调函数（在组件中通过`$emit`触发`close | update`事件）
   */
  callback?: (...args?: any[]) => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 弹窗中加载组件
     */
    $modal: (options: IModalOptions) => void;
    /**
     * 动态创建临时路由
     */
    $newTab: (options: INewTabOptions) => void;
    /**
     * 创建新页面
     */
    $newPage: (options: INewPageOptions) => void;
  }
}