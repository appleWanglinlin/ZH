- [x] **Node.js**

  **Node.js是一个开源与跨平台的JavaScript运行时环境。Node.js在浏览器外运行V8 JavaScript引擎（Google Chrome的内核）。这使Node.js表现的非常出色。**

  **Node.js具有独特的优势，因为为浏览器编写JavaScript的数百万前端开发者现在除了客户端代码以外还可以编写服务器端代码，而无需学习完全不同的语言。**
  
  在Node.js中，可以毫无疑问地使用新的ECMAScript标准，因为不必等待所有用户更新其浏览器，你可以通过更改Node.js版本来决定要使用的ECMAScript版本，并且还可以通过带有标志的Node.js来启用特定的实验中的特性。
  
- [x] **webpack**

  https://webpack.docschina.org/concepts/why-webpack/

  Node.js是一个JavaScript运行时，可以在浏览器环境之外的计算机和服务器中使用。**webpack运行在Node.js中**
  
- [x] **npm**

  **npm是随同Node.js一起安装的包管理工具**，能解决Node.js代码部署上的很多问题，常见的使用场景有以下几种：

  - 允许用户从NPM服务器下载别人编写的第三方包到本地使用
  - 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用
  - 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用

- [x] javaScript模块规范

  http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html

  >**AMD-异步模块定义**
  >
  >AMD是RequireJS在推广过程中对模块定义的规范化产出，它是一个概念，RequireJS是对这个概念的实现，就好比JavaScript语言是对ECMAScript规范的实现。浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是AMD规范诞生的背景。[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。目前，主要有两个Javascript库实现了AMD规范：[require.js](http://requirejs.org/)和[curl.js](https://github.com/cujojs/curl)。
  >
  >**CMD**
  >
  >CMD是SeaJS在推广过程中对模块定义的规范化产出，是一个**同步模块定义**，是SeaJS的一个标准，SeaJS是CMD概念的一个实现，SeaJS是淘宝团队提供的一个模块开发的js框架.
  >
  >**CommonJS 模块，简称 CJS**
  >
  >Node.js 专用，CommonJS 模块使用`require()`加载和`module.exports`输出，**`require()`是同步加载**
  >
  > **ES6 模块，简称 ESM**
  >
  >ES6 模块使用`import`和`export`，**`import`命令则是异步加载**
  >
  >**UMD**
  >
  >其是amd和commonjs的统一规范，支持两种规范，即写一套代码，可用于多种场景。

- [x] javaScript模块补充

  >学习 JavaScript 语言，你会发现它有两种格式的模块。一种是 ES6 模块，简称 ESM；另一种是 Node.js 专用的 CommonJS 模块，简称 CJS。这两种模块不兼容。ES6 模块和 CommonJS 模块有很大的差异。语法上面，CommonJS 模块使用`require()`加载和`module.exports`输出，ES6 模块使用`import`和`export`。用法上面，**`require()`是同步加载**，后面的代码必须等待这个命令执行完，才会执行。**`import`命令则是异步加载**，或者更准确地说，ES6 模块有一个独立的静态解析阶段，依赖关系的分析是在那个阶段完成的，最底层的模块第一个执行。

- [x] [浏览器加载 CommonJS 模块的原理与实现](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html)

- [x] for...in

  >**`for...in`语句**以**任意顺序**遍历一个对象的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性。
  >
  >`for ... in`是为遍历对象属性而构建的，**不**建议与数组一起使用，数组可以用`Array.prototype.forEach()`和`for ... of`
  >
  >**提示：**`for...in`不应该用于迭代一个关注索引顺序的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)。
  >
  >使用for-in循环，返回的是所有能够通过对象访问的、可枚举的属性，其中**既包括存在于实例中的属性，又包括存在于原型中的属性**。屏蔽了原型中不可枚举属性的实例属性也会在for-in循环中返回。
  >
  >```js
  >Object.prototype.gender = '女'
  >var person = {
  >    	name: 'tebu',
  >    	age: 12
  >}
  >for(var key in person)
  >{
  >    	console.log(key,person[key]);
  >}
  >// name tebu
  >// age 12
  >// gender 女
  >```

- [x] hasOwnProperty()

  >`hasOwnProperty()` 方法会**返回一个布尔值**，指示**对象自身**属性中是否具有指定的属性（也就是，是否有指定的键）。

- [x] 触摸事件的类型

  >touchstart、touchmove、touchend、touchcancel
  >
  >touchcancel：当触点由于某些原因被中断时触发

- [x] history

  >使用 `history` API与浏览器历史记录进行交互。
  >
  >**1、go()**
  >
  >语法：
  >
  >```js
  >window.history.go(delta);
  >```
  >
  >delta 可选
  >相对于当前页面你要去往历史页面的位置。负值表示向后移动，正值表示向前移动。因此，例如：history.go(2)向前移动两页，history.go(-2)则向后移动两页。如果未向该函数传参或delta相等于0，则该函数与调用location.reload()具有相同的效果。
  >
  >最后，以下任意一条语句都会重新加载当前页面：
  >
  >```js
  >window.history.go();
  >window.history.go(0);
  >```
  >
  >**2、back()**
  >
  >语法：
  >
  >```js
  >window.history.back()
  >```
  >
  >`back()`方法会在会话历史记录中向后移动一页。如果没有上一页，则此方法调用不执行任何操作。
  >
  >**3、forward()**
  >
  >语法：
  >
  >```js
  >window.history.forward();
  >```
  >
  >在会话历史中向前移动一页。它与使用`delta`参数为1时调用 `history.go(delta)`的效果相同。

- [x] iframe

  >https://www.cnblogs.com/Leophen/p/11403800.html

- [x] **parseFloat**

  >**`parseFloat()`** 函数解析一个参数（必要时先转换为字符串）并返回一个浮点数。
  >
  >>```js
  >>parseFloat(string)
  >>```
  >>
  >>参数：
  >>
  >>string：需要被解析成为浮点数的值。
  >>
  >>返回值：给定值被解析成浮点数。如果给定值不能被转换成数值，则会返回 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)。
  >
  >`parseFloat`是个全局函数,不属于任何对象。
  >
  >- 如果 `parseFloat` 在解析过程中遇到了正号（`+`）、负号（`-` U+002D HYPHEN-MINUS）、数字（`0`-`9`）、小数点（`.`）、或者科学记数法中的指数（e 或 E）**以外**的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。
  >- 第二个小数点的出现也会使解析停止（在这之前的字符都会被解析）。
  >- 参数首位和末位的空白符会被忽略。
  >- 如果参数字符串的第一个字符不能被解析成为数字,`则` `parseFloat` 返回 `NaN`。
  >- `parseFloat` 也可以解析并返回 [`Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。
  >- `parseFloat`解析 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 为 [`Numbers`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number), 丢失精度。因为末位 `n` 字符被丢弃。
  >
  >考虑使用 [`Number(value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 进行更严谨的解析，只要参数带有无效字符就会被转换为 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 。
  >
  >```js
  >parseFloat(123) //123
  >parseFloat('123a') //123
  >parseFloat('123.45.67') //123.45
  >parseFloat('   123   ') //123
  >parseFloat('a123') // NaN
  >```

- [x] **Number**

  >JavaScript 的 **`Number`** 对象是经过封装的能让你处理数字值的对象。`Number` 对象由 `Number()` 构造器创建
  >
  >```js
  >var a = new Number('123'); // a === 123 is false
  >var b = Number('123'); // b === 123 is true
  >a instanceof Number; // is true
  >b instanceof Number; // is false
  >typeof a // "object"
  >typeof b // "number"
  >```
  >
  >```js
  >Number(value)
  >// value: 被创建对象的数字值。如果参数无法被转换为数字，则返回 NaN。
  >```
  >
  >```js
  >Number(123) //123
  >Number('123') //123
  >Number('123a') //NaN
  >```

- [x] **String**

  >**`String`** 全局对象是一个用于字符串或一个字符序列的构造函数。
  >
  >**基本字符串和字符串对象的区别**
  >
  >请注意区分 JavaScript 字符串对象和基本字符串值 . ( 对于 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 和[`Numbers`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 也同样如此.)
  >
  >字符串字面量 (通过单引号或双引号定义) 和 直接调用 String 方法(没有通过 new 生成字符串对象实例)的字符串都是基本字符串。JavaScript会自动将基本字符串转换为字符串对象，只有将基本字符串转化为字符串对象之后才可以使用字符串对象的方法。当基本字符串需要调用一个字符串对象才有的方法或者查询值的时候(基本字符串是没有这些方法的)，**JavaScript 会自动将基本字符串转化为字符串对象并且调用相应的方法或者执行查询。**（**其实，这是由于 JS 在执行到这条语句的时候，内部将 字符串 包装成了一个 String 对象，执行完后，再把这个对象丢弃了，这种语法叫做 “装箱”**）
  >
  >```js
  >var s_prim = "foo";
  >var str = String(s_prim);
  >var s_obj = new String(s_prim);
  >
  >console.log(typeof s_prim); // Logs "string"
  >console.log(typeof str); // Logs "string"
  >console.log(typeof s_obj);  // Logs "object"
  >```

- [ ] **reflow(回流)和repaint(重绘)**

  >回流：当页面因为元素的大小、布局、隐藏等改变需要重新构建时，称为回流。
  >
  >>获取一个元素的scrollTop、scrollLeft、scrollWidth、offsetTop、offsetLeft、offsetWidth、offsetHeight之类的属性，浏览器为了保证值的正确也会回流取得最新的值
  >
  >重绘：当页面中元素改变颜色等不影响其他元素的属性时，称为重绘。

- [ ] **babel**

  >babel是javaScript编辑器。Babel是一个工具链，主要用于在当前和较旧的浏览器或环境中将ECMAScript 2015+代码转换为JavaScript的向后兼容版本。
  >
  >为了兼容不支持 ES6 的浏览器，所以需要 babel 编译。为了兼容不支持 module 的浏览器，所以需要 webpack 打包。

- [ ] **script标签属性**

  >type
  >
  >```html
  ><script type="text/module">
  >// 类型属性为`module`，代码会被视为JavaScript模块
  >```
  >
  >```html
  ><script type="text/babel">
  >// 类型属性为`babel`，是对该type的内容块做了单独解析
  >```

- [x] **noscript标签**

  > 如果页面上的脚本类型不受支持或者当前在浏览器中关闭了脚本，则在 **HTML <noscript> 元素**中定义脚本未被执行时的替代内容。

- [x] **use strict**

  >严格模式，严格模式下禁止this关键字指向全局对象

- [x] **in**

  >如果指定的属性在指定的对象或其原型链中，则**`in` 运算符**返回`true`。
  >
  >**语法**：prop in object
  >
  >**参数**：
  >
  >**prop**：一个字符串类型或者 symbol 类型的属性名或者数组索引（非symbol类型将会强制转为字符串）。
  >
  >**objectName**：检查它（或其原型链）是否包含具有指定名称的属性的对象。
  >
  >**描述**：
  >
  >```js
  >// 数组
  >var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
  >0 in trees        // 返回true
  >3 in trees        // 返回true
  >6 in trees        // 返回false
  >"bay" in trees    // 返回false (必须使用索引号,而不是数组元素的值)
  >
  >"length" in trees // 返回true (length是一个数组属性)
  >
  >Symbol.iterator in trees // 返回true (数组可迭代，只在ES2015+上有效)
  >
  >
  >// 内置对象
  >"PI" in Math          // 返回true
  >
  >// 自定义对象
  >var mycar = {make: "Honda", model: "Accord", year: 1998};
  >"make" in mycar  // 返回true
  >"model" in mycar // 返回true
  >```
  >
  >`in`**右操作数必须是一个对象值**。例如，你可以指定使用`String`构造函数创建的字符串，但不能指定字符串文字。
  >
  >```js
  >var color1 = new String("green");
  >"length" in color1 // 返回true
  >var color2 = "coral";
  >"length" in color2 // 报错(color2不是对象)
  >```
  >
  >如果你使用 `delete` 运算符删除了一个属性，则 `in` 运算符对所删除属性返回 `false`。
  >
  >```js
  >var mycar = {make: "Honda", model: "Accord", year: 1998};
  >delete mycar.make;
  >"make" in mycar;  // 返回false
  >
  >var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
  >delete trees[3];
  >3 in trees; // 返回false
  >```
  >
  >如果你只是将一个属性的值赋值为[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，而没有删除它，则 `in` 运算仍然会返回`true`。
  >
  >```js
  >var mycar = {make: "Honda", model: "Accord", year: 1998};
  >mycar.make = undefined;
  >"make" in mycar;  // 返回true
  >```
  >
  >```js
  >var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
  >trees[3] = undefined;
  >3 in trees; // 返回true
  >```
  >
  >如果一个属性是从原型链上继承来的，`in` 运算符也会返回 `true`。
  >
  >```js
  >"toString" in {}; // 返回true
  >```
  >
  >如果只声明一个变量，没有赋值，`in`运算符返回`true`
  >
  >```js
  >// 注意有引号和无印号的区别
  >var c
  >c in window // true
  >'c' in window // true
  >
  >c = 1
  >c in window // false
  >'c' in window // true
  >```

- [x] **symbol**

  >**symbol** 是一种基本数据类型。`Symbol()`函数会返回**symbol**类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为**它不支持语法："`new Symbol()`"。**
  >
  >每个从`Symbol()`返回的symbol值都是唯一的。**一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。**
  >
  >**语法**：Symbol([description])
  >
  >**description**：可选的，字符串类型。对symbol的描述，可用于调试但不是访问symbol本身。
  >
  >**描述**：直接使用`Symbol()`创建新的symbol类型。并用一个可选的字符串作为其描述。
  >
  >```js
  >var sym1 = Symbol();
  >var sym2 = Symbol('foo');
  >var sym3 = Symbol('foo');
  >```
  >
  >上面的代码创建了三个新的symbol类型。 注意，`Symbol("foo")` 不会强制将字符串 “foo” 转换成symbol类型。它每次都会创建一个新的 symbol类型：
  >
  >```js
  >Symbol("foo") === Symbol("foo"); // false
  >```
  >
  >下面带有 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符的语法将抛出 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 错误：
  >
  >```js
  >var sym = new Symbol(); // TypeError
  >```
  >
  >这会阻止创建一个显式的 Symbol 包装器对象而不是一个 Symbol 值。围绕原始数据类型创建一个显式包装器对象从 ECMAScript 6 开始不再被支持。 然而，现有的原始包装器对象，如 `new Boolean`、`new String`以及`new Number`，因为遗留原因仍可被创建。
  >
  >如果你真的想创建一个 Symbol 包装器对象 (`Symbol wrapper object`)，你可以使用 `Object()` 函数：
  >
  >```js
  >var sym = Symbol("foo");
  >typeof sym;     // "symbol"
  >var symObj = Object(sym);
  >typeof symObj;  // "object"
  >```

- [x] **toString**

  >**1、Object.prototype.toString()**
  >
  >`toString() `方法返回一个表示该对象的字符串。
  >
  >语法：`obj.toString()`
  >
  >每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中 `type` 是对象的类型。以下代码说明了这一点：
  >
  >```js
  >var o = new Object();
  >o.toString(); // returns [object Object]
  >```
  >
  >**使用toString()检测对象类型**
  >
  >可以通过 `toString()` 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，**传递要检查的对象作为第一个参数，称为 `thisArg`。**
  >
  >```js
  >var toString = Object.prototype.toString;
  >// toString.call(thisArg)，thisArg改变了toString()函数中this指向，使指向thisArg
  >toString.call(new Date); // [object Date]
  >toString.call(new String); // [object String]
  >toString.call(Math); // [object Math]
  >
  >//Since JavaScript 1.8.5
  >toString.call(undefined); // [object Undefined]
  >toString.call(null); // [object Null]
  >```
  >
  >
  >
  >**2、Number.prototype.toString()**
  >
  >**`toString()`** 方法返回指定 [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 对象的字符串表示形式。
  >
  >语法：`numObj.toString([radix])`
  >
  >参数：
  >
  >**radix**：指定要用于数字到字符串的转换的基数(从2到36)。如果未指定 radix 参数，则默认值为 10。如果 `toString()` 的 radix 参数不在 2 到 36 之间，将会抛出一个 [`RangeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RangeError)。
  >
  >描述：
  >
  >[`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 对象覆盖了 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 对象上的 `toString()` 方法，它不是继承的 [`Object.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)。对于 [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 对象，`toString()` 方法以指定的基数返回该对象的字符串表示。
  >
  >进行数字到字符串的转换时，建议**用小括号将要转换的目标括起来**，防止出错。**因为当为正整数调用toString()时，数字后面的小数点会被解析为小数点，而不是方法的调用**
  >
  >```js
  >2.toString()
  >// 报错VM180:1 Uncaught SyntaxError: Invalid or unexpected token
  >// JS引擎不知道这里的 . 是小数点还是调用toString方法，于是解析成(2.)toString，就报错了
  >
  >2..toString()
  >// "2",相当于(2.0).toString()
  >
  >.2.toString()
  >// "0.2",相当于(0.2).toString()
  >
  >2 .toString()
  >// "2"
  >
  >(2).toString()
  >// "2"
  >
  >2.1.toString()
  >// "2.1"
  >```

- [x] **document.readyState**

  >**`Document.readyState`** 属性描述了[`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 的加载状态。
  >
  >当该属性值发生变化时，会在 [`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 对象上触发 `readystatechange` 事件。
  >
  >语法：`var string = document.readyState;`
  >
  >值：
  >
  >一个文档的 `readyState` 可以是以下之一：
  >
  >`loading`（正在加载）
  >
  >​	[`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 仍在加载。
  >
  >`interactive`（可交互）
  >
  >​	文档已被解析，"**正在加载**"状态结束，DOM元素可以被访问。但是诸如图像，样式表和框架之类的子资源仍在加载。
  >
  >`complete`（完成）
  >
  >​	文档和所有子资源已完成加载。表示 `load` 状态的事件即将被触发。

- [x] **pageShow**

  >当一条会话历史记录被执行的时候将会触发页面显示(pageshow)事件。(这包括了后退/前进按钮操作，同时也会**在onload 事件触发后初始化页面时触发**)

- [x] **window:beforeunload event**

  >当浏览器窗口关闭或者刷新时，会触发beforeunload事件。当前页面不会直接关闭，可以点击确定按钮关闭或刷新，也可以取消关闭或刷新。

- [x] **DOMContentLoaded**

  >当初始的 **HTML** 文档被完全加载和解析完成之后，**`DOMContentLoaded`** 事件被触发，而无需等待样式表、图像和子框架的完全加载。
  >如果您希望 DOM 在用户请求页面后尽可能快地解析，你可以做的一些事情是把你的 [JavaScript 异步化](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests) 以及 [优化样式表的加载](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery), 由于被并行加载而减慢页面加载，从主 html 文档“窃取”流量。

- [x] **load**

  >当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发`load`事件。
  >它与[`DOMContentLoaded`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/DOMContentLoaded_event)不同，后者只要页面DOM加载完成就触发，无需等待依赖资源的加载。

- [x] **instanceof**

  >语法：`object instanceof constructor`
  >参数：
  >
  >object：某个实例对象
  >
  >constructor：某个构造函数
  >
  >描述：`instanceof`运算符用来检测`constructor.prototype`是否存在于`object`的原型链上，即构造函数的prototype是否存在于实例对象的原型链上
  >
  >```js
  >// 定义构造函数
  >function C(){}
  >function D(){}
  >
  >var o = new C();
  >o instanceof C; // true 因为C.prototype === o.__proto__，C.prototype存在于o的原型链上
  >
  >C.prototype instanceof Object // true, 因为Object.prototype === C.prototype.__proto__，Object.prototype存在于C.prototype的原型链上
  >
  >o instanceof Object; // true，Object.prototype === o.__proto__.__proto__，Object.prototype存在于o的原型链上
  >```
  >
  >要检测对象不是某个构造函数的实例时，你可以这样做
  >
  >```js
  >if (!(mycar instanceof Car)) {
  >  // Do something, like mycar = new Car(mycar)
  >}
  >```
  >
  >这和以下代码完全不同
  >
  >```js
  >if (!mycar instanceof Car)
  >```
  >
  >这段代码永远会得到 `false`（`!mycar` 将在 `instanceof` 之前被处理，所以你总是在验证一个布尔值是否是 `Car` 的一个实例）。

- [x] **continue**

  continue 声明终止当前循环或标记循环的当前迭代中的语句执行，并在下一次迭代时**继续执行**循环。

- [x] **break**

  break 语句中止当前循环，[`switch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/switch)语句或[`label`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/label) 语句，并把程序控制流转到紧接着被中止语句后面的语句。

- [x] **闭包**

  一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

  词法作用域：

  词法（lexical）一词指的是，**词法作用域根据源代码中声明变量的位置来确定该变量在何处可用**。

- [x] **原始数据**

  基本类型（基本数值、基本数据类型）是一种既非[对象](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)也无[方法](https://developer.mozilla.org/zh-CN/docs/Glossary/Method)的数据。在 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Glossary/JavaScript) 中，共有7种基本类型：[string](https://developer.mozilla.org/zh-CN/docs/Glossary/String)，[number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)，[bigint](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)，[boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)，[null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)，[undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)，[symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) ([ECMAScript](https://developer.mozilla.org/zh-CN/docs/Glossary/ECMAScript) 2016新增)。

  多数情况下，基本类型直接代表了最底层的语言实现。

  所有基本类型的值都是**不可改变**的。但需要注意的是，基本类型本身和一个赋值为基本类型的变量的区别。变量会被赋予一个新值，而原值不能像数组、对象以及函数那样被改变。

  这个示例会帮助你了解基本类型**不可改变**的事实。

  示例1：

  ```js
  // 使用字符串方法不会改变一个字符串
  var bar = "baz";
  console.log(bar);               // baz
  bar.toUpperCase();
  console.log(bar);               // baz
  
  // 使用数组方法可以改变一个数组
  var foo = [];
  console.log(foo);               // []
  foo.push("plugh");
  console.log(foo);               // ["plugh"]
  
  // 赋值行为可以给基本类型一个新值，而不是改变它
  bar = bar.toUpperCase();       // BAZ
  ```

  **基本类型值可以被替换，但不能被改变。**

  示例2：

  下面的示例将让你体会到JavaScript是如何处理基本类型的。

  ```js
  // 基本类型
  let foo = 5;
  
  // 定义一个貌似可以改变基本类型值的函数
  function addTwo(num) {
     num += 2;
  }
  // 和前面的函数一样
  function addTwo_v2(foo) {
     foo += 2;
  }
  
  // 调用第一个函数，并传入基本类型值作为参数
  addTwo(foo);
  // Getting the current Primitive value
  console.log(foo);   // 5
  
  // 尝试调用第二个函数...
  addTwo_v2(foo);
  console.log(foo);   // 5
  ```

  你是否认为会得到`7`，而不是`5`？如果是，请看看代码是如何运行的：

  - `addTwo`和`addTwo_v2`函数调用时，JavaScript会检查标识符`foo`的值，从而准确无误的找到第一行实例化变量的声明语句。
  - 找到以后，JavaScript将其作为参数传递给函数的形参。
  - 在执行函数体内语句之前，**JavaScript会将传递进来的参数（基本类型的值）复制一份**，**创建一个本地副本。这个副本只存在于该函数的作用域中**，我们能够通过指定在函数中的标识符访问到它（`addTwo`中的`num`，`addTwo_v2`中的`foo`）。
  - 接下来，函数体中的语句开始执行：
    - 第一个函数中，创建了本地`num`参数，`num`的值加2，但这个值并不是原来的`foo`的值。
    - 第二个函数中，创建了本地参数`foo`，并将它的值加2，这个值不是外部foo的值。在这种情况下，外部的`foo`变量不能以**任何**方式被访问到（疑问：因为没形成闭包吗？）。这是因为JavaScript的词法作用域（lexical scoping）所导致的变量覆盖，本地的变量`foo`覆盖了外部的变量`foo`。欲知详情，请参阅[闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)。
  - 综上所述，函数中的任何操作都**不会**影响到最初的`foo`，我们操作的只不过是它的**副本**。

  这就是为什么说**所有基本类型的值都是无法改变的**。

- [x] **isNaN()**

  `isNaN()` 函数用来确定一个值是否为[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 。注：`isNaN`函数内包含一些非常有趣的[规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN#Description)；你也可以使用 ECMAScript 2015 中定义的 [`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) 来判断。

  - isNaN函数的必要性

    与 JavaScript 中其他的值不同，[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)不能通过相等操作符（== 和 ===）来判断 ，因为 `NaN == NaN` 和 `NaN === NaN` 都会返回 `false`。 因此，`isNaN` 就很有必要了。

  - NaN值的产生

    当算术运算返回一个未定义的或无法表示的值时，`NaN`就产生了。但是，`NaN`并不一定用于表示某些值超出表示范围的情况。将某些不能强制转换为数值的非数值转换为数值的时候，也会得到`NaN`。

    例如，0 除以0会返回`NaN `—— 但是其他数除以0则不会返回`NaN`。（其他数除以0返回`Infinity`）

  - 令人费解的怪异行为

    如果`isNaN`函数的参数不是`Number`类型， `isNaN`函数会首先尝试将这个参数转换为数值，然后才会对转换后的结果是否是[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)进行判断。

    下一个版本的ECMAScript (ES2015)包含[`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)函数。通过`Number.isNaN(x)`来检测变量`x`是否是一个`NaN`将会是一种可靠的做法。然而，在缺少`Number.isNaN`函数的情况下, 通过表达式`(x != x)` 来检测`变量x`是否是`NaN`会更加可靠。

    一个`isNaN`的 polyfill 可以理解为（这个polyfill利用了`NaN`自身永不相等于自身这一特征 ）：

    ```js
    var isNaN = function(value) {
        var n = Number(value);
        return n !== n;
    };
    ```

  示例：

  ```js
  isNaN(NaN);       // true
  isNaN(undefined); // true
  isNaN({});        // true
  
  isNaN(true);      // false
  isNaN(null);      // false
  isNaN(37);        // false
  
  // strings
  isNaN("37");      // false: 可以被转换成数值37
  isNaN("37.37");   // false: 可以被转换成数值37.37
  isNaN("37,5");    // true
  isNaN('123ABC');  // true:  parseInt("123ABC")的结果是 123, 但是Number("123ABC")结果是 NaN
  isNaN("");        // false: 空字符串被转换成0
  isNaN(" ");       // false: 包含空格的字符串被转换成0
  
  // dates
  isNaN(new Date());                // false
  isNaN(new Date().toString());     // true
  
  isNaN("blabla")   // true: "blabla"不能转换成数值
                    // 转换成数值失败， 返回NaN
  ```

- [x] **内存**

  JavaScript内部，所有数字都是以64位浮点数形式储存，即使整数也是如此

  Javascript中，由于其变量内容不同，变量被分为基本数据类型变量和引用数据类型变量。基本类型变量用八字节内存，存储基本数据类型的值，引用类型变量则只保存对对象、数组和函数等引用类型的值的引用(即内存地址)。

   JS中的数字是不分类型的，也就是没有byte/int/float/double等的差异。

  1字节=8位(1 byte = 8bit)

  **bit**   电脑记忆体中最小的单位，在二进位电脑系统中，每一bit 可以代表0 或 1 的数位讯号。 

  **1 Byte = 8 Bits**

  **1 KB = 1024 Bytes**

  **1 MB = 1024 KB**

  **1 GB = 1024 MB**

- [x] **Boolean**

  **`Boolean`对象**是一个布尔值的对象包装器。

  如果需要，作为第一个参数传递的值将转换为布尔值。如果省略或值`0`，`-0`，[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)，`false`，[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)，[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，或空字符串（`""`），该对象具有的初始值`false`。所有其他值，包括任何对象，空数组（`[]`）或字符串`"false"`，都会创建一个初始值为`true`的对象。

  注意不要将**基本类型中的布尔值** `true` 和 `false` 与值为 `true` 和 `false` 的 **`Boolean` 对象**弄混了。

  其值不是[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)或[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)的任何对象（包括其值为`false`的布尔对象）在传递给条件语句时都将计算为`true`。 例如，以下[`if`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/if...else)语句中的条件评估为`true`：

  ```js
  var x = new Boolean(false);
  var x = new Boolean(0);
  var x = new Boolean();
  if (x) {
    // 这里的代码会被执行,x是boolean对象
    console.log('x', x)
  }
  ```

- [x] [JavaScript实现继承](https://www.cnblogs.com/Leophen/p/11401734.html)

  共6种方式：原型链继承、借用构造函数继承、组合继承、原型式继承、寄生式继承、寄生组合式继承。

- [x] [Browser对象](https://www.w3cschool.cn/jsref/n2z4120o.html)

  window、Navigator、Screen、History、Location

- [x] javascript中实现跨域的方式总结

  https://www.nowcoder.com/test/question/done?tid=44650982&qid=55059#summary

  - 第一种方式：jsonp请求

    jsonp的原理是利用<script>标签的跨域特性，可以不受限制地从其他域中加载资源，类似的标签还有`<img>`

    JSONP的优点是：它不像XMLHttpRequest对象实现的Ajax请求那样受到同源策略的限制；它

    的兼容性更好，在更加古老的浏览器中都可以运行，不需要XMLHttpRequest或ActiveX的支

    持；并且在请求完毕后可以通过调用callback的方式回传结果。

    JSONP的缺点则是：它只支持GET请求而不支持POST等其它类型的HTTP请求；它只支持跨域

    HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题。

  - 第二种方式：document.domain

    这种方式用在主域名相同子域名不同的跨域访问中

  - 第三种方式：window.name

    window的name属性有个特征：在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

  - 第四种方式：window.postMessage

    window.postMessages是html5中实现跨域访问的一种新方式，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源。

  - 第五种方式：CORS

    CORS背后的基本思想，就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是应该失败。

  - 第六种方式：Web Sockets

    web sockets原理：在JS创建了web socket之后，会有一个HTTP请求发送到浏览器以发起连接。取得服务器响应后，建立的连接会使用HTTP升级从HTTP协议交换为web sockt协议。

- [x] Math.max()

  `Math.max()` 函数返回一组数中的最大值。

  ```js
  console.log(Math.max(1, 3, 2)); // 3
  const array1 = [1, 3, 2];
  console.log(Math.max(...array1)) // 3
  Math.max.apply(null, array1); // 3
  ```

- [x] Math.round()

  ```js
  Math.round(1.5) // 2
  Math.round(-1.5) // -1
  ```

- [x] javascript全局函数

  decodeURI()、decodeURIcomponent()、 encodeURI、encodeURIcomponent()、escape()、eval()、isFinite()、isNAN()、 Number()、parseFloat()、parseInt()、String()、unescape()

  js的全局属性：Infinity、NAN、undefined
  
- [ ] 作用域链

  with、try catch、eval可以改变作用域链
  
- [ ] 位置

  - pageX

    这个属性将基于文档的边缘，考虑任何页面的水平方向上的滚动。

  - clientX

    提供事件发生时的应用客户端区域的水平坐标 (与页面坐标不同)。例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 0 。

  - offsetX

    规定了事件对象与目标节点的内填充边（padding edge）在 X 轴方向上的偏移量。

  - screenX

    提供鼠标在全局（屏幕）中的水平坐标（偏移量）。

  当滑动滚动条时，pageX不再是原来的值，会改变

  当改变分辨率时，offsetX和screenX会改变

  | 属性    | 说明                                                         |
  | ------- | ------------------------------------------------------------ |
  | clientX | 以浏览器左上顶角为原点，定位 x 轴坐标                        |
  | offsetX | 以当前事件的目标对象左上角为原点，定位x轴坐标                |
  | pageX   | 以Document 对象（即文本窗口）左上角为原点，定位x轴坐标       |
  | screenX | 计算机屏幕左上角为原点，定位x轴坐标                          |
  | layerX  | 最近的绝对定位的父元素（如果没有，则为Document对象）左上角为原点，定位x轴坐标 |



