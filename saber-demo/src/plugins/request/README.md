# 扩展原有的 request
> 根据项目对应的方法自动给url添加前缀
```js
import request from '@/plugins/request'

request({ ...options, componentInstance })

// 以下会自动添加前缀
request.$ams(options, componentInstance)
request.$auth(options, componentInstance)
request.$pms(options, componentInstance)
// ...
```
## options参数
- 保留原有axios的所有request config，[详见](https://github.com/axios/axios#request-config)
- `useCache {Boolean}` 是否使用 requestCache方法请求，默认`false`
- `recache {Boolean}` 是否请求接口重新缓存数据，默认`false`。`useCache`为`true`时才生效

## componentInstance
> 可选参数。`componentInstance` 为请求所在的组件实例（一般就是组件内的`this`）。
请求方法传入`componentInstance`后，如果请求处于pending时销毁组件，则在销毁前会自动的取消请求。

在组件中有**请求接口**且组件**会被销毁**的场景下，传入该参数很有必要，可以避免组件被销毁后请求完成会依然执行then里面的方法。

## 使用demo
api文件(/api/test.js)：
```js
import request from '@/plugins/request'

export function testApi(params, componentInstance) {
  return request.$pms({
    url: '/test',
    params
  }, componentInstance)
}
```

vue组件文件中（test.vue）：
```js
import { testApi } from '@/api/test.js'

export default {
  created() {
    // 传入 `this` 后，在 test.vue 组件销毁时如果请求处于pending状态则会自动取消请求
    testApi({}, this).then(res => {
      // do something...
    })
  }
}
```