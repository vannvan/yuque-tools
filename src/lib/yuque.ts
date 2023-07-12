import jsdom from 'jsdom'
import { setExpireTime, setJSONString } from './tool.js'
import { config as CONFIG } from '../core/config.js'
import { get, post } from './request.js'
import { ILoginResponse, TBookItem, TBookStackItem, TDocItem } from './type'
import F from './dev/file.js'
import YUQUE_API from './apis.js'
import { Log } from './dev/log.js'
import { encrypt } from './dev/encrypt.js'
const { JSDOM } = jsdom

/**
 * 登录语雀
 * @param accountInfo
 */
const loginYuque = async (accountInfo: Ytool.App.IAccountInfo) => {
  const { userName, password } = accountInfo
  if (!userName || !password) {
    Log.error('账号信息不完整')
    process.exit(0)
  }

  const loginInfo = {
    login: userName,
    password: encrypt(password),
    loginType: 'password',
  }

  try {
    const { data } = await post<ILoginResponse>(YUQUE_API.yuqueLoginApi, loginInfo, {
      Referer: CONFIG.host + YUQUE_API.yuqueReferer,
      origin: CONFIG.host,
    })

    if (data.ok) {
      const userInfoContent = setJSONString({ ...data.user, expired: setExpireTime() })
      await F.touch2(CONFIG.userInfoFile, userInfoContent)
      Log.success('语雀登录成功')
      return 'ok'
    } else {
      throw '语雀登录失败，请确认账号密码是否正确'
    }
  } catch (error) {
    return error + ': 语雀登录失败，请确认账号密码是否正确'
  }
}

/**
 * 获取知识库列表
 */
const getBookStacks = async (app: Ytool.App.IYuqueTools) => {
  const isPersonally = app.knowledgeBaseType === 'personally'

  const { data } = await get<TBookStackItem[]>(
    isPersonally ? YUQUE_API.yuqueBooksList : YUQUE_API.yuqueBooksListOfSpace
  )
  if (data) {
    // reduce [{c:[1,2],a:'11'}] => {c: Array(2), a: '11'}
    // 个人知识库和空间知识库的结构不一样
    const sourceBooks = isPersonally
      ? (data.map((item) => item.books).flat() as unknown as TBookItem[])
      : (data as unknown as TBookItem[])

    // const list = data.map((item) => item.books).flat() as unknown as TBookItem[]
    const _list = sourceBooks.map((item: TBookItem) => {
      return {
        slug: item.slug,
        name: item.name,
        user: item.user.login,
        id: item.id,
        docs: [],
      }
    })
    return _list
  } else {
    Log.error('获取知识库失败')
    process.exit(0)
  }
}

/**
 * 获取知识库下的文档
 * @param bookId
 * @returns 文档列表
 */
const getDocsOfBooks = async (bookId: string): Promise<any> => {
  const { data } = await get<TDocItem[]>(YUQUE_API.yuqueDocsOfBook(bookId))
  if (data) {
    const list = data.map((item) => {
      return {
        slug: item.slug,
        name: item.title,
      }
    })
    return list
  } else {
    Log.error(`获取{${bookId}}知识库文档失败`)
  }
}

/**
 * 导出md文件
 * @param repos 文档路径
 * @param linebreak 是否保留换行
 * @returns md内容
 */
const getMarkdownContent = async (repos: string, linebreak: boolean): Promise<string> => {
  const markdownContent = await get(YUQUE_API.yuqueExportMarkdown(repos, linebreak))
  if (markdownContent) {
    return markdownContent as unknown as string
  } else {
    Log.error(`导出{${repos}}知识库文档失败`)
    return ''
  }
}

/**
 * 爬取语雀知识库页面数据
 * 不能reject
 * @param repos
 * @returns
 */
const crawlYuqueBookPage = (repos: string): Promise<{ value: any }[]> => {
  return new Promise((resolve, reject) => {
    get(repos)
      .then((res) => {
        const virtualConsole = new jsdom.VirtualConsole()
        const window = new JSDOM(`${res}`, { runScripts: 'dangerously', virtualConsole }).window
        virtualConsole.on('error', () => {
          // don't do anything
        })
        try {
          const { book } = window.appData || {}
          resolve(book?.toc)
        } catch (error) {
          Log.error(`知识库${repos}页面数据爬取失败`)
          reject([])
        }
      })
      .catch(() => {
        Log.error(`知识库${repos}页面数据爬取失败`)
        reject([])
      })
  })
}

export { loginYuque, getBookStacks, getDocsOfBooks, getMarkdownContent, crawlYuqueBookPage }
