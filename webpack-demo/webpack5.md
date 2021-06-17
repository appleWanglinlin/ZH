### [webpack5](https://webpack.docschina.org/guides/getting-started/)

#### 起步

>运行 webpack 5 的 Node.js 最低版本是 10.13.0 (LTS)
>
>源代码是指用于书写和编辑的代码。分发代码是指在构建过程中，经过最小化和优化后产生的输出结果，最终将在浏览器中加载。
>
>在安装一个 package，而此 package 要打包到生产环境 bundle 中时，你应该使用 `npm install --save`。如果你在安装一个用于开发环境的 package 时（例如，linter, 测试库等），你应该使用 `npm install --save-dev`。
>
>>`npm list -g --depth 0`：查看npm全局安装过的包
>>
>>`npm init -y`：-y 的含义：yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json
>
>Node 8.2/npm 5.2.0 以上版本提供的 `npx` 命令，可以运行在初次安装的 webpack package 中的 webpack 二进制文件（即 `./node_modules/.bin/webpack`）
>
>>举个例子： 
>>
>>```js
>>npm i webpack -D      //非全局安装
>>//如果要执行 webpack 的命令
>>./node_modules/.bin/webpack -v
>>```
>>
>>有了 npx 之后
>>
>>```js
>>npm i webpack -D    //非全局安装
>>npx webpack -v 
>>```
>
>[ES2015](https://babeljs.io/learn-es2015/) 中的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 语句已经被标准化。虽然大多数浏览器还无法支持它们，但是 webpack 却能够提供开箱即用般的支持。事实上，webpack 在幕后会将代码 “**转译**”，以便旧版本浏览器可以执行。注意，webpack 不会更改代码中除 `import` 和 `export` 语句以外的部分。如果你在使用其它 [ES2015 特性](http://es6-features.org/)，请确保你在 webpack [loader 系统](https://webpack.docschina.org/concepts/loaders/) 中使用了一个像是 [Babel](https://babel.docschina.org/) 或 [Bublé](https://buble.surge.sh/guide/) 的 [transpiler(转译器)](https://webpack.docschina.org/loaders/#transpiling)

#### 管理资源

>Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换。
>
>- 加载CSS
>
>  如果我们需要在应用中添加 css 文件，就需要使用到 css-loader 和 style-loader，他们做两件不同的事情，css-loader 会遍历 CSS 文件，然后找到 url() 表达式然后处理他们，style-loader 会把原来的 CSS 代码插入页面中的一个 style 标签中。
>
>  为了在 JavaScript 模块中 `import` 一个 CSS 文件，你需要安装 [style-loader](https://webpack.docschina.org/loaders/style-loader) 和 [css-loader](https://webpack.docschina.org/loaders/css-loader)，并在 [`module` 配置](https://webpack.docschina.org/configuration/module) 中添加这些 loader：
>
>  ```bash
>  npm install --save-dev style-loader css-loader
>  ```
>
>  ```js
>  // webpack.config.js
>  module.exports = {
>    entry: './src/index.js',
>    output: {
>      filename: 'bundle.js',
>      path: path.resolve(__dirname, 'dist')
>    },
>    module: {
>      rules: [
>        {
>          test: /\.css$/i,
>          use: ['style-loader', 'css-loader']
>        }
>      ]
>    }
>  }
>  ```
>
>  模块loader可以链式调用。链中的每个loader都将对应资源进行转换。链会逆序执行。第一个loader将其结果（被转换后的资源）传递给下一个loader，以此类推。最后，webpack期望链中的最后的loader返回JavaScript。
>
>  应保证loader的先后顺序：`style-loader`在前，而`css-loader`在后。如果不遵守此约定，webpack可能会抛出错误。
>
>  webpck根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的loader。在上面示例中，所有以`.css`结尾的文件，都将被提供给`style-loader`和`css-loader`
>
>- 加载image图像
>
>  在 webpack 5 中，可以使用**内置**的 [Asset Modules](https://webpack.docschina.org/guides/asset-modules/)，我们可以轻松地将这些内容混入我们的系统中：
>
>  ```js
>  {
>      test: /\.(png|svg|jpg|jpeg|git)$/i,
>      type: 'asset/resource'
>  }
>  ```
>
>- 加载fonts字体
>
>  ```js
>  {
>      test: /\.(woff|woff2|eot|ttf|otf)$/i,
>      type: 'asset/resource'
>  }
>  ```
>
>- 加载数据
>
>  此外，可以加载的有用资源还有数据，如JSON文件，CSV、TSV和XML。类似于Node.js，JSON支持实际上是内置的，也就是说`import Data from './data.json'`默认将正常运行。要导入CSV、TSV和XML，你可以使用csv-loader和xml-loader。
>
>  ```bash
>  npm install --save-dev csv-loader xml-loader
>  ```
>
>  ```js
>  {
>    test: /\.(csv|tsv)$/i,
>    use: ['csv-loader'],
>  },
>  {
>    test: /\.xml$/i,
>    use: ['xml-loader'],
>  }
>  ```
>
>  在使用d3等工具实现某些数据可视化时，这个功能极其有用。可以不用在运行时再去发送一个ajax请求获取和解析数据，而是在构建过程中将其提前加载到模块中，以便浏览器加载模块后，直接就可以访问解析过的数据。
>
>- 自定义JSON模块parser
>
>  通过使用 [自定义 parser](https://webpack.docschina.org/configuration/module/#ruleparserparse) 替代特定的 webpack loader，可以将任何 `toml`、`yaml` 或 `json5` 文件作为 JSON 模块导入。
>
>- 全局资源

#### 管理输出

>- 设置HtmlWebpackPlugin
>
>  如果更改了一个入口起点的名称，甚至添加了一个新的入口，会发生什么？会在构建时重新命名生成的 bundle，但是我们的 `index.html` 文件仍然引用旧的名称。让我们用 [`HtmlWebpackPlugin`](https://webpack.docschina.org/plugins/html-webpack-plugin) 来解决这个问题。
>
>  首先安装插件，并且调整 `webpack.config.js` 文件
>
>  `npm install --save-dev html-webpack-plugin`
>
>  ```diff
>  const path = require('path');
> +const HtmlWebpackPlugin = require('html-webpack-plugin');
>  
>  module.exports = {
>    entry: {
>      index: './src/index.js',
>      print: './src/print.js',
>    },
> +  plugins: [
> +    new HtmlWebpackPlugin({
> +      title: '管理输出',
> +    }),
> +  ],
>    output: {
>      filename: '[name].bundle.js',
>      path: path.resolve(__dirname, 'dist'),
>    },
>  };
>  ```
>
>  在我们构建之前，你应该了解，虽然在 `dist/` 文件夹我们已经有了 `index.html` 这个文件，然而 `HtmlWebpackPlugin` 还是会默认生成它自己的 `index.html` 文件。也就是说，它会用新生成的 `index.html` 文件，替换我们的原有文件，所有的 bundle 会自动添加到 html 中（下面代码中的index.bundle.js和print.bundle.js）
>
>  ```html
>  <!doctype html><html><head><meta charset="utf-8"><title>管理输出</title><meta name="viewport" content="width=device-width,initial-scale=1"><script defer="defer" src="index.bundle.js"></script><script defer="defer" src="print.bundle.js"></script></head><body></body></html>
>  ```
>
>- 清理`/dist`文件夹
>
>  由于遗留了之前的指南和代码示例，我们的 `/dist` 文件夹显得相当杂乱。webpack 将生成文件并放置在 `/dist` 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的。
>
>  通常比较推荐的做法是，在每次构建前清理 `/dist` 文件夹，这样只会生成用到的文件。让我们使用 [`output.clean`](https://webpack.docschina.org/configuration/output/#outputclean) 配置项实现这个需求。
>
>  ```diff
> output: {
>   filename: '[name].bundle.js',
>   path: path.resolve(__dirname, 'dist'),
> + clean: true1
> }
>  ```
>
>- mainifest
>
>   你可能会很感兴趣，webpack 和 webpack 插件似乎“知道”应该生成哪些文件。答案是，webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射。如果你想要知道如何以其他方式来控制 webpack [`输出`](https://webpack.docschina.org/configuration/output)，了解 manifest 是个好的开始。
> 
>    通过 [`WebpackManifestPlugin`](https://github.com/shellscape/webpack-manifest-plugin) 插件，可以将 manifest 数据提取为一个 json 文件以供使用。
> 

#### 开发环境

>本指南中的工具**仅用于开发环境**，请**不要**在生产环境中使用它们！
>
>- 使用source map
>
> 当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。例如，如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会直接指向到 `bundle.js`。你可能需要准确地知道错误来自于哪个源文件，所以这种提示这通常不会提供太多帮助。
>
> 为了更容易地追踪 error 和 warning，JavaScript 提供了 [source maps](http://blog.teamtreehouse.com/introduction-source-maps) 功能，可以将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。
>
> source map 有许多 [可用选项](https://webpack.docschina.org/configuration/devtool)，请务必仔细阅读它们，以便可以根据需要进行配置。
>
> 对于本指南，我们将使用 `inline-source-map` 选项，这有助于解释说明示例意图（此配置仅用于示例，不要用于生产环境）：
>
>  ```diff
> const path = require('path');
> const HtmlWebpackPlugin = require('html-webpack-plugin');
>  
> module.exports = {
> 	mode: 'development',
>     entry: {
>         index: './src/index.js',
>         print: './src/print.js',
>     },
> +   devtool: 'inline-source-map'
> ...
> };
>  ```
>
>- 选择一个开发工具
>
>  在每次编译代码时，手动运行 `npm run build` 会显得很麻烦。
>
>  webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：
>
>  1. webpack's [Watch Mode](https://webpack.docschina.org/configuration/watch/#watch)
>  2. [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
>  3. [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)
>
>  多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨探讨一下以上的所有选项。
>
>  - 使用watch mode（观察模式）
>
>    你可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。
>
>    我们添加一个用于启动 webpack watch mode 的 npm scripts：
>
>    ```diff
>    // package.json
>    {
>       "name": "webpack-demo",
>       "version": "1.0.0",
>       "description": "",
>       "private": true,
>       "scripts": {
>         "test": "echo \"Error: no test specified\" && exit 1",
>    +    "watch": "webpack --watch",
>         "build": "webpack"
>       }
>    }
>    ```
>
>    现在，你可以在命令行中运行 `npm run watch`，然后就会看到 webpack 是如何编译代码。 然而，你会发现并没有退出命令行。这是因为此 script 当前还在 watch 你的文件。
>
>    唯一的缺点是，为了看到修改后的实际效果，**你需要刷新浏览器**。如果能够自动刷新浏览器就更好了，因此接下来我们会尝试通过 `webpack-dev-server` 实现此功能。
>
>  - 使用webpack-dev-server
>
>    `webpack-dev-server` 为你提供了一个基本的 web server，并且具有 live reloading(实时重新加载) 功能。设置如下：
>
>    ```bash
>    npm install --save-dev webpack-dev-server
>    ```
>
>    修改配置文件，告知 dev server，从什么位置查找文件：
>
>    **webpack.config.js**
>
>    ```diff
>    const path = require('path');
>     const HtmlWebpackPlugin = require('html-webpack-plugin');
>    
>     module.exports = {
>       mode: 'development',
>       entry: {
>         index: './src/index.js',
>         print: './src/print.js',
>       },
>       devtool: 'inline-source-map',
>    +  devServer: {
>    +    contentBase: './dist',
>    +  },
>       plugins: [
>         new HtmlWebpackPlugin({
>           title: 'Development',
>         }),
>       ],
>       output: {
>         filename: '[name].bundle.js',
>         path: path.resolve(__dirname, 'dist'),
>         clean: true,
>       },
>     };
>    ```
>
>    以上配置告知 `webpack-dev-server`，将 `dist` 目录下的文件 serve 到 `localhost:8080` 下。（译注：serve，将资源作为 server 的可访问文件）
>
>    `webpack-dev-server` 会从 `output.path` 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 `http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]` 进行访问。
>
>    webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 [`publicPath`](https://webpack.docschina.org/configuration/dev-server/#devserverpublicpath-) 选项进行修改。
>
>    我们添加一个可以直接运行 dev server 的 script：
>
>    **package.json**
>
>    ```diff
>    {
>       "name": "webpack-demo",
>       "version": "1.0.0",
>       "description": "",
>       "private": true,
>       "scripts": {
>         "test": "echo \"Error: no test specified\" && exit 1",
>         "watch": "webpack --watch",
>    +    "start": "webpack serve --open",
>         "build": "webpack"
>       }
>     }
>    ```
>
>    现在，在命令行中运行 `npm start`，我们会看到浏览器自动加载页面。如果你更改任何源文件并保存它们，web server 将在编译代码后自动重新加载。试试看！
>
>    `webpack-dev-server` 具有许多可配置的选项。关于其他更多配置，请查看 [配置文档](https://webpack.docschina.org/configuration/dev-server)。
>
>    现在，server 正在运行，你可能需要尝试 [模块热替换(hot module replacement)](https://webpack.docschina.org/guides/hot-module-replacement)

#### 代码分离

>**代码分离是 webpack 中最引人注目的特性之一**。**此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。**
>
>常用的代码分离方法有三种：
>
>- **入口起点**：使用 [`entry`](https://webpack.docschina.org/configuration/entry-context) 配置手动地**分离**代码。
>- **防止重复**：使用 [Entry dependencies](https://webpack.docschina.org/configuration/entry-context/#dependencies) 或者 [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin) **去重和分离** chunk。
>- **动态导入**：通过模块的内联函数调用来**分离**代码。
>
>**入口起点**
>
>>这是迄今为止最简单直观的分离代码的方式。不过，这种方式手动配置较多，并有一些隐患，我们将会解决这些问题。
>
>>```diff
>>entry: {
>>    index: './src/index.js',
>>    print: './src/print.js'
>>},
>>output: {
>>    filename: '[name].bundle.js',
>>    path: path.resolve(__dirname, 'dist'),
>>}
>>```
>
>>正如前面提到的，这种方式存在一些隐患：
>
>>- 如果入口 chunk 之间包含一些重复的模块（如index.js和print.js引入了相同的内容），那些重复模块都会被引入到各个 bundle 中（即index.bundle.js和print.bundle.js文件）。
>>- 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。
>
>##### 防止重复
>
>- 去重
>
>  配置 [`dependOn` option](https://webpack.docschina.org/configuration/entry-context/#dependencies) 选项，这样可以在多个 chunk 之间**共享模块**：
>
>  ```diff
>  // webpack.config.js
>  // index.js和print.js引入了相同的lodash模块
>  const path = require('path');
>  
>   module.exports = {
>     mode: 'development',
>     entry: {
>  -    index: './src/index.js',
>  -    another: './src/another-module.js',
>  +    index: {
>  +      import: './src/index.js',
>  +      dependOn: 'shared',
>  +    },
>  +    another: {
>  +      import: './src/another-module.js',
>  +      dependOn: 'shared',
>  +    },
>  +    shared: 'lodash',
>     },
>     output: {
>       filename: '[name].bundle.js',
>       path: path.resolve(__dirname, 'dist'),
>     },
>   };
>  ```
>
>  如果我们要在一个 HTML 页面上使用多个入口时，还需设置 `optimization.runtimeChunk: 'single'`，否则还会遇到[这里](https://bundlers.tooling.report/code-splitting/multi-entry/)所述的麻烦。
>
>  ```diff
>  const path = require('path');
>  
>   module.exports = {
>     mode: 'development',
>     entry: {
>       index: {
>         import: './src/index.js',
>         dependOn: 'shared',
>       },
>       another: {
>         import: './src/another-module.js',
>         dependOn: 'shared',
>       },
>       shared: 'lodash',
>     },
>     output: {
>       filename: '[name].bundle.js',
>       path: path.resolve(__dirname, 'dist'),
>     },
>  +  optimization: {
>  +    runtimeChunk: 'single',
>  +  },
>   };
>  ```
>
>  构建结果：除了生成 `shared.bundle.js`，`index.bundle.js` 和 `another.bundle.js` 之外，还生成了一个 `runtime.bundle.js` 文件。
>
>  尽管可以在 webpack 中允许每个页面使用多入口，**应尽可能避免使用多入口的入口**：`entry: { page: ['./analytics', './app'] }`。如此，在使用 `async` 脚本标签时，会有更好的优化以及一致的执行顺序。
>
>- 分离
>
>  [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin) 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。让我们使用这个插件，将之前的示例中重复的 `lodash` 模块去除：
>
>  ```diff
>  const path = require('path');
>  
>    module.exports = {
>      mode: 'development',
>      entry: {
>        index: './src/index.js',
>        another: './src/another-module.js',
>      },
>      output: {
>        filename: '[name].bundle.js',
>        path: path.resolve(__dirname, 'dist'),
>      },
>  +   optimization: {
>  +     splitChunks: {
>  +       chunks: 'all',
>  +     },
>  +   },
>    };
>  ```
>
>  构建结果：`index.bundle.js` 和 `another.bundle.js` 中已经移除了重复的依赖模块。需要注意的是，插件将 `lodash` 分离到单独的 chunk，并且将其从 main bundle 中移除，减轻了大小。
>
>  以下是由社区提供，一些对于代码分离很有帮助的 plugin 和 loader：
>
>  - [`mini-css-extract-plugin`](https://webpack.docschina.org/guides/code-splitting/plugins/mini-css-extract-plugin): 用于将 CSS 从主应用程序中分离
>
>##### 动态导入
>
>当涉及到动态代码拆分时，webpack 提供了两个类似的技术。第一种，也是推荐选择的方式是，使用符合 [ECMAScript 提案](https://github.com/tc39/proposal-dynamic-import) 的 [`import()` 语法](https://webpack.docschina.org/api/module-methods/#import-1) 来实现动态导入。第二种，则是 webpack 的遗留功能，使用 webpack 特定的 [`require.ensure`](https://webpack.docschina.org/api/module-methods/#requireensure)。让我们先尝试使用第一种……
>
>`import()` 调用会在内部用到 [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。如果在旧版本浏览器中（例如，IE 11）使用 `import()`，记得使用一个 polyfill 库（例如 [es6-promise](https://github.com/stefanpenner/es6-promise) 或 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill)），来 shim `Promise`。
>
>现在，我们不再使用 statically import(静态导入) `lodash`，而是通过 dynamic import(动态导入) 来分离出一个 chunk：
>
>```diff
>// src/index.js
>- import _ from 'lodash';
>function getComponent() {
>  return import('lodash').then(({ default: _ }) => {
>    const element = document.createElement('div');
>    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
>    return element;
>  }).catch(error => 'An error occurred while loading the component')
>}
>getComponent().then(component => {
>  document.body.appendChild(component);
>})
>```
>
>我们之所以需要 `default`，是因为 webpack 4 在导入 CommonJS 模块时，将不再解析为 `module.exports` 的值，而是为 CommonJS 模块创建一个 artificial namespace 对象，更多有关背后原因的信息，请阅读 [webpack 4: import() and CommonJs](https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655)。
>
>由于 `import()` 会返回一个 promise，因此它可以和 [`async` 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)一起使用。下面是如何通过 async 函数简化代码：
>
>```js
>// src/index.js
>async function getComponent() {
>  const element = document.createElement('div')
>  const { default: _ } = await import('lodash')
>  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
>  return element
>}
>getComponent().then(component => {
>  document.body.appendChild(component);
>})
>```
>
>在稍后示例中，可能会根据计算后的变量(computed variable)导入特定模块时，可以通过向 `import()` 传入一个 [动态表达式](https://webpack.docschina.org/api/module-methods/#dynamic-expressions-in-import)。
>
>##### 预获取/预加载模块
>
>webpack v4.6.0+ 增加了对预获取和预加载的支持。
>
>在声明 import 时，使用下面这些内置指令，可以让 webpack 输出 "resource hint(资源提示)"，来告知浏览器：
>
>- **prefetch**(预获取)：将来某些导航下可能需要的资源
>- **preload**(预加载)：当前导航下可能需要资源
>
>```js
>import(/* webpackPrefetch: true */ './path/to/LoginModal.js')
>```
>
>这会生成 `<link rel="prefetch" href="login-modal-chunk.js">` 并追加到页面头部，指示着浏览器在闲置时间预取 `login-modal-chunk.js` 文件。
>
>只要父 chunk 完成加载，webpack 就会添加 prefetch hint(预取提示)。
>
>与 prefetch 指令相比，preload 指令有许多不同之处：
>
>- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
>- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
>- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
>- 浏览器支持程度不同。
>
>```js
>import(/* webpackPreload: true */ 'ChartingLibrary');
>```
>
>在页面中使用 `ChartComponent` 时，在请求 ChartComponent.js 的同时，还会通过 `<link rel="preload">` 请求 charting-library-chunk。假定 page-chunk 体积很小，很快就被加载好，页面此时就会显示 `LoadingIndicator(加载进度条)` ，等到 `charting-library-chunk` 请求完成，LoadingIndicator 组件才消失。启动仅需要很少的加载时间，因为只进行单次往返，而不是两次往返。尤其是在高延迟环境下
>
>不正确地使用 `webpackPreload` 会有损性能，请谨慎使用。
>
>##### bundle分析
>
>一旦开始分离代码，一件很有帮助的事情是，分析输出结果来检查模块在何处结束。 [官方分析工具](https://github.com/webpack/analyse) 是一个不错的开始。还有一些其他社区支持的可选项：
>
>- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack stats 可交互饼图。
>- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。
>- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)：一个 plugin 和 CLI 工具，它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式。
>- [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize)：这个工具会分析你的 bundle，并提供可操作的改进措施，以减少 bundle 的大小。
>- [bundle-stats](https://github.com/bundle-stats/bundle-stats)：生成一个 bundle 报告（bundle 大小、资源、模块），并比较不同构建之间的结果















