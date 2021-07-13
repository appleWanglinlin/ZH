import request, { axios } from '@/plugins/request'
import { uploadUrl } from '@/config/env'
import router from '@/router/router'

/**
 *
 * @typedef options
 * @property {object} options.data
 * @property {string} options.action
 * @property {function} options.onSuccess
 * @property {function} options.onError
 * @property {function} options.onProgress
 * @property {function} options.onFinish
 * @property {string} options.appName 应用名称，如 pms
 * @property {funciton} options.cancel 传入取消函数给 cancel，用于外部调用（取消请求）
 *
 * @param {options} option
 */
export default function(option) {
  const formData = new FormData()

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key])
    })
  }

  let cancelToken
  if (typeof option.cancel === 'function') {
    cancelToken = new axios.CancelToken(c => option.cancel(c))
  }

  formData.append(option.filename, option.file, option.file.name)

  request({
    url: option.action || uploadUrl,
    method: 'post',
    withCredentials: option.withCredentials,
    params: { fileType: option.appName || router.currentRoute.meta.appName || location.pathname.match(/^\/([\w-]+)/)[1] },
    data: formData,
    timeout: 2 * 60 * 1000, // 2分钟超时
    onUploadProgress(e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
      }
      option.onProgress(e)
    },
    cancelToken
  })
    .then(res => {
      if (option.action) {
        option.onSuccess(res)
      } else {
        option.onSuccess({ data: res.data?.link || '' })
      }
    })
    .catch(e => {
      option.onError(e)
    })
    .finally(() => {
      option.onFinish && option.onFinish()
    })
}
