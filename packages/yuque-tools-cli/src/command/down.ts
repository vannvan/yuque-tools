import chalk from 'chalk'
import inquirer from 'inquirer'
import path from 'path'
import { delayedDownloadDoc, getLocalUserConfig, setJSONString } from '../lib/tool.js'
import { Log } from '../lib/dev/log.js'
import F from '../lib/dev/file.js'
import { config as CONFIG } from '../core/config.js'
import { put } from '../lib/request.js'
import { crawlYuqueBookPage } from '../lib/yuque.js'
import { encrypt } from '../lib/dev/encrypt.js'
import YUQUE_API from '../lib/apis.js'
import { TBookItem } from '../lib/type.js'

type TBookItemNew = Array<
  Omit<TBookItem, 'user'> & { homePage: string; user: string; password?: string }
>

export default class Down implements Ytool.Cli.ICommand {
  public name = 'down'
  public description = `导出任意知识库文档，请勿滥用！！！\n用法: ${chalk.cyan('ytool down [ask]')}`
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }

  async action(args: string[]) {
    if (args.includes('ask')) {
      this.inquiryBooks()
      return
    }

    const { books } = await getLocalUserConfig()

    if (!books || books.length === 0) {
      Log.warn('知识库信息无效')
      process.exit(0)
    } else {
      this.handleDownload(books)
    }
  }

  private async inquiryBooks() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'bookLink',
          message: `请输入知识库链接，如需要密码请用#分隔，多个知识库请用 , 分隔如:\n ${chalk.cyan(
            'http://xxx.yuque.com/xxx/yyy#abcd,http://xxx.yuque.com/xxx/zzz\n'
          )}`,
        },
        {
          type: 'confirm',
          name: 'skipDoc',
          message: '是否跳过已存在文档',
          default: true,
        },
        {
          type: 'confirm',
          name: 'linebreak',
          message: '是否保持语雀换行标识',
          default: true,
        },
      ])
      .then((answer) => {
        const { bookLink, skipDoc, linebreak } = answer
        const books = bookLink.split(',').map((item: string) => {
          const [homePage, password] = item.split('#')
          return {
            homePage,
            password,
          }
        })
        this.handleDownload(books, {
          skipDoc,
          linebreak,
        })
      })
  }

  private async handleDownload(
    books: {
      homePage: string
      password?: string
    }[],
    options?: {
      skipDoc?: boolean
      linebreak?: boolean
    }
  ) {
    const { linebreak, skipDoc } = options || (await getLocalUserConfig())

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

    // homePage需要匹配https://www.yuque.com域名
    const validBookList: TBookItemNew = books.filter(
      (item) => item.homePage && item.homePage.startsWith('https://www.yuque.com')
    ) as TBookItemNew

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
            YUQUE_API.yuqueBookPasswordVerify(matchCondition.needVerifyTargetId),
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
          Log.warn(`知识库【${item.homePage}】数据获取失败，请确认密码是否正确`)
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

      F.touch2(CONFIG.bookInfoFile, content)

      const tocRange = validBookList.map((item) => item.name)

      Log.info(`开始导出【${tocRange}】的所有文档，请稍等～`)

      delayedDownloadDoc(
        {
          knowledgeConfig: {
            tocRange,
            skipDoc,
            linebreak,
          },
        } as any,
        validBookList
      )
    })
  }
}
