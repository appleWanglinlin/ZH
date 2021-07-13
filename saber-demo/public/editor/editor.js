/* global wangEditor */
/* eslint-disable no-unused-vars */

const types = {
  OL: {
    icon: 'w-e-icon-list-numbered',
    title: '有序列表'
  },
  UL: {
    icon: 'w-e-icon-list2',
    title: '无序列表'
  }
}

// 自定义有序和无序列表按钮
function getCustomListMenu() {
  // 同一个Editor实例共用一个List实例
  let listInstance = null
  return (orderType = 'UL') => {
    orderType = orderType.toUpperCase()
    return class CustomListMenu extends wangEditor.BtnMenu {
      constructor(editor) {
        const $elem = wangEditor.$(
              `<div class="w-e-menu" data-title="${editor.i18next.t('menus.dropListMenu.list.' + types[orderType].title)}">
                <button type="button" class="custom-reset position-absolute top-0 left-0 w-100 h-100 border-0 bg-transparent">
                  <i class="${types[orderType].icon}"></i>
                </button>
              </div>`
        )
        super($elem, editor)

        if (listInstance === null) {
          /* eslint new-cap: 0 */
          listInstance = new editor.menus.constructorList.list(editor)
        }
        this.orderType = orderType
      }

      // 菜单点击事件
      clickHandler() {
        const selection = window.getSelection()
        if (selection.type === 'None') return

        const selectionObj = selection.getRangeAt(0)
        const childNodes = selectionObj.commonAncestorContainer.childNodes
        const container = this.editor.selection.getSelectionContainerElem().selector
        let replacing = false
        const willBeRemoved = []
        const ul = document.createElement(this.orderType)
        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i]
          if (node === selectionObj.startContainer) {
            replacing = true
          }
          if (replacing) {
            if (node.nodeName !== 'BR') {
              const li = document.createElement('li')
              li.appendChild(node.cloneNode())
              ul.appendChild(li)
            }
            willBeRemoved.push(node)
          }

          if (node === selectionObj.endContainer) {
            replacing = false
            // 移除选中后面的换行
            const nextSibling = childNodes[i + 1]
            if (nextSibling && nextSibling.nodeName === 'BR') {
              willBeRemoved.push(nextSibling)
            }
          }
        }

        // 没有可移除的node，则调用list实例的方法
        if (willBeRemoved.length === 0) {
          listInstance.command(this.orderType)
        } else {
          willBeRemoved.forEach((item, index) => {
            if (index === 0) {
              // 将第一个匹配到的node 替换为 列表
              container.replaceChild(ul, item)
            } else {
              container.removeChild(item)
            }
          })

          const content = this.editor.txt.html()
          this.editor.txt.clear()
          this.editor.txt.html(content)
        }
      }

      tryChangeActive() {

      }
    }
  }
}

// 自定义源码按钮
function getCustomBtn() {
  class CodeMenu extends wangEditor.BtnMenu {
    constructor(editor) {
      const $elem = wangEditor.$(
            `<div class="w-e-menu" data-title="源码">
            <?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 13L4 25.4322L16 37" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 13L44 25.4322L32 37" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 4L21 44" stroke="#333" stroke-width="2" stroke-linecap="round"/></svg>
            </div>`
      )
      super($elem, editor)
      this.isCode = false
      this.textareaDom = null
    }

    clickHandler() {
      this.isCode = !this.isCode

      this.$elem.elems[0].classList.toggle('code-active')
      var editorHtml = this.editor.txt.html()
      const dom = this.editor.$textElem.elems[0].parentElement
      if (!this.isCode) {
        const content = dom.nextElementSibling.value
        dom.style.display = 'block'
        dom.nextElementSibling.style.display = 'none'
        this.editor.txt.html(content)
      } else {
        if (!this.textareaDom) {
          this.textareaDom = document.createElement('textarea')
          this.textareaDom.className = 'custom-container'
          this.textareaDom.value = editorHtml
          this.textareaDom.addEventListener('change', (e) => {
            this.editor.txt.html(e.target.value)
          })
          dom.parentElement.appendChild(this.textareaDom)
        } else {
          this.textareaDom.value = editorHtml
          this.textareaDom.style.display = 'block'
        }
        dom.style.display = 'none'
      }
    }

    tryChangeActive() {
      this.active()
    }
  }

  // 重写全屏按钮
  class Screen extends wangEditor.BtnMenu {
    constructor(editor) {
      const $elem = wangEditor.$(
        `<div class="w-e-menu" data-title="全屏">
        <i class="w-e-icon-fullscreen"></i>
        </div>`
      )
      super($elem, editor)
      this.isFullScreen = false
    }

    clickHandler() {
      this.isFullScreen = !this.isFullScreen
      const el = this.$elem.elems[0]
      el.firstElementChild.className = this.isFullScreen ? 'w-e-icon-fullscreen_exit' : 'w-e-icon-fullscreen'
      el.dataset.title = this.isFullScreen ? '取消全屏' : '全屏'
      this.isFullScreen ? this.editor.fullScreen() : this.editor.unFullScreen()
      this.editor.vueInstance.fullscreenHandler(this.isFullScreen)
    }

    tryChangeActive() {

    }
  }

  return [
    { key: 'CodeMenu', val: CodeMenu },
    { key: 'ScreenMenu', val: Screen }
  ]
}

/**
 * 初始化
 * @param {object} config
 */
function initEditor(config) {
  const E = wangEditor
  const editor = new E('#editor')
  editor.vueInstance = config

  if (this.isDisabled) {
    editor.config.menus = []
  } else {
  // 自定义有序和无序按钮 替代 自带的 序列 按钮
    const customListMenu = getCustomListMenu()
    E.registerMenu('ol', customListMenu('OL'))
    E.registerMenu('ul', customListMenu('UL'))

    // 自定义其他按钮
    getCustomBtn().forEach(function(item) {
      E.registerMenu(item.key, item.val)
    })
  }

  // 插入图片 处理
  editor.config.uploadImgHooks.customInsert = (insertImgFn, result) => {
    insertImgFn(config.forceProtocol(result))
  }

  // 粘贴时 处理
  editor.config.pasteTextHandle = (pasteStr) => {
    return config.replaceAllImgProtocol(pasteStr)
  }

  // 配置编辑器参数
  Object.assign(
    editor.config,
    {
      zIndex: 1,
      placeholder: '',
      focus: false,
      excludeMenus: ['list', 'code']
    },
    config.customConfig,
    {
      onchange: config.onchange,
      onblur: config.onblur,
      onfocus: () => config.$emit('focus'),
      uploadImgMaxLength: 1,
      pasteIgnoreImg: config.pasteIgnoreImg,
      customUploadImg: config.httpRequest ? config.customUploadImg : undefined,
      showFullScreen: false,
      height: 'calc(100% - 42px)'
    }
  )

  // 创建编辑器
  editor.create()
  editor.txt.html(config.replaceAllImgProtocol(config.value))

  if (config.isDisabled) editor.disable()
  
  return editor
}
