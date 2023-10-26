export default class Init implements Ytool.Cli.ICommand {
  public name = 'pull'
  public description = '获取语雀知识库资源'
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  async action(args: string[]) {
    const Command = await import('../core/app.js')
    const cmd = new Command.default(this.ctx)
    if (args.length >= 2) {
      // 认为前两位是账号信息
      const [userName, password, ...rest] = args
      const tocRange = rest.length
        ? rest.filter((item: string) => !/skip|lb|only_note/.test(item))
        : []

      const targetArgs = {
        userName,
        password,
        skipDoc: rest.includes('skip'),
        linebreak: rest.includes('lb'),
        only_note: rest.includes('only_note'),
        tocRange: tocRange,
      }
      cmd.init(targetArgs)
    } else {
      cmd.init({} as any)
    }
  }
}
