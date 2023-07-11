export default class Init implements ICommand {
  public name = 'pull'
  public description = '获取语雀知识库资源'
  ctx: TCLIContext
  constructor(ctx: TCLIContext) {
    this.ctx = ctx
  }
  async action(args: string[]) {
    const Command = await import('../core/app.js')
    const cmd = new Command.default()
    if (args.length >= 2) {
      // 认为前两位是账号信息
      const [userName, password, ...rest] = args
      const tocRange = rest.length ? rest.filter((item: string) => !/skip|lb/.test(item)) : []

      const targetArgs = {
        userName,
        password,
        skipDoc: rest.includes('skip'),
        linebreak: rest.includes('lb'),
        tocRange: tocRange,
      }
      cmd.init(targetArgs)
    } else {
      cmd.init({} as any)
    }
  }
}
