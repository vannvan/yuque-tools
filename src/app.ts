#!/usr/bin/env node
import {
  delayedDownloadDoc,
  delayedGetDocCommands,
  getLocalCookies,
  inquireAccount,
  inquireBooks,
  Log,
  setJSONString,
} from './lib/tool.js'
import { config as CONFIG } from './config.js'
import F from './lib/file.js'
import path from 'path'
import { getBookStacks, loginYuque } from './lib/yuque.js'
import { IAccountInfo } from './lib/type.js'
;(async () => {
  Log.info('开始登录语雀')
  // load account info from argv
  const [userName, password] = [process.argv[2], process.argv[3]]
  let accountInfo: IAccountInfo = {
    userName,
    password,
  }

  // load account info from yuque.config.json
  const isExitConfig = await F.isExit(path.resolve(CONFIG.localConfig))
  if (isExitConfig) {
    const configUserInfo = JSON.parse(F.read(path.resolve(CONFIG.localConfig)))
    accountInfo = {
      ...configUserInfo,
    }
  }

  // exit docs dir?
  const docExit = await F.isExit(path.resolve(CONFIG.outputDir))

  // is need login yuque?
  let needLogin = true

  if (!docExit) {
    await F.mkdir(path.resolve(CONFIG.outputDir))
    await F.mkdir(path.resolve(CONFIG.metaDir))
  } else {
    const cookie = getLocalCookies()
    // is expired
    if (cookie && cookie?.expired > Date.now()) {
      needLogin = true
    }
  }

  const ask = async () => {
    if (!(await F.isExit(CONFIG.bookInfoFile))) {
      await getBook()
    }
    const localBook = F.read(CONFIG.bookInfoFile)
    const { expired, booksInfo: bookList } = JSON.parse(localBook)
    if (!expired || expired < Date.now()) {
      Log.info('开始获取知识库信息')
      await getBook()
    } else {
      const books = (await inquireBooks()) as string[]
      if (books.length === 0) {
        Log.error('未选择知识库，程序中断')
        process.exit(0)
      } else {
        const filterBookList = books.includes('all')
          ? bookList
          : bookList.filter((item: any) => books.includes(item.slug))

        // 提前准备好文件夹
        delayedDownloadDoc(filterBookList, 1000, (_item) => {
          // TODO这里可以执行导出并存储到本地的动作
        })
      }
    }
  }

  const getBook = async () => {
    setTimeout(async () => {
      const bookList = await getBookStacks()
      delayedGetDocCommands(bookList, CONFIG.duration, 'crawl', async (_bookList) => {
        const content = setJSONString({ booksInfo: bookList, expired: Date.now() + 3600000 })
        F.touch2(CONFIG.bookInfoFile, content)
        setTimeout(() => {
          ask()
        }, 200)
      })
    }, 300)
  }

  const start = async () => {
    if (!accountInfo.userName || !accountInfo.password) {
      accountInfo = await inquireAccount()
    }

    const login = await loginYuque(accountInfo)
    if (login === 'ok') {
      ask()
    } else {
      Log.error('语雀登录失败')
    }
  }

  needLogin && start()
})()
