import inquirer from 'inquirer'
import chalk from 'chalk'
import F from './file.js'
import { config as CONFIG } from '../config.js'
import { ICookies, IYuqueTools } from './type.js'
import ora from 'ora'
import { crawlYuqueBookPage, exportMarkdown } from './yuque.js'
import JSEncrypt from 'jsencrypt-node'
const log = console.log

/**
 * 设置过期时间
 * @returns
 */
export const setExpireTime = () => Date.now() + CONFIG.localExpire

/**
 * 打印日志
 */
export const Log = {
  error: (text: string) => log(chalk.red(text)),
  info: (text: string, indent?: number) => {
    indent ? log(chalk.white(' '.repeat(indent) + text)) : log(chalk.white(text))
  },
  success: (text: string) => log(chalk.green(text)),
  warn: (text: string) => log(chalk.yellow(text)),
}

/**
 * 转换为json字符串
 * @param content
 * @returns
 */
export const setJSONString = (content: unknown) => JSON.stringify(content, null, 4)

/**
 * 账号登录
 * @returns
 */
export const inquireAccount = (): Promise<{ userName: string; password: string }> => {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'userName',
          message: '账号',
        },
        {
          type: 'password',
          name: 'password',
          message: '密码',
        },
      ])
      .then(async (answer) => {
        const { userName, password } = answer
        if (!userName || !password) {
          Log.error('账号信息无效')
          process.exit(0)
        }
        resolve(answer)
      })
  })
}

/**
 * 获取本地存储的cookie
 */
export const getLocalCookies = () => {
  try {
    const cookie = F.read(CONFIG.cookieFile)
    if (cookie) {
      const _cookies = JSON.parse(cookie) as ICookies
      return _cookies
    } else {
      return undefined
    }
  } catch (error) {
    // Log.error('本地cookie获取失败')
    return undefined
  }
}

/**
 * 加密
 * @param password
 * @returns
 */
export const genPassword = (password: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(CONFIG.publicKey)
  const time = Date.now()
  const symbol = time + ':' + password
  return encryptor.encrypt(symbol)
}

/**
 * 获取知识库下的文档任务 api方式或爬取方式
 * @param bookList
 * @param duration
 * @param finishCallBack
 */
export const delayedGetDocCommands = (
  app: IYuqueTools,
  bookList: any[],
  finishCallBack: (booklist: any) => void
) => {
  const isPersonally = app.knowledgeBaseType === 'personally'

  if (!bookList || !bookList.length) {
    Log.error('知识库数据有误')
    process.exit(0)
  }
  const spinner = ora('开始获取文档数据\n').start()

  const promises = bookList.map((item) => {
    const { slug, user } = item
    return crawlYuqueBookPage(`/${user}/${slug}`)
  })

  /**
   * 可能会存在失败
   */
  Promise.all(promises)
    .then((res) => {
      spinner.stop()
      Log.success('文档数据获取完成')
      bookList.map((_item, index) => {
        bookList[index].docs = res[index]
      })
      typeof finishCallBack === 'function' && finishCallBack(bookList)
    })
    .catch((error) => {
      console.log('------', error)
    })
}

/**
 * 询问需要的知识库
 * @returns
 */
export const inquireBooks = async (): Promise<
  | {
      tocList: string[]
      skipDoc: boolean
      linebreak: boolean
    }
  | undefined
> => {
  const book = F.read(CONFIG.bookInfoFile)
  if (book) {
    const { booksInfo } = JSON.parse(book)
    const options = booksInfo.map((item: any, index: number) => {
      return {
        name: `[${index + 1}]` + item.name,
        value: item.slug,
      }
    })

    return new Promise((resolve) => {
      inquirer
        .prompt([
          {
            type: 'checkbox',
            message: '请选择知识库(空格选中)',
            name: 'tocList',
            choices: options,
          },
          {
            type: 'confirm',
            message: '是否跳过本地相同文件',
            name: 'skpDoc',
          },
          {
            type: 'confirm',
            message: '是否保持语雀换行(会有<br/>标签)',
            name: 'linebreak',
          },
        ])
        .then(async (answer) => {
          resolve({
            tocList: answer.tocList,
            skipDoc: answer.skpDoc,
            linebreak: answer.linebreak,
          })
        })
    })
  } else {
    Log.error('知识库数据获取失败')
    return undefined
  }
}

/**
 * 生成扁平的文档列表
 * @param bookList
 * @returns
 */
