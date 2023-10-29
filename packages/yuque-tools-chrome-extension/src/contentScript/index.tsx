import ReactDOM from 'react-dom/client'
import App from './App'
import $ from 'jquery'

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

let root: any = null

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
    if ($('.header-crumb').length) {
      $('.header-crumb').after(`<div id="YuqueToolsTagManage"></div>`)
      root && root.unmount()
      root = ReactDOM.createRoot(document.getElementById('YuqueToolsTagManage') as HTMLElement)
      root.render(<App toolType="tagManage" />)
      clearInterval(timer)
    }
  }, 500)
}
