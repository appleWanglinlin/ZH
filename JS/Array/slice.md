- [x] **Array.prototype.slice()**

  `slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。

  ```js
  let arr = [1,2,3,4,5]
  arr.slice(1,3) // [2, 3]
  // arr
  // [1, 2, 3, 4, 5]
  ```

  - 语法：`arr.slice([begin[, end]])`

  - 参数：

    - begin：可选，提取起始处的索引（从 `0` 开始），从该索引开始提取原数组元素。

      如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取，`slice(-2)` 表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）。

      如果省略 `begin`，则 `slice` 从索引 `0` 开始。

      如果 `begin` 超出原数组的索引范围，则会返回空数组。

    - end：可选，提取终止处的索引（从 `0` 开始），在该索引处结束提取原数组元素。`slice` 会提取原数组中索引从 `begin` 到 `end` 的所有元素（包含 `begin`，但不包含 `end`）。

      如果该参数为负数， 则它表示在原数组中的倒数第几个元素结束抽取。 `slice(-2,-1)` 表示抽取了原数组中的倒数第二个元素到最后一个元素（不包含最后一个元素，也就是只有倒数第二个元素）。

      如果 `end` 被省略，则 `slice` 会一直提取到原数组末尾。

      如果 `end` 大于数组的长度，`slice` 也会一直提取到原数组末尾。

  - **类数组对象**

    `slice` 方法可以用来将一个类数组（Array-like）对象/集合转换成一个新数组。你只需将该方法绑定到这个对象上。 一个函数中的 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments) 就是一个类数组对象的例子。

    ```js
    function list() {
      return Array.prototype.slice.call(arguments);
    }
    var list1 = list(1, 2, 3); // [1, 2, 3]
    ```

    注意以下情况，返回为[]，**疑问？**

    ```js
    Array.prototype.slice.call(1,2,3) // []
    [].slice.call(1,2,3) // []
    [].slice.call('123') // ["1", "2", "3"]
    [].slice.call(123) // []
    ```

    当1,2,3作为参数传入时，list函数中的arguments不仅仅只有1,2,3，包含了length等

    ![image-20210528151500043](C:\Users\ZH1087\AppData\Roaming\Typora\typora-user-images\image-20210528151500043.png)

    当使用map将一个类数组（Array-like）对象/集合转换成一个新数组时，也存在同样的问题

    ```js
    function list() {
      return Array.prototype.map.call(arguments, v => v);
    }
    var list1 = list(123); // [123]
    
    [].map.call(123, v => v) // []
    [].map.call('123', v => v) // ["1", "2", "3"]
    
    ```

    

    

    