const genFlatDocList = async (bookList: any[]) => {
  const ans: any[] = []
  const each = (list: any[]) => {
    if (list) {
      list.map((doc) => {
        // 过滤非文档
        if (doc.type === 'DOC' && doc.visible === 1) {
          ans.push(doc)
        }
        if (doc.children) {
          each(doc.children)
        }
      })
    }
  }

  bookList.map((item) => {
    item &&
      item.map((subItem: { visible: number; type: string; children: any }) => {
        if (subItem.type === 'DOC' && subItem.visible === 1) {
          ans.push(subItem)
        }
        each(subItem.children)
      })
  })
  return ans
}

/**
 * 初始化树形目录并返回加工后的数据,目的是生成同样结构的本地文件夹，和准备对应文档的(文件夹/文件名称）
 * @param items
 * @param id
 * @param pName
 * @returns
 */
const mkTreeTocDir = (
  items: any[],
  id: string = null,
  pItem: { name: string; slug: string; user: string }
) => {
  return items
    .filter((item) => item['parent_uuid'] === id)
    .map((item) => {
      const regex = /[<>:"\/\\|?*\x00-\x1F]/g
      const fullPath = pItem.name + '/' + item.title.replace(regex, '') // 过滤名称中的特殊字符
      // 如果是目录会有TITLE，如果存在子文档会有child_uuid
      if (item.type == 'TITLE' || item.child_uuid) {
        F.mkdir(CONFIG.outputDir + '/' + fullPath)
      }

      return {
        ...item,
        pslug: pItem.slug, // 上一级的slug
        user: pItem.user, // 上一级的user
        fullPath: fullPath,
        children: mkTreeTocDir(items, item.uuid, { ...pItem, name: fullPath }),
      }
    })
}

/**
 * 定时获取文档数据
 * @param bookList 文档列表
 * @param skipDoc 是否跳过本地已存在的文件
 */
export const delayedDownloadDoc = async (app: IYuqueTools, bookList: any[]) => {
  if (!bookList || bookList.length === 0) {
    Log.error('知识库选项无效')
    process.exit(0)
  }

  const { tocRange, skipDoc, linebreak } = app.knowledgeConfig
  const newInfo = bookList.map((item) => {
    // 创建知识库目录
    F.mkdir(CONFIG.outputDir + '/' + item.name)
    return mkTreeTocDir(item.docs, '', item)
  })

  // 最终要导出的文档列表
  let targetTocList = []

  let index = 0
  // 知识库下所有的文档
  targetTocList = await genFlatDocList(newInfo)

  // 二次筛选，因为可能只需要导出知识库下某目录的文档
  if (app.haveSecondLevel) {
    const docDirRegex = new RegExp(tocRange.join('|'))

    targetTocList = targetTocList.filter((item) => {
      if (docDirRegex.test(item.fullPath)) return item.fullPath
    })
  }

  if (targetTocList.length === 0) {
    Log.warn('当前知识库下暂无文档')
  }

  const MAX = targetTocList.length

  const spinner = ora('导出文档任务开始').start()

  let reportContent = `# 导出报告 \n ---- \n`

  let timer = setInterval(async () => {
    if (index === MAX) {
      reportContent += `---- \n ## 生成时间${new Date()}`
      const reportFilePath = CONFIG.outputDir + `/导出报告.md`
      F.touch2(reportFilePath, reportContent)
      spinner.stop()
      Log.success(`导出文档任务结束,共导出${index}个文档`)
      clearInterval(timer)
      process.exit(0)
    }

    const { pslug, user, url, title, fullPath } = targetTocList[index] || {}

    const repos = [user, pslug, url].join('/')
    spinner.text = `正在导出[${title}-${repos}]`
    try {
      const content: string = await exportMarkdown('/' + repos, linebreak)
      if (content) {
        const fileDir = CONFIG.outputDir + '/' + fullPath + '.md'
        // 是否已存在
        const isExit = await F.isExit(fileDir)
        if (skipDoc && isExit) {
          spinner.text = `本次跳过[${title}-${repos}]`
          reportContent += `- 🌈[${title}] 本次跳过 文件路径${fileDir} \n`
        } else {
          F.touch2(fileDir, content)
          reportContent += `- 🌈[${title}] 导出完成 文件路径${fileDir} \n`
        }
      } else {
        reportContent += `- ❌[${title}] 导出失败  \n`
      }
    } catch (error) {
      reportContent += `- ❌[${title}] 导出失败 \n`
    }

    index++
  }, CONFIG.duration)
}
