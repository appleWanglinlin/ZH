- [x] **Date.prototype.setMonth**()

  `setMonth()` 方法根据本地时间为一个设置年份的日期对象设置月份。

  - 语法：`dateObj.setMonth(monthValue[, dayValue])`

  - 参数：

    - **monthValue**：介于 0 到 11 之间的整数（表示一月到十二月）。
    - **dayValue**：从 1 到 31 之间的整数，表示月份中的第几天。0为上个月最后一天
    - 返回值：基于 1 January 1970 00:00:00 UTC 开始计算的毫秒数

  - 描述

    如果不指定 `dayValue` 参数，就会使用 [`getDate`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate) 方法的返回值。

    如果有一个指定的参数超出了合理范围，`setMonth` 会相应地更新日期对象中的日期信息。例如，为 `monthValue` 指定 15，则年份会加 1，月份将会使用 3。

- [x] **Date.prototype.setDate()**

  `setDate()` 方法根据本地时间来指定一个日期对象的天数。

  - 语法：`dateObj.setDate(dayValue)`

  - 参数：**dayValue**一个整数，表示该月的第几天。

  - 描述：

    如果 `dayValue` 超出了月份的合理范围，`setDate` 将会相应地更新 `Date` 对象。

    例如，如果为 `dayValue` 指定0，那么日期就会被设置为上个月的最后一天。

    如果dayValue被设置为负数，日期会设置为上个月最后一天往前数这个负数绝对值天数后的日期。-1会设置为上月最后一天的前一天（译者注：例如当前为4月，如果setDate(-2),则为3月29日）

- [ ] 

- [ ] 

- [ ] 

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  

