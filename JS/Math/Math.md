- [x] **Math.random**()

  `Math.random()` 函数返回一个浮点数,  伪随机数在范围从[0,1)

  - 两数之间的随机数 [min, max)

    ```js
    function getRandom(min, max) {
        return Math.random() * (max - min) + min
    }
    ```

  - 两个数之间的随机整数 [min, max)

    ```js
    function getRandom(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }
    ```

  - 两个数之间的随机整数 [min, max]

    ```js
    function getRandom(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    ```

    

