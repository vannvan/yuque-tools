type TKnowledgeBaseType = 'personally' | 'space'

type TCLI_ARGS = {
  /**
   * 语雀账号
   */
  userName: string
  /**
   * 语雀密码
   */
  password: string
  /**
   * 知识库范围
   */
  tocRange: string[]
  /**
   * 支持跳过本地已存在的文档
   */
  skipDoc?: boolean
  /**
   * 是否保持语雀换行
   */
  linebreak?: boolean
}

type TSdk = {
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

declare const YtoolSdk: TSdk

export default YtoolSdk
