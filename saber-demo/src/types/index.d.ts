
interface IResData<T> {
  code: 401 | 500 | 200 | number;
  success: boolean;
  msg: string;
  data: T;
}

namespace ZHKJ {
  type Vue = import('vue')

  /**
   * Ajax请求返回的数据类型，传入的参数`T`为`data`字段类型
   * @example
   * 例如：`data`字段值为 `[ {name: '张三', age: 20}, {name: '李四', age: 21} ]`，则返回类型为：
   * `@returns {ZHKJ.Response<{name:string; age:number}[]>}`
   */
  export type Response<T> = Promise<IResData<T>>;

  /** 
   * Vue的props属性类型定义
   * @example
   * ```
   * ZHKJ.VueProps<string[]>
   * ```
   */
  export type VueProps<T> = Vue.PropOptions<T>;
}
