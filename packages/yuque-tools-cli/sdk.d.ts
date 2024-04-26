import { type } from 'os'

type TKnowledgeBaseType = 'personally' | 'space'

type TCLI_ARGS = {
  /**
   * yuque account
   */
  userName: string
  /**
   * yuque password
   */
  password: string
  /**
   * what you need toc range
   */
  tocRange: string[]
  /**
   * is skip local same file
   */
  skipDoc?: boolean
  /**
   * is keep yuque linebreak
   */
  linebreak?: boolean
  /**
   * latexType true->导出 LaTeX 公式为 Markdown 语法 false->导出 LaTeX 公式图片
   */
  latexcode?: boolean
}

type Ytool = {
  ctx: Ytool.App.IYuqueTools
  accountInfo: Pick<TCLI_ARGS, 'userName' | 'password'>
  // 用户的导出配置
  knowledgeConfig: Omit<TCLI_ARGS, 'userName' | 'password'>
  // 是否有二级目录
  haveSecondLevel: boolean
  // 用户已选的知识库slug列表
  userSelectedDoc: string[]
  /**
   * 知识库类型
   */
  knowledgeBaseType: TKnowledgeBaseType
  /**
   * 执行导出
   * @param args
   */
  init(args: TCLI_ARGS): void
}

type TLoginYuque = Ytool.App.IAccountInfo

/**
 * 通过完整的参数直接导出语雀文档
 */
declare const ytool: Ytool

/**
 * 登录语雀
 */
declare const loginYuque: (args: Pick<TCLI_ARGS, 'userName' | 'password'>) => void

/**
 * 获取知识库
 */
declare const getBookStacks: (args: Ytool) => Promise<
  {
    slug: string
    name: string
    user: string
    id: string
    docs: any[]
  }[]
>
/**
 * 获取知识库下的文档列表
 */
declare const getDocsOfBooks: (bookId: string) => Promise<
  {
    slug: string
    name: string
  }[]
>

/**
 * 获取Markdown文档内容
 */
declare const getMarkdownContent: (repo: string, linebreak: boolean) => Promise<string>

export { ytool, loginYuque, getBookStacks, getDocsOfBooks, getMarkdownContent }
