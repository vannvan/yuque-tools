declare module 'jsencrypt-node'

declare namespace Ytool {
  namespace Cli {
    type TCLIInfo = {
      version: string
      name: string
      description: string
    }

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
      skipDoc: boolean
      /**
       * 是否保持语雀换行
       */
      linebreak: boolean
    }

    type TCLIContext = {
      cliInfo: TCLIInfo
    }

    interface ICommand {
      name: string
      description: string
      ctx: TCLIContext
      action(args: string[]): void
    }
  }

  namespace App {
    /**
     * 账户信息
     */
    type IAccountInfo = Pick<Cli.TCLI_ARGS, 'userName' | 'password'>

    /**
     * 给用户的知识库配置
     */
    type TKnowledgeConfig = Pick<Cli.TCLI_ARGS, 'tocRange' | 'linebreak' | 'skipDoc'>

    type TKnowledgeBaseType = 'personally' | 'space'

    type TAppInjectContext = Partial<
      {
        __isCLI__: boolean
      } & Ytool.Cli.TCLIContext
    >

    type TAppContext = TAppInjectContext & IYuqueTools

    interface IYuqueTools {
      ctx: TAppContext
      accountInfo: IAccountInfo

      // 用户的导出配置
      knowledgeConfig: TKnowledgeConfig

      // 是否有二级目录
      haveSecondLevel: boolean

      // 用户已选的知识库slug列表
      userSelectedDoc: string[]

      // 知识库类型
      knowledgeBaseType: TKnowledgeBaseType
      // 执行任务
      init(args?: TCLI_ARGS): void
    }
  }
}
