<template>
  <div class="upload-img-wrap">
    <template v-if="!readonly">
      <p class="error-tips">
        <template v-if="hasTitle">
          <span v-if="isRequiredImg"> * </span> 图片信息{{ limit ?`（${isRequiredImg?'请至少上传一张图片，':''}最多上传${ limit }张图片）`: '' }}
        </template>
        <span :class="!errorTips ? 'imgTips' : ''">请至少上传一张图片</span>
      </p>
    </template>
    <!-- 上传图片开始 -->
    <el-upload
      ref="imgUploadRef"
      :disabled="readonly"
      :auto-upload="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-progress="progressHandler"
      :limit="limit"
      :multiple="true"
      :file-list="files"
      :accept="acceptImgType"
      :headers="headers"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :class="{readonly}"
      class="upload-img"
      list-type="picture-card"
    >
      <i v-if="!readonly" class="el-icon-plus" />
      <div slot="file" slot-scope="{ file }" class="scopeClass">
        <i v-if="isAutoCheck && defaultFile === file" class="el-icon-check main-img" />
        <img :src="file.url" alt="" width="100%" height="118px">
        <span class="name">{{ file.name }}</span>
        <span v-if="!uploadingMapping[file.uid]" class="el-upload-list__item-actions">
          <span v-if="showCheckIcon&&!readonly" class="el-upload-list__item-preview" @click="setMainImg(files, file)">
            <i class="el-icon-check" />
          </span>
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="ifCanDelete&&!readonly" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete" />
          </span>
        </span>
        <el-progress v-if="uploadingMapping[file.uid]" :percentage="uploadingMapping[file.uid]" :show-text="false" :stroke-width="3" />
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :fullscreen="true" class="img-dialog">
      <!-- width="60vw" height="500px" -->
      <img :src="dialogImageUrl" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 上传图片结束 -->
  </div>
</template>

<script>
import request, { getAuthHeader } from '@/router/axios'
import { uploadUrl } from '@/config/env'

