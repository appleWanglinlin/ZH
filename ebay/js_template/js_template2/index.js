(function(window){
  function viewBigImg() {
    let img_small = document.getElementById('img_small')
    let img_big = document.getElementById('img_big')
    let imgSmallList = img_small.getElementsByTagName('div')
    let imgBigList = img_big.getElementsByTagName('div')
    for(let i = 0; i < imgSmallList.length; i++) {
      let smallItem = imgSmallList[i]
      smallItem.onclick = function() {
        for(let j = 0; j < imgBigList.length; j++) {
          let bigItem = imgBigList[j]
          bigItem.style = 'display: none'
        }
        imgBigList[i].style = 'display: block'
      }
    }
  }

  function changeTab() {
    let hd = document.getElementById('hd')
    let bd = document.getElementById('bd')
    let spans = hd.getElementsByTagName('span')
    let divs = bd.getElementsByTagName('div')
    for(let i = 0; i < spans.length; i++) {
      let span = spans[i]
      span.index = i
      span.onclick = function() {
        for(let j = 0; j < spans.length; j++) {
          spans[j].className = ''
          divs[j].className = ''
        }
        this.className = 'current'
        divs[this.index].className = 'current'
      }
    }
  }

  viewBigImg()
  changeTab()
})(window)