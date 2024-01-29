import { delayedDownloadDoc, getLocalUserConfig, setJSONString } from '../lib/tool.js'
import { Log } from '../lib/dev/log.js'
import F from '../lib/dev/file.js'
import { config as CONFIG } from '../core/config.js'
import { put } from '../lib/request.js'
import path from 'path'
import { crawlYuqueBookPage } from '../lib/yuque.js'
import { encrypt } from '../lib/dev/encrypt.js'
import YUQUE_API from '../lib/apis.js'
import { TBookItem } from '../lib/type.js'
import { writeFileSync } from 'fs'

type TBookItemNew = Array<
  Omit<TBookItem, 'user'> & { homePage: string; user: string; password?: string }
>

export default class Get implements Ytool.Cli.ICommand {
  public name = 'get'
  public description = `下载知识库文档\n用法: 仅支持配置文件，ytool get init初始化配置`
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }

  async action(args: string[]) {
    if (args.includes('init')) {
      this.initConfig()
      process.exit(0)
    }
    const { books } = await getLocalUserConfig()

    if (!books || books.length === 0) {
      Log.warn('知识库信息无效')
      process.exit(0)
    }

    const docExit = await F.isExit(path.resolve(CONFIG.outputDir))

    if (!docExit) {
      await F.mkdir(path.resolve(CONFIG.outputDir))
      await F.mkdir(path.resolve(CONFIG.metaDir))
    }

    const cookieContent = setJSONString({
      expired: Date.now(),
      data: '--',
    })

    F.touch2(CONFIG.cookieFile, cookieContent)

    const validBookList: TBookItemNew = books.filter((item) => item.homePage) as TBookItemNew

    const promises = validBookList.map(async (item) => {
      const matchs = item.homePage.split('/')
      // 链接可能携带了多余的反斜杠
      if (matchs.at(-1) === '/') {
        matchs.pop()
      }

      // 填充信息
      item.user = matchs.at(-2)
      item.slug = matchs.at(-1)

      const bookLocation = `/${item.user}/${item.slug}`
      const { matchCondition } = (await crawlYuqueBookPage(bookLocation)) as any
      if (matchCondition && matchCondition.page == 'verify') {
        try {
          const setNewCookies = await put(
            `/api/books/${matchCondition.needVerifyTargetId}/verify`,
            {
              password: encrypt(item.password),
            },
            {
              Referer: CONFIG.host + YUQUE_API.yuqueReferer,
              origin: CONFIG.host,
            }
          )
          if (setNewCookies) {
            const { book } = (await crawlYuqueBookPage(bookLocation)) as any
            return book
          } else {
            return []
          }
        } catch (error) {
          Log.warn(`知识库【${item.homePage}】数据获取失败，请确认密码或cookies是否正确`)
          return []
        }
      } else {
        const { book } = (await crawlYuqueBookPage(bookLocation)) as any
        return book
      }
    })

    Promise.allSettled(promises).then((res: any) => {
      validBookList.map((_item, index) => {
        const bookInfo = res[index].value || {}
        validBookList[index].docs = bookInfo.toc
        validBookList[index].name = bookInfo.name
        validBookList[index].slug = bookInfo.slug
      })

      const content = setJSONString({ booksInfo: validBookList, expired: Date.now() + 3600000 })
      // console.log(validBookList)
      F.touch2(CONFIG.bookInfoFile, content)

      const tocRange = validBookList.map((item) => item.name)

      Log.info(`开始导出【${tocRange}】的所有文档，请稍等～`)

      delayedDownloadDoc(
        {
          knowledgeConfig: {
            tocRange: tocRange,
            skipDoc: true,
            linebreak: true,
          },
        } as any,
        validBookList
      )
    })
  }

  initConfig() {
    const configExample = {
      books: [
        {
          homePage: 'https://www.yuque.com/vannvan/iuo8nq',
          password: 'oudn', // 针对需要访问密码的知识库
        },
        {
          homePage: 'https://www.yuque.com/vannvan/dd67e4?# 《test-book》',
        },
      ],
    }
    writeFileSync(CONFIG.localConfig, JSON.stringify(configExample, null, 2))
    Log.success(`配置初始化完成，${CONFIG.localConfig}`)
  }
}
