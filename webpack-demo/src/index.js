import _ from 'lodash'
// import './style.css'
// import Img from './pdx.png'
import printMe from './print'
function component() {
  const element = document.createElement('div');
  // const btn = document.createElement('div')
  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello')
  // btn.innerHTML = 'Click me and check the console!'
  // btn.onclick = printMe
  // element.appendChild(btn)
  // const myImg = new Image()
  // myImg.src = Img
  // element.appendChild(myImg)
  return element;
}

document.body.appendChild(component());