import { writeFileSync } from 'fs'
import { config as CONFIG } from '../core/config.js'
import { Log } from '../lib/dev/log.js'

export default class Init implements Ytool.Cli.ICommand {
  public name = 'init'
  public description = '初始化配置'
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  action() {
    const configTemplate: Ytool.App.TUserLocalConfig = {
      userName: 'XXX',
      password: 'XXX',
      tocRange: ['xxx知识库', 'yyy知识库/zzz目录'],
      skipDoc: true,
      output: './docs',
      linebreak: false,
    }

    writeFileSync(CONFIG.localConfig, JSON.stringify(configTemplate, null, 2))
    Log.success(`配置初始化完成，${CONFIG.localConfig}`)
  }
}
