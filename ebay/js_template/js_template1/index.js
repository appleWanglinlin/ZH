(function(window) {
  // tab栏切换
  function tabChange() {
    let hd = document.getElementById('hd')
    let bd = document.getElementById('bd')
    let spans = hd.getElementsByTagName('span')
    let divs = bd.getElementsByTagName('div')
    for(let i = 0; i < spans.length; i++) {
      let span = spans[i]
      span.index = i
      span.onclick = function() {
        for (let j = 0; j < spans.length; j++) {
          spans[j].className = ''
          divs[j].className = ''
        }
        this.className = 'current'
        divs[this.index].className = 'current'
      }
    }
  }
  // 轮播图
  function swiper() {
    let container = document.getElementById('container')
    let detail = document.getElementById('detail')
    let containerHeight = container.clientHeight
    let contents = container.getElementsByClassName('swiper-item')
    let details = detail.getElementsByClassName('swiper-desc')
    let mid = Math.floor(contents.length / 2)
    let pre = document.getElementById('pre')
    let next = document.getElementById('next')
    let rate = 0.8,
    distance = 210,
    midWidth = 190,
    midHeight = 190,
    midLeft = 335,
    currentIndex = mid
    let midStyle = 'width: 190px;height: 190px;line-height: 200px;top: 25px;left: 335px;opacity : 1;z-index: 20'
    function order() {
      contents = container.getElementsByClassName('swiper-item')
      contents[mid].style = midStyle
      details[mid].style = 'display: block'
      for (let i = 0; i < contents.length; i++) {
        let value = contents[i]
        let n = Math.abs(mid-i),
        r = Math.pow(rate,n).toFixed(1),
        posLeft = 0
        if (i !== mid) {
          let valueHeight = Math.round( r * midHeight ),
          valueWidth = Math.round( r * midWidth )
          if (i < mid) {
            posLeft = midLeft - n * (distance - n * 22)

          } else if(i > mid) {
            posLeft = midLeft + midWidth + n * (distance - n * 22) - valueWidth
          }
          let style = 'width:' + valueWidth + 'px;height:' + valueHeight + 'px;line-height:' + valueHeight + 'px;' +
          'left:' + posLeft + 'px;top:' + (containerHeight - valueHeight) / 2 + 'px;' +
          'z-Index:' + ( i > mid ? 20 - i : i ) + ';opacity:' + ( r-0.2 ).toFixed(1)
          value.setAttribute('style', style)
        }
      }
    }

    function changeDetail() {
      for(let i = 0; i < details.length; i++) {
        let item = details[i]
        item.style = 'display: none'
      }
      details[currentIndex].style = 'display: block'
    }

    pre.onclick = function handlePre() {
      container.insertBefore(contents[contents.length-1], contents[0]);
      --currentIndex
      if (currentIndex < 0) {
        currentIndex = details.length - 1
      }
      order()
      changeDetail()
    }
    next.onclick = function handleNext() {
      container.appendChild(contents[0]);
      ++currentIndex
      if (currentIndex >= details.length) {
        currentIndex = 0
      }
      order()
      changeDetail()
    }
    order()
  }

  tabChange()
  swiper()
})(window)