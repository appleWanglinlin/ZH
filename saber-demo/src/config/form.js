// 表单相关的配置

/**
 * 字数限制
 */
export const LIMIT = {
  /**
   * 标题、关键词 等
   */
  title: 500,
  /**
   * 描述、feature描述 等
   */
  content: 2000,
  /**
   * 最多上传图片数量
   */
  maxUploadImages: 12,
  /**
   * 名称 店铺名称 等
  */
  name: 100
}

/**
 * 上传文件大小限制
 */
export const LIMIT_FILE_SIZE = {
  /**
   * 图片
   */
  image: 10 * 1024 * 1024, // 10MB
  /**
   * 视频
   */
  video: 1 * 1024 * 1024 * 1024, // 1G
  /**
   * 附件
   */
  attachment: 1 * 1024 * 1024 * 1024 // 1G
}
