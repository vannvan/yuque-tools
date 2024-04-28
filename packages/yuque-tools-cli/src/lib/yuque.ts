import jsdom from 'jsdom'
import { getMetaUserInfo, setExpireTime, setJSONString } from './tool.js'
import { config as CONFIG } from '../core/config.js'
import { get, post } from './request.js'
import { ILoginResponse, TBookItem, TBookStackItem, TDocItem, TNoteRst } from './type'
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
  Log.info('开始登录语雀')
  try {
    const { data } = await post<ILoginResponse>(YUQUE_API.mobileLoginApi, loginInfo, {
      Referer: CONFIG.host + YUQUE_API.yuqueReferer,
      origin: CONFIG.host,
      'user-agent': CONFIG.userAgent,
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

  const { data = [] } = await get<TBookStackItem[]>(
    isPersonally ? YUQUE_API.yuqueBooksList : YUQUE_API.yuqueBooksListOfSpace
  )

  const collabBooks = (await getCollabBooks()) || []

  const { login: currentLogin } = await getMetaUserInfo()

  if (data.length > 0 || collabBooks.length > 0) {
    // reduce [{c:[1,2],a:'11'}] => {c: Array(2), a: '11'}
    // 个人知识库和空间知识库的结构不一样
    const sourceBooks = isPersonally
      ? (data.map((item) => item.books).flat() as unknown as TBookItem[])
      : (data as unknown as TBookItem[])

    const _list = sourceBooks.concat(collabBooks).map((item: TBookItem) => {
      return {
        slug: item.slug,
        name: item.name,
        user: item.user.login,
        id: item.id,
        docs: [],
        // flag
        type: currentLogin === item.user.login ? 'owner' : 'collab',
      }
    })
    return _list
  } else {
    Log.error('知识库数据获取失败')
    process.exit(0)
  }
}

const getCollabBooks = async (): Promise<TBookItem[]> => {
  const { data } = await get(YUQUE_API.yuqueCollabBooks)
  return data as TBookItem[]
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

type DocDetails = {
  content_updated_at: string
  updated_at: string
};

const getDocsOfSlugAndBook = async (slug: string, bookId: string): Promise<{ data?: DocDetails }> => {
  const url = await YUQUE_API.yuqueDocsOfSlugAndBook(slug, bookId)
  return get<DocDetails>(url)
      .then((res) => {
        if (!res || !res.data) {
          return {data: undefined}
        }
        const item = res.data;
        const docDetails: DocDetails = {
          content_updated_at: item.content_updated_at,
          updated_at: item.updated_at
        };
        return {data: docDetails}
      })
      .catch((error) => {
        Log.error(`获取{${slug}?book_id=${bookId}}知识库文档详情失败`, error)
        throw error
      })
}

/**
 * 导出md文件
 * @param repos 文档路径
 * @param linebreak 是否保留换行
 * @param latexcode 是否保留latex
 * @returns md内容
 */
const getMarkdownContent = async (
  repos: string,
  linebreak: boolean,
  latexcode: boolean
): Promise<string> => {
  const markdownContent = await get(YUQUE_API.yuqueExportMarkdown(repos, linebreak, latexcode))
  if (markdownContent) {
    return markdownContent as unknown as string
  } else {
    Log.error(`获取{${repos}}知识库内容失败\n`)
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
          resolve(window.appData)
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

/**
 * 导出小记
 * @param offset 偏移
 * @param limit 每页数量
 * @returns md内容
 */
const getNotes = async (offset: number, limit: number): Promise<any> => {
  const api = YUQUE_API.yuqueExportNotes(offset, limit)
  const data = await get(api)
  // console.log("getNotes", data)
  const noteRst = data as unknown as TNoteRst
  const notes = noteRst.notes
  const has_more = noteRst.has_more
  if (notes) {
    const list = notes.map((item) => {
      const tags = item.tags.map((item1) => {
        return item1.name
      })
      return {
        content: item.content.abstract,
        tags: tags,
        slug: item.slug,
      }
    })
    return {
      list: list,
      hasMore: has_more,
    }
  } else {
    Log.error(`获取小记失败`)
  }
}

export {
  loginYuque,
  getBookStacks,
  getDocsOfBooks,
  getDocsOfSlugAndBook,
  getMarkdownContent,
  crawlYuqueBookPage,
  getNotes,
}
