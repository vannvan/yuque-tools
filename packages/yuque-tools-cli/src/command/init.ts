import { writeFileSync } from 'fs'
import { config as CONFIG } from '../core/config.js'
import { Log } from '../lib/dev/log.js'
import inquirer from 'inquirer'

export default class Init implements Ytool.Cli.ICommand {
  public name = 'init'
  public description = '初始化配置'
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  action() {
    inquirer
      .prompt([
        {
          type: 'list',
          message: '请选择配置类别',
          name: 'type',
          choices: [
            {
              name: '适用于pull命令，导出个人/协作/团队知识库，需要账号',
              value: 'pull',
            },
            {
              name: '适用于down命令，导出任意知识库，无需账号',
              value: 'down',
            },
          ],
        },
      ])
      .then(async (answer) => {
        const { type } = answer
        if (type === 'pull') {
          this.initPullCMDConfig()
        }
        if (type === 'down') {
          this.initDownloadCMDConfig()
        }
      })
  }

  initPullCMDConfig() {
    const configTemplate: Ytool.App.TUserLocalConfig = {
      userName: 'XXX',
      password: 'XXX',
      tocRange: ['xxx知识库', 'yyy知识库/zzz目录'],
      skipDoc: true,
      output: './docs',
      linebreak: false,
      onlyNote: false,
    }

    writeFileSync(CONFIG.localConfig, JSON.stringify(configTemplate, null, 2))
    Log.success(`配置初始化完成，${CONFIG.localConfig}，可参照文档调整配置信息～`)
  }

  initDownloadCMDConfig() {
    const configExample = {
      skipDoc: true,
      linebreak: true,
      books: [
        {
          homePage: 'https://www.yuque.com/xxx/yyy',
          password: 'oudn', // 针对需要访问密码的知识库
        },
        {
          homePage: 'https://www.yuque.com/vannvan/dd67e4?# 《test-book》',
        },
      ],
    }
    writeFileSync(CONFIG.localConfig, JSON.stringify(configExample, null, 2))
    Log.success(`配置初始化完成，${CONFIG.localConfig}，可参照文档调整配置信息～`)
  }
}
