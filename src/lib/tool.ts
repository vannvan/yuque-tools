import inquirer from 'inquirer'
import chalk from 'chalk'
import F from './file.js'
import { config as CONFIG } from '../config.js'
import { ICookies } from './type.js'
import ora from 'ora'
import { crawlYuqueBookPage, getDocsOfBooks } from './yuque.js'
import JSEncrypt from 'jsencrypt-node'
const log = console.log

const oneDay = 86400000

/**
 * 一天之后过期
 * @returns
 */
export const afterOneDay = () => Date.now() + oneDay

/**
 * 打印日志
 */
export const Log = {
  error: (text: string) => log(chalk.red(text)),
  info: (text: string) => log(chalk.white(text)),
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
          message: 'userName',
          name: 'userName',
        },
        {
          type: 'password',
          message: 'password',
          name: 'password',
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
  bookList: any[],
  duration: number,
  type: 'api' | 'crawl',
  finishCallBack: (booklist: any) => void
) => {
  if (!bookList || !bookList.length) {
    Log.error('知识库数据有误')
    process.exit(0)
  }
  let index = 0
  const MAX = bookList.length
  const spinner = ora('开始获取文档数据').start()

  let timer = setInterval(async () => {
    if (index >= MAX) {
      spinner.stop()
      Log.success('文档数据获取完成')
      typeof finishCallBack === 'function' && finishCallBack(bookList)
      clearInterval(timer)
      return
    }
    const { name, slug, user, id } = bookList[index]
    spinner.text = `【${index}】开始获取${name}的文档数据`
    const docs =
      type == 'api' ? await getDocsOfBooks(id) : await crawlYuqueBookPage(`/${user}/${slug}`)
    spinner.text = `【${index}】${name}的文档数据获取成功`
    if (docs && bookList[index]) {
      bookList[index].docs = docs as any
    }
    index++
  }, duration)
}

/**
 * 询问需要的知识库
 * @returns
 */
export const inquireBooks = async (): Promise<string[]> => {
  const book = F.read(CONFIG.bookInfoFile)
  if (book) {
    const { booksInfo } = JSON.parse(book)
    const all = [{ name: '所有', value: 'all' }]
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
            name: 'books',
            choices: options.concat(all),
          },
        ])
        .then(async (answer) => {
          resolve(answer.books)
        })
    })
  } else {
    Log.error('知识库数据获取失败')
    return []
  }
}

const genFlatDocList = (bookList: any[]) => {
  const ans: any[] = []
  bookList.map((item) => {
    item.docs.map((doc: any) => {
      const repos = item.user + '/' + item.slug + '/' + doc.slug
      ans.push({
        repos,
        dirName: item.name, // 目录名称
        slug: doc.slug,
        name: doc.name,
      })
    })
  })
  return ans
}

/**
 * 初始化树形目录并返回加工后的数据
 * @param items
 * @param id
 * @param pName
 * @returns
 */
const mkTreeTocDir = (items: any[], id: string = null, pName: string) => {
  return items
    .filter((item) => item['parent_uuid'] === id)
    .map((item) => {
      const fullPath = pName + '/' + item.title
      // TODO待处理特殊字符
      item.type == 'TITLE' && F.mkdir(CONFIG.outputDir + '/' + fullPath)
      return {
        ...item,
        fullPath: fullPath,
        children: mkTreeTocDir(items, item.uuid, item.title),
      }
    })
}

/**
 * 定时获取文档数据
 * @param bookList
 * @param _duration
 * @param _finishCallBack
 */
export const delayedDownloadDoc = (
  bookList: any[],
  _duration: number = 1000,
  _finishCallBack: (markdown: string) => void
) => {
  if (!bookList || bookList.length === 0) {
    Log.error('知识库选项无效')
    process.exit(0)
  }

  const newInfo = bookList.map((item) => {
    return mkTreeTocDir(item.docs, '', '')
  })

  // const content = setJSONString({ booksInfo: newInfo, expired: Date.now() + 3600000 })
  // F.touch2(CONFIG.bookInfoFile, content)
}
