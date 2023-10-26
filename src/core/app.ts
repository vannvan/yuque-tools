#!/usr/bin/env node
import {
  delayedDownloadDoc,
  delayedGetDocCommands,
  getLocalCookies,
  getLocalUserConfig,
  inquireAccount,
  inquireBooks,
  setJSONString,
  getAllNotes
} from '../lib/tool.js'
import { config as CONFIG } from './config.js'
import F from '../lib/dev/file.js'
import path from 'path'
import { getBookStacks, loginYuque } from '../lib/yuque.js'
import { Log } from '../lib/dev/log.js'

class YuqueTools implements Ytool.App.IYuqueTools {
  accountInfo: Ytool.App.IAccountInfo
  ctx: Ytool.App.TAppContext
  knowledgeConfig: Ytool.App.TKnowledgeConfig
  userSelectedDoc: string[]
  haveSecondLevel: boolean
  knowledgeBaseType: Ytool.App.TKnowledgeBaseType
  constructor(ctx?: Ytool.App.TAppInjectContext) {
    this.accountInfo = {
      userName: '',
      password: '',
    }
    this.knowledgeConfig = {
      tocRange: [],
      skipDoc: undefined,
      linebreak: undefined,
    }
    this.knowledgeBaseType = 'personally'
    this.userSelectedDoc = []
    this.haveSecondLevel = false

    // TODO
    this.ctx = Object.assign(this, {
      ctx,
    })
  }
  /**
   * 1. 检查本地缓存文件，是否已经有账号信息，同时检查是否已过期
   * 2. 检查必要的文档结构目录是否存在
   * @param args 参考 Ytool.Cli.TCLI_ARGS
   */
  async init(args: Ytool.Cli.TCLI_ARGS) {
    if (!args) {
      Log.error('参数错误，退出程序')
      process.exit(0)
    }
    Log.info('开始登录语雀')

    // load account info from yuque.config.json
    const isExitConfig = await F.isExit(path.resolve(CONFIG.localConfig))
    // 先读取用户本地配置
    if (isExitConfig) {
      try {
        const { userName, password, ...rest } = await getLocalUserConfig()

        this.accountInfo = {
          userName: userName,
          password: password,
        }

        // 空间可以自定义host 知识库类型
        this.knowledgeBaseType = rest.host ? 'space' : 'personally'

        // 自定义输出目录
        CONFIG.setOutputDir = rest.output ? rest.output : CONFIG.outputDir

        // 其它配置
        this.knowledgeConfig = { ...rest } as any
      } catch (error) {
        Log.warn('配置信息有误，开始交互式环节')
      }
    }

    // 就算用户本地配置有这些信息，但还是优先采用本次传入的
    if (args.userName && args.password) {
      const { userName, password, ...rest } = args
      this.accountInfo = {
        userName: userName,
        password: password,
      }

      this.knowledgeConfig = {
        ...rest,
      }

      Log.info(`当前导出操作的有效参数:`)

      args.userName && Log.info(`账号: ${args.userName}`, 2)
      args.tocRange && Log.info(`知识库: ${args.tocRange}`, 2)
      args.tocRange && Log.info(`是否跳过本地文件: ${args.skipDoc ? 'true' : 'false'}`, 2)
      args.linebreak && Log.info(`是否保持换行: ${args.linebreak ? 'true' : 'false'}`, 2)
    }

    // exit docs dir?
    const docExit = await F.isExit(path.resolve(CONFIG.outputDir))

    // is need login yuque?
    let isNeedLogin = true

    if (!docExit) {
      await F.mkdir(path.resolve(CONFIG.outputDir))
      await F.mkdir(path.resolve(CONFIG.metaDir))
    } else {
    }
    if (this.exitMetaDir()) {
      const cookie = getLocalCookies()
      if (cookie && cookie?.expired > Date.now()) {
        // is expired
        isNeedLogin = true
      } else if (cookie?.expired < Date.now()) {
        // not expired
        this.ask()
        return
      }
    }
    isNeedLogin && this.start()
  }

  private async exitMetaDir() {
    const docExit = await F.isExit(path.resolve(CONFIG.outputDir))
    if (!docExit) {
      await F.mkdir(path.resolve(CONFIG.outputDir))
      await F.mkdir(path.resolve(CONFIG.metaDir))
      return false
    } else {
      return true
    }
  }

  /**
   * 当命令行没有传入账号信息时进入交互式填写环节
   */
  private async start() {
    const { userName, password } = this.accountInfo
    if (!userName || !password) {
      this.accountInfo = await inquireAccount()
    }

    const loginMessage = await loginYuque(this.accountInfo)
    if (loginMessage === 'ok') {
      this.ask()
    } else {
      Log.error(loginMessage)
      process.exit(0)
    }
  }

  /**
   * 让用户选择指定的知识库
   * @returns
   */
  private async ask() {
    await getAllNotes()
    const { tocRange = [] } = this.knowledgeConfig
    //只导出小记
    if (tocRange.length && tocRange.includes('only_note')) {
      return
    }

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
        Log.error('未匹配或未选择知识库，程序中断')
        process.exit(0)
      } else {
        const filterBookList = bookList.filter((item: any) => targetTocList.includes(item.slug))

        // 正式执行导出任务
        await delayedDownloadDoc(this.ctx, filterBookList)
      }
    }
  }

  /**
   * 筛选知识库
   * 支持两种形式 1. 知识库 2. 知识库/xxx
   */
  private async getTocList(): Promise<string[]> {
    const { tocRange = [] } = this.knowledgeConfig
    if (tocRange.length) {
      const book = F.read(CONFIG.bookInfoFile)
      const { booksInfo } = JSON.parse(book)
      // all
      if (tocRange.includes('all')) {
        return booksInfo.map((item: { slug: any }) => item.slug)
      } else {
        // 知识库顶级目录
        const tocTopLevel = []

        for (const ch of tocRange) {
          // 如果是多级目录，只取第一级
          if (/\//.test(ch)) {
            // 打上有二级目录标记，后续好处理
            this.haveSecondLevel = true
            tocTopLevel.push(ch.split('/').at(0))
          } else {
            tocTopLevel.push(ch)
          }
        }

        // const regex =  new RegExp(this.tocRange.join('|'))
        const regex = new RegExp(tocTopLevel.join('|'))

        const matchToc = booksInfo.filter((item: any) => {
          return regex.test(item.name)
        })
        this.userSelectedDoc = matchToc.length
          ? matchToc.map((item: { slug: any }) => item.slug)
          : []
      }
    } else {
      // 如果上面都没有，那就从询问环节取
      const { tocList: userTocRange, skipDoc, linebreak } = await inquireBooks()
      this.userSelectedDoc = userTocRange
      this.knowledgeConfig = {
        ...this.knowledgeConfig,
        skipDoc,
        linebreak,
      }
    }
    return this.userSelectedDoc
  }

  /**
   * 获取知识库信息，生成所有知识库的配置文件
   */
  private async getBook() {
    setTimeout(async () => {
      const bookList = await getBookStacks(this.ctx)
      // console.log(`共有${bookList.length}个知识库`)
      delayedGetDocCommands(this.ctx, bookList, async (_bookList) => {
        const content = setJSONString({ booksInfo: _bookList, expired: Date.now() + 3600000 })
        await F.touch2(CONFIG.bookInfoFile, content)
        this.ask()
      })
    }, 300)
  }
}

export default YuqueTools