export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 0
    },
    acceptImgType: {
      type: String,
      default: '.jpg,.jpeg,.png,.bmp,.webp,.gif'
    },
    uploadUrl: {
      type: String,
      default: request.defaults.baseURL + uploadUrl + '?fileType=common'
    },
    files: Array,
    $key: [String, Number],
    hasTitle: {
      type: Boolean,
      default: true
    },
    isPlus: {
      type: Boolean,
      default: true
    },
    showCheckIcon: { // check icon
      type: Boolean,
      default: true
    },
    isRequiredImg: { // 图片是否必填
      type: Boolean,
      default: true
    },
    ifCanDelete: {
      type: Boolean,
      default: true
    },
    isAutoCheck: {
      type: Boolean,
      default: true
    },
    // 限制上传文件的最大字节数
    maxSize: {
      type: Number,
      default: 0
    },
    // 是否是只读
    readonly: {
      type: Boolean,
      default: false
    },
    imgWidth: Array, // [min, max]
    imgHeight: Array, // [min, max]
    // 是否有正在上传的文件
    uploading: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      headers: getAuthHeader(),
      defaultFile: null,
      errorTips: false,
      uploadingMapping: {}
    }
  },
  watch: {
    isPlus: {
      handler(bool) {
        this.switchPlus(bool)
      }
    },
    files(arr) {
      if (arr.length === 0) {
        this.defaultFile = null
      }
      this.errorTips = this.isRequiredImg && arr.length === 0
    },
    // check icon 是否隐藏显示
    showCheckIcon(bool) {
      document.querySelector('.el-upload-list__item-preview>.el-icon-check').style.display = bool ? 'inline-block' : 'none'
    }
  },
  created() {
    const { files } = this
    if (!Array.isArray(files)) return
    for (let i = 0; i < files.length; i++) {
      if (files[i].isPrime === 1) {
        this.setMainImg(files, files[i])
        break
      }
    }
  },
  mounted() {
    const { files } = this
    if (!Array.isArray(files)) return
    for (let i = 0; i < files.length; i++) {
      if (files[i].isPrime === 1) {
        this.setMainImg(files, files[i])
        break
      }
    }
    this.switchPlus(this.isPlus)
  },
  methods: {
    switchPlus(bool) {
      document.querySelector('.upload-img>div').style.display = bool ? 'inline-block' : 'none'
      document.querySelector('.upload-img>ul').style.marginLeft = bool ? '128px' : '0'
    },
    handleRemove(file) {
      if (file.status === 'ready') return false
      this.$confirm(`确定移除 ${file.name}？`).then(() => {
        for (let i = 0; i < this.files.length; i++) {
          if (file.uid === this.files[i].uid) {
            if (this.defaultFile === file && this.files.length > 1) {
              if (i === 0) {
                this.files[1].isPrime = 1
              } else {
                this.files[0].isPrime = 1
              }
            }
            this.$emit('updateFiles', i, this.$key)
          }
        }
        // 移除的是主图图片 则 重新 赋值
        if (this.defaultFile === file) {
          this.defaultFile = this.files.length ? this.files[0] : null
        }
      }).catch(console.error)
    },
    uploadSuccess(res, file, files) {
      const successedFiles = files.filter(f => f.status === 'success')

      if (this.defaultFile === null) {
        this.defaultFile = successedFiles[0]
      }

      if (files.length === successedFiles.length) {
        this.updateUploadingStatus(false)
      }

      file.name = file.raw.real_name
      this.setMainImg(files, this.defaultFile)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    setMainImg(files = [], file) {
      // 当两个属性都为false时，不会设置 isPrimary
      if (this.isAutoCheck || this.showCheckIcon) {
        this.defaultFile = file
        files.map(item => {
          if (item.uid === file.uid) item.isPrime = 1
          else item.isPrime = 0
          return item
        })
      }
      this.$emit('updateFiles', files, this.$key)
    },
    handleExceed(files, fileList) {
      if (!this.limit) return
      this.$message.warning(`当前限制只能选择 ${this.limit} 个文件`)
    },
    // eslint-disable-next-line handle-callback-err
    uploadError(err, file, fileList) {
      if (file.status === 'fail') this.$message.error('图片上传失败')
    },
    // 上传前检测文件大小
    async beforeUpload(file) {
      if (this.maxSize !== 0 && file.size > this.maxSize) {
        const errMsg = `${file.name}文件不能超过${this.maxSize / 1024 / 1024}MB`
        this.$message.error(errMsg)
        throw new Error(errMsg)
      }
      // 判断是否超过规定图片大小
      await this.ifOverSize(file)
      this.updateUploadingStatus(true)
      return true
    },
    ifOverSize(file) {
      const { imgWidth, imgHeight } = this
      const _URL = window.URL || window.webkitURL || window.mozURL
      const img = new Image()
      img.src = _URL.createObjectURL(file)
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const name = file.name.split(/\.\w{3,4}$/)[0]
          const type = file.name.split(name)[1]
          file.real_name = `${name}_${img.width}x${img.height}${type}`
          const { width, height } = img
          if (imgWidth || imgWidth) {
            const [minW, maxW] = imgWidth
            const [minH, maxH] = imgHeight
            const errors = []

            const tip = (c, s) => c ? `${s}必须为${minW}` : `${s}必须在${minW} - ${maxW}之间`
            if (width < minW || width > maxW) {
              errors.push(tip(minW === maxW, '宽度'))
            }

            if (height < minH || height > maxH) {
              errors.push(tip(minH === maxH, '高度'))
            }

            if (errors.length > 0) {
              const errMsg = `图片尺寸${errors.join('，')}，当前图片大小为${width}*${height}`
              this.$message.error(errMsg)
              return reject(new Error(errMsg))
            }
          }
          resolve()
        }
      })
    },
    // 返回false表示校验未通过
    validate() {
      const status = this.isRequiredImg && this.files.length === 0
      this.errorTips = status
      return !status
    },
    // 清空 上传列表 和 错误信息
    reset() {
      this.$emit('updateFiles', [], this.$key)
      this.$nextTick(() => {
        this.errorTips = false
      })
    },
    progressHandler(event, file, fileList) {
      this.uploadingMapping[file.uid] = event.percent === 100 ? undefined : event.percent
    },
    updateUploadingStatus(status) {
      this.$emit('update:uploading', status)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-img-wrap {
  .readonly ::v-deep {
    .el-upload-list--picture-card {
      margin-left: 0!important;
    }
    .el-upload {
      display: none !important;
    }
  }
  p.error-tips {
    margin-top: 0;
    color: #606266;
    font-size: 1rem;
    span {
      color: #f56c6c;
      &.imgTips {
        display: none;
      }
    }
  }

  ::v-deep .upload-img {
    position: relative;
    min-height: 120px;
    & > ul {
      margin-left: 128px;
      font-size: 0;
    }
    & > div {
      position: absolute;
      top: 0;
      left: 0;
    }
    li {
      width: 120px;
      height: 120px;
      box-sizing: border-box;
    }
    .scopeClass {
      position: relative;
      height: 120px;
      box-sizing: border-box;
      background-color: #afb;
      .main-img {
        position: absolute;
        left: 0;
        top: 0;
        line-height: initial;
        color: #000;
        font-size: 24px;
        font-weight: bold;
        border-radius: 6px 0;
        background-color: #fff;
      }
      .name {
        width: 100%;
        max-height: 16px;
        position: absolute;
        bottom: 2px;
        left: 0;
        color: #fff;
        // word-break: break-all;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        transition: max-height .3s;
        -moz-transition: max-height .3s; /* Firefox 4 */
        -webkit-transition: max-height .3s; /* Safari 和 Chrome */
        -o-transition: max-height .3s; /* Opera */

        font-size: 14px;
        line-height: 16px;
        padding: 0 2px;
        box-sizing: border-box;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.3);
        &:hover{
          max-height: 100%;
          word-break: break-all;
          overflow: visible;
          text-overflow: clip;
          white-space: normal;
        }
      }
      ::v-deep .el-progress--line {
        top: unset;
        bottom: 0px;
        z-index: 1000;
      }
    }
    div.el-upload {
      width: 120px;
      height: 120px;
      line-height: 120px;
    }
  }
}
</style>
