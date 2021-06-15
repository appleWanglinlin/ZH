import _ from 'lodash'
import './style.css'
import Img from './pdx.png'
function component() {
  const element = document.createElement('div');

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello')
  const myImg = new Image()
  myImg.src = Img
  element.appendChild(myImg)
  return element;
}

document.body.appendChild(component());