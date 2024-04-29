import chalk from 'chalk'

export default class Init implements Ytool.Cli.ICommand {
  public name = 'pull'
  public description = `获取语雀知识库资源\n用法: ${chalk.cyan(
    'ytool pull [userName] [password] [skip|lb|note] [tocRange]'
  )}`
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  async action(args: string[]) {
    const Command = await import('../core/app.js')
    const cmd = new Command.default(this.ctx)
    if (args.length >= 2) {
      // 认为前两位是账号信息
      const [userName, password, time, ...rest] = args
      const tocRange = rest.length
        ? rest.filter((item: string) => !/skip|lb|note|lc|isUpdate/.test(item))
        : []

      const targetArgs = {
        userName,
        password,
        tocRange,
        skipDoc: rest.includes('skip'),
        linebreak: rest.includes('lb'),
        onlyNote: rest.includes('note'),
        latexcode: rest.includes('lc'),
        isUpdate: rest.includes('isUpdate'),
        time,
      }
      cmd.init(targetArgs)
    } else {
      cmd.init({} as any)
    }
  }
}
