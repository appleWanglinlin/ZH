import themes, { varMapping } from '@/config/theme'
import { setStore, getStore } from '@/util/store'
import { getObjType } from '@/util/util'

const uiKeyName = 'ui'
const themeKeyName = 'theme'
const styleElementId = 'custom-theme'

/**
 * 将hex格式转换成rgba
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param {string} hex HEX格式的颜色值，如: #fff, #00ff00
 * @param {*} opacity 透明度，不能大于1
 * @returns {string}
 */
export function hexToRgba(hex, opacity = 1) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `rgba(${result.slice(1).map(el => parseInt(el, 16)).join(',')},${opacity})`
  }
  return null
}

// 重写elementui主色调
function rewriteStyle(primary) {
  const color = 'var(--color-primary)'
  const lighten1 = hexToRgba(primary, 0.1)
  const lighten2 = hexToRgba(primary, 0.2)
  const lighten4 = hexToRgba(primary, 0.4)
  const lighten85 = hexToRgba(primary, 0.85)
  const mapping = {
    c: 'color:var(--color-primary);',
    bgc: 'background-color:var(--color-primary);',
    bc: 'border-color:var(--color-primary);'
  }
  return `
.avue-tags .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{${mapping.c}border-bottom-color:${color}}
.el-button-group .el-button:hover,
.el-button-group .el-button--primary + .el-button:hover,
.el-button.el-button--default:hover,.el-button.el-button--default:focus,
.el-button--primary.is-plain:hover, .el-button--primary.is-plain:focus,
.el-button--primary.is-plain{background-color:${lighten1};border-color:${hexToRgba(primary, 0.5)};${mapping.c}}
.el-button--text:focus, .el-button--text:hover{${mapping.c}}
.el-button--primary,.el-button--primary:focus{${mapping.bgc + mapping.bc}}
.el-button.el-button--primary:hover{background-color:${lighten85};border-color:${lighten85};color:#fff;}
.el-button.el-button--primary:disabled{background-color:${lighten4};border-color:${lighten2}}
.el-button--text{color:${lighten85}}
.el-button--text:hover{${mapping.c}}
.el-input.is-focus .el-input__inner,
.el-input .el-input__inner:focus,
.el-textarea__inner:focus{border-color:${hexToRgba(primary, 0.9)}!important;}
/*.el-tree .el-tree-node.is-checked>.el-tree-node__content{${mapping.c}}*/

.el-tabs__item.is-active{${mapping.c}}
.el-tabs__active-bar{${mapping.bgc}}
.el-tabs__item:hover{${mapping.c}}

.el-radio__input.is-checked .el-radio__inner,
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner,
.el-switch.is-checked .el-switch__core{${mapping.bgc + mapping.bc}}
.el-radio__inner:hover,
.el-checkbox__input.is-focus .el-checkbox__inner,
.el-checkbox__inner:hover{${mapping.bc}}
.el-checkbox__input.is-checked+.el-checkbox__label{${mapping.c}}
.el-radio__input.is-checked + .el-radio__label{${mapping.c}}
.el-radio-group .el-radio-button.is-active .el-radio-button__inner,
.el-checkbox-button.is-checked .el-checkbox-button__inner
{${mapping.bgc + mapping.bc}box-shadow:-1px 0 0 0 ${lighten2};}
.el-radio-button__inner:hover{${mapping.c}}
.el-radio.is-bordered.is-checked{${mapping.bc}}

.el-checkbox.is-bordered.is-checked,.el-checkbox-button.is-focus .el-checkbox-button__inner{${mapping.bc}}
.el-checkbox-button__inner:hover{${mapping.c}}
.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner{border-left-color:${color}}

.el-input-number__increase:hover, .el-input-number__decrease:hover{${mapping.c}}
.el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled), .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled){${mapping.bc}}

.el-switch__label.is-active{${mapping.c}}

.el-slider__button{${mapping.bc}}
.el-slider__bar{${mapping.bgc}}

.el-date-table td.today span,
.el-date-table td.available:hover,
.el-date-picker__header-label:hover,
.el-picker-panel__icon-btn:hover{${mapping.c}}
.el-date-table td.current:not(.disabled) span{${mapping.bgc}}

.el-transfer-panel__item:hover{${mapping.c}}

.el-select-dropdown__item.selected{${mapping.c}}

.el-cascader-node.in-active-path, .el-cascader-node.is-selectable.in-checked-path, .el-cascader-node.is-active{${mapping.c}}
.el-pagination__sizes .el-input .el-input__inner:hover{${mapping.bc}}
.el-pager li.active,.el-pager li:hover,.el-pagination button:hover{${mapping.c}}
.el-loading-spinner .path{stroke:${color}}

.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{${mapping.c}}

.el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:focus{${mapping.c}background-color:${lighten1}}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
.el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover{${mapping.c}}

.el-tag--light{${mapping.c}border-color:${lighten1};background-color:${lighten1}}
.el-tag--light .el-tag__close{${mapping.c}}
.el-tag--light .el-tag__close:hover{${mapping.bgc}color:#fff;}

.el-tag--dark{${mapping.bgc + mapping.bc}color:#fff;}
.el-tag--dark .el-tag__close:hover{background-color:rgba(255,255,255,0.3)}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{content:'\\e763';}

#nprogress .bar{background-color:${color}!important;}

.text-primary{color:${color}!important;}
.el-link.el-link--primary{${mapping.c}}
.el-link.el-link--primary:hover{color:${lighten85}}
.border-primary{border-color:${color}!important;}
`
}

/**
 * 初始时设置主题
 */
export function initTheme() {
  setTheme(ui.get(themeKeyName) || themes[0].key)
}

/**
 * 设置主题
 * @param {string} themeKey 主题的key
 */
export function setTheme(themeKey = '') {
  const data = themes.find(item => item.key === themeKey)
  if (data) {
    ui.set({ [themeKeyName]: themeKey })
    const style = document.getElementById(styleElementId) || document.createElement('style')
    style.id = styleElementId
    const cssVars = [`--color-primary:${data.primary};`]
    const cssStyles = []
    Object.entries(data.vars).forEach(([key, val]) => {
      cssVars.push(`${varMapping[key]}: ${val};`)
    })

    style.textContent = `:root{${cssVars.join('\n')}}\n${cssStyles.join('\n')}` + rewriteStyle(data.primary)
    document.head.appendChild(style)
  }
}

/**
 * 移除主题样式
 * @param {boolean} removeStore 是否删除localStorage中的值，默认`false`
 */
export function removeTheme(isRemoveStore = false) {
  document.head.removeChild(document.getElementById(styleElementId))
  isRemoveStore && ui.remove(themeKeyName)
}

// 统一处理UI相关的本地存储
export const ui = {
  set(options) {
    if (getObjType(options) === 'object') {
      const localOptions = this.get()
      setStore({ name: uiKeyName, type: 'local', content: Object.assign(localOptions, options) })
    }
  },
  get(key) {
    const val = getStore({ name: uiKeyName, type: 'local' })
    const obj = typeof val === 'object' ? val : {}
    return key ? obj[key] : obj
  },
  remove(...keys) {
    const localOptions = this.get()
    keys.forEach(k => {
      delete localOptions[k]
    })
    setStore({ name: uiKeyName, type: 'local', content: localOptions })
  }
}
