export interface IAccountInfo {
  userName: string
  password: string
}

export interface ILoginResponse {
  ok: boolean
  goto: string
  user: {
    id: string
    login: string
    name: string
    description: string
  }
}

export interface ICookies {
  expired: number
  data: string
}

export type TBookItem = {
  id: string
  slug: string
  name: string
  user: {
    name: string
    login: string
  }
  docs: TDocItem[]
}

export type TBookStackItem = {
  books: TBookItem[]
  name: string
  id: number
}

export interface IBookStack {
  data: TBookStackItem[]
}

export type TDocItem = {
  title: string
  slug: string
  description: string
}

export interface IDocsOfBook {
  data: TDocItem[]
}

/**
 * 给用户的知识库配置
 */
export type TKnowledgeConfig = {
  // 知识库范围
  tocRange: string[]
  // 支持跳过本地已存在的文档
  skipDoc: boolean
  // 是否保持yuque换行
  linebreak: boolean
}

/**
 * 命令行参数
 */
export type TCLI_ARGS = {
  userName?: string
  password?: string
  // 知识库范围
  tocRange: string[]
  // 支持跳过本地已存在的文档
  skipDoc: boolean
  // 是否保持yuque换行
  linebreak: boolean
}

export type TKnowledgeBaseType = 'personally' | 'space'

export interface IYuqueTools {
  ctx: this
  accountInfo: IAccountInfo
  // 用户的导出配置
  knowledgeConfig: TKnowledgeConfig
  // 是否有二级目录
  haveSecondLevel: boolean
  // 用户已选的知识库slug列表
  userSelectedDoc: string[]

  // 知识库类型
  knowledgeBaseType: TKnowledgeBaseType
  init(args?: TCLI_ARGS): void
}
