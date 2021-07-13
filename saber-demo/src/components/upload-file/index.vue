<template>
  <el-upload ref="upload"
             :disabled="isDisabled"
             :file-list="files"
             :accept="mime"
             :action="actionUrl"
             :headers="headers"
             :limit="limit"
             :on-success="onSuccess"
             :on-remove="onRemove"
             :on-error="onError"
             :on-progress="onProgress"
             :on-change="onChange"
             :before-upload="beforeUpload"
             :multiple="multiple"
             class="upload-file"
             :class="{disabled:isDisabled}"
  >
    <template v-if="!readonly">
      <el-button :size="buttonSize" plain type="primary">{{ buttonText }}</el-button>
      <slot :info="{size, displaySize}">
        <span v-if="size>0" slot="tip" class="el-upload__tip">上传文件不超过{{ displaySize }}</span>
      </slot>
    </template>
    <div slot="file" slot-scope="{ file }" class="file-item p-1">
      <div class="d-flex justify-content-between align-items-center">
        <div class="file-title el-icon-document">
          {{ file.name }}
        </div>
        <div v-show="loadedMapping[file.url]" class="action-btns">
          <i class="el-icon-circle-check mx-2" />
          <a v-if="download" :href="file.url" target="_blank" class="el-icon-download mx-2" />
          <a v-if="!isDisabled" href="javascript:;" class="el-icon-delete mx-2" @click="removeFile(file)" />
        </div>
      </div>
      <el-progress v-if="uploadingMapping[file.uid]" :percentage="uploadingMapping[file.uid]" :show-text="false" :stroke-width="1" />
    </div>
  </el-upload>
</template>

<script>
import request, { getAuthHeader } from '@/router/axios'
import { uploadUrl } from '@/config/env'

export default {
  inject: {
    elForm: {
      default: null
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    // 是否是只读（只能查看列表，不能上传和删除）
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 允许上传的文件类型
    mimetype: {
      type: String,
      default: undefined
    },
    // 是否是视频，为true时会忽略mimetype的设置
    video: {
      type: Boolean,
      default: false
    },
    // 上传文件数量限制，0不限制
    limit: {
      type: Number,
      default: 0
    },
    // 单个文件字节数限制，0不限制，单位: b
    size: {
      type: Number,
      default: 0
    },
    // 是否支持选择多个文件
    multiple: {
      type: Boolean,
      defualt: false
    },
    // 上传按钮的大小
    buttonSize: {
      type: String,
      default: 'small'
    },
    // 上传按钮的文本
    buttonText: {
      type: String,
      default: '点击上传'
    },
    // 是否显示下载按钮
    download: {
      type: Boolean,
      default: true
    },
    // 是否有正在上传的文件
    uploading: Boolean
  },
  data() {
    return {
      actionUrl: request.defaults.baseURL + uploadUrl + '?fileType=common',
      headers: getAuthHeader(),
      files: [],
      uploadedFiles: [],
      loadedMapping: {},
      uploadingMapping: {},
      mapping: {},
      preventWatch: false
    }
  },
  computed: {
    mime() {
      if (this.video) return '.avi,.mov,.rmvb,.rm,.flv,.mp4,.3gp'
      return this.mimetype
    },
    displaySize() {
      const size = this.size
      if (isNaN(size)) {
        return ''
      }
      // 小于1KB
      if (size < 1024) {
        return size + 'B'
      }
      // 小于1MB
      if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) - 0 + 'KB'
      }
      // 小于1G
      if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) - 0 + 'MB'
      }
      return (size / 1024 / 1024 / 1024).toFixed(2) - 0 + 'GB'
    },
    isDisabled() {
      return this.readonly || this.disabled || (this.elForm || {}).disabled
    }
  },
  watch: {
    uploadedFiles(val) {
      this.$emit('input', val)
    },
    value(newVal = []) {
      if (this.preventWatch) return
      // 当新值与files长度相等时可以理解为文件没有更新
      if (newVal.length === this.uploadedFiles.length) return
      this.uploadedFiles = this.buildFiles()
      this.files = this.buildFiles()
    }
  },
  created() {
    this.files = this.buildFiles()
    this.uploadedFiles = this.buildFiles()
  },
  methods: {
    buildFiles() {
      return this.value.map(item => {
        this.loadedMapping[item.url] = true
        const name = item.name || this.getFileNameFromUrl(item.url)
        return {
          url: item.url,
          name,
          filename: name
        }
      })
    },
    // 从返回的url中截取文件名
    getFileNameFromUrl(url) {
      const m = url.match(/[a-z\d]+\.\w+$/i)
      return m ? m[0] : url.slice(-10)
    },
    onError(err, file) {
      this.$message.error(`${file.name} ${err}`)
    },
    onSuccess(response, file) {
      this.preventWatch = true
      this.uploadedFiles.push({
        name: file.name || this.getFileNameFromUrl(response.data),
        url: response.data,
        filename: file.name
      })
    },
    onRemove(file) {
      if (file.status === 'ready') return false
      this.removeFile()
      return true
    },
    // 限制文件大小
    beforeUpload(file) {
      if (this.size === 0) return true
      if (file.size <= this.size) {
        return true
      } else {
        this.$message.error(`${file.name} 文件不能超过 ${this.displaySize}`)
        return false
      }
    },
    removeFile(file) {
      const index1 = this.$refs.upload.uploadFiles.findIndex(item => item.url === file.url)
      if (index1 > -1) {
        this.$refs.upload.uploadFiles.splice(index1, 1)
      }

      this.uploadedFiles = this.uploadedFiles.filter(item => {
        const url = file.response ? file.response.data : file.url
        return item.url !== url
      })
    },
    onProgress(event, file, fileList) {
      this.uploadingMapping[file.uid] = event.percent === 100 ? 0 : event.percent
    },
    onChange(file, fileList) {
      switch (file.status) {
        case 'ready':
          this.uploadingMapping[file.uid] = 0
          break
        case 'success':
          this.loadedMapping[file.response.url] = true
      }

      // 检查所有文件的上传状态，全部成功返回false
      const status = fileList.some(f => f.status !== 'success')
      this.$emit('update:uploading', status)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/element-var.scss';

.upload-file.disabled {
  ::v-deep {
    .el-upload {
      display: none;
    }
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
.el-upload__tip {
  margin-left: 1em;
}
.file-item {
  position: relative;
  .file-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 1rem;
    line-height: 1.4;
  }
  .action-btns {
    i {
      color: $--color-success;
    }
    a {
      display: none;
    }
  }
  &:hover {
    .action-btns {
      i {
        display: none;
      }
      a {
        display: inline;
      }
    }
  }
  ::v-deep {
    .el-progress--line {
      top: unset;
      bottom: 0px;
    }
  }
}
</style>
