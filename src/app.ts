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

class YuqueTools {
  accountInfo: IAccountInfo
  // 支持模糊匹配表知识库 all字符串表示所有
  tocRange: string[]
  // 支持跳过本地已存在的文档
  skipDoc: boolean
  // 用户已选的知识库slug列表
  userSelectedDoc: string[]
  constructor() {
    this.accountInfo = {
      userName: '',
      password: '',
    }
    this.skipDoc = false
    this.tocRange = []
    this.userSelectedDoc = []
  }
  /**
   * 1. 检查本地缓存文件，是否已经有账号信息，同时检查是否已过期
   * 2. 检查必要的文档结构目录是否存在
   * @param userName
   * @param password
   * @param tocRange
   * @param skipDoc
   */
  async init(args?: {
    userName?: string
    password?: string
    tocRange?: string[]
    skipDoc?: boolean
  }) {
    Log.info('开始登录语雀')

    // load account info from yuque.config.json
    const isExitConfig = await F.isExit(path.resolve(CONFIG.localConfig))
    // 先读取用户本地配置
    if (isExitConfig) {
      const configUserInfo = JSON.parse(F.read(path.resolve(CONFIG.localConfig))) || {}
      this.accountInfo = {
        userName: configUserInfo.userName,
        password: configUserInfo.password,
      }
      this.tocRange = configUserInfo.tocRange
      this.skipDoc = configUserInfo.skipDoc
    }

    // 就算用户本地配置有这些信息，但还是优先采用本次传入的
    this.accountInfo = {
      userName: args.userName,
      password: args.password,
    }

    // set toc
    this.tocRange = args.tocRange || this.tocRange

    // is skip
    this.skipDoc = args.skipDoc || this.skipDoc

    Log.info(`您当前传入的有效信息为:`)

    args.userName && Log.info(`账号: ${args.userName}`)
    args.tocRange && Log.info(`知识库: ${args.tocRange.filter((item) => item !== 'skip')}`)
    args.tocRange && Log.info(`是否跳过本地文件: ${args.skipDoc ? '是' : '否'}`)

    // exit docs dir?
    const docExit = await F.isExit(path.resolve(CONFIG.outputDir))

    // is need login yuque?
    let isNeedLogin = true

    if (!docExit) {
      await F.mkdir(path.resolve(CONFIG.outputDir))
      await F.mkdir(path.resolve(CONFIG.metaDir))
    } else {
      const cookie = getLocalCookies()
      // is expired
      if (cookie && cookie?.expired > Date.now()) {
        isNeedLogin = true
      }
    }
    isNeedLogin && this.start()
  }

  /**
   * 当命令行没有传入账号信息时进入交互式填写环节
   */
  private async start() {
    const { userName, password } = this.accountInfo
    if (!userName || !password) {
      this.accountInfo = await inquireAccount()
    }

    const login = await loginYuque(this.accountInfo)
    if (login === 'ok') {
      this.ask()
    } else {
      Log.error('语雀登录失败')
    }
  }

  /**
   * 让用户选择指定的知识库
   * @returns
   */
  private async ask() {
    if (!(await F.isExit(CONFIG.bookInfoFile))) {
      await this.getBook()
      return
    }
    const localBook = F.read(CONFIG.bookInfoFile)
    const { expired, booksInfo: bookList } = JSON.parse(localBook)
    if (!expired || expired < Date.now()) {
      Log.info('开始获取知识库信息')
      await this.getBook()
    } else {
      const targetTocList = await this.getTocList()
      if (targetTocList.length === 0) {
        Log.error('未匹配或为选择知识库，程序中断')
        process.exit(0)
      } else {
        const filterBookList = bookList.filter((item: any) => targetTocList.includes(item.slug))

        // 正式执行导出任务
        await delayedDownloadDoc(filterBookList, this.skipDoc)
      }
    }
  }

  /**
   * 筛选知识库
   */
  private async getTocList(): Promise<string[]> {
    if (this.tocRange.length) {
      const book = F.read(CONFIG.bookInfoFile)
      const { booksInfo } = JSON.parse(book)
      // all
      if (this.tocRange.includes('all')) {
        return booksInfo.map((item: { slug: any }) => item.slug)
      } else {
        const regex = new RegExp(this.tocRange.join('|'))
        const matchToc = booksInfo.filter((item: any) => {
          return regex.test(item.name)
        })
        this.userSelectedDoc = matchToc.length
          ? matchToc.map((item: { slug: any }) => item.slug)
          : []
      }
    } else {
      const { tocList: userTocList, skipDoc } = await inquireBooks()
      this.skipDoc = skipDoc
      this.userSelectedDoc = userTocList
    }
    return this.userSelectedDoc
  }

  /**
   * 获取知识库信息，生成所有知识库的配置文件
   */
  private async getBook() {
    setTimeout(async () => {
      const bookList = await getBookStacks()
      delayedGetDocCommands(bookList, async (_bookList) => {
        const content = setJSONString({ booksInfo: _bookList, expired: Date.now() + 3600000 })
        F.touch2(CONFIG.bookInfoFile, content)
        setTimeout(() => {
          this.ask()
        }, 200)
      })
    }, 300)
  }
}

export default YuqueTools
