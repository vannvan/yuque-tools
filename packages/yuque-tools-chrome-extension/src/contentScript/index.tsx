import ReactDOM from 'react-dom/client'
import App from './App'
import $ from 'jquery'
import { YUQUE_ICON } from '@/utils/dict'

const locationObserver = () => {
  let oldHref: any = null
  const bodyList: any = document.querySelector('body'),
    observer = new MutationObserver(function (mutations) {
      if (oldHref != location.pathname) {
        oldHref = location.pathname
        $('#YuqueToolsTagManage')?.remove()
        setTimeout(() => {
          dispatchTool()
        }, 2000)
      }
    })
  const config = {
    childList: true,
    subtree: true,
  }
  observer.observe(bodyList, config)
}

locationObserver()

const root: any = {
  tagManage: null,
  globalButton: null,
}

const dispatchTool = () => {
  // TODO 这里要采取其他方式判断当前页面是文档页面
  let timer: any = null
  let count = 0
  timer = setInterval(() => {
    if (count === 10) {
      clearInterval(timer)
      return
    }

    count++
    // 文档详情页面
    if ($('.header-crumb').length) {
      $('.header-crumb').after(`<div id="YuqueToolsTagManage"></div>`)
      root.tagManage && root.tagManage.unmount()
      root.tagManage = ReactDOM.createRoot(
        document.getElementById('YuqueToolsTagManage') as HTMLElement
      )
      root.tagManage.render(<App toolType="tagManage" />)
      clearInterval(timer)
    }

    // 文档管理页面
    if ($("div[class^='TempStore-module_mainWrapper']").length) {
      $('body').click((e) => {
        if (/已选择/.test($('.select-tip-wrapper').text())) {
          if (!$('#YuqueToolsExportButton').length) {
            $('.selected-actions').prepend(`<a id="YuqueToolsExportButton" class="action">
              ${YUQUE_ICON.export}导出
            </a>`)
          }
        }
      })
    }
  }, 500)

  // 生成一个全局工具按钮
  if (!$('#YuqueToolsGlobalButton').length) {
    $('body').after(
      `<div id="YuqueToolsGlobalButton" style="position: fixed; bottom: 108px; right: 24px"></div>`
    )
    root.globalButton && root.globalButton.unmount()
    root.globalButton = ReactDOM.createRoot(
      document.getElementById('YuqueToolsGlobalButton') as HTMLElement
    )
    root.globalButton.render(<App toolType="globalButton" />)
  }
}
