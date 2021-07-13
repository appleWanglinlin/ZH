// 判断是否为图片格式--img标签可打开的
export function isImage(str) {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/
  return reg.test(str)
}
