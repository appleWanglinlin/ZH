
/**
 * 生成水印背景图片
 * @param {string} options.text 水印文字
 * @returns {string}  Base64 Image Url
 */
function create(text) {
  const FONTFAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
  const WIDTH = 500
  const HEIGHT = 200
  const SIZE = 14

  const canvas = window.document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  ctx.fillStyle = '#ededed'

  // 旋转
  const circleX = WIDTH / 2
  const circleY = HEIGHT / 2
  ctx.translate(circleX, circleY)
  ctx.rotate(-25 * Math.PI / 180)
  ctx.font = SIZE + 'px ' + FONTFAMILY
  ctx.textAlign = 'center'
  ctx.fillText(text, -50, -50)
  ctx.fillText(text, -150, -150)
  ctx.fillText(text, 56, 62)
  ctx.fillText(text, 140, 150)
  ctx.translate(-circleX, -circleY)

  return canvas.toDataURL('image/png')
}

export default (text = '') => {
  const imgUrl = create(text)
  const style = document.createElement('style')
  const selector = ['watermark-bg', 'td', '.el-tab-pane', '.el-tree', '.el-table__body-wrapper', '.el-card__body', '.el-dialog__body']
  style.textContent = `${selector.join(',')}{background-image:url(${imgUrl})!important;background-position:left center;background-attachment:fixed}`
  document.head.appendChild(style)
}
