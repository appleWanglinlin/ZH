// 配置编译环境和线上环境之间的切换

// 统一管理通过DefinePlugin定义的变量
/* global __SAAS__ */
/* global __BUILD_TIME__ */
export const env = process.env

/**
 * 是否是SaaS平台
 * @type {boolean}
 */
export const isSaas = __SAAS__

export const uploadUrl = (isSaas ? '/ops-resource' : '') + '/oss/endpoint/put-file'

/**
 * @type {number} 构建时间（毫秒数）
 */
export const buildTime = __BUILD_TIME__
