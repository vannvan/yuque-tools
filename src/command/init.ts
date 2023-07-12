export default class Init implements Ytool.Cli.ICommand {
  public name = 'init'
  public description = '初始化配置'
  ctx: Ytool.Cli.TCLIContext
  constructor(ctx: Ytool.Cli.TCLIContext) {
    this.ctx = ctx
  }
  action() {
    console.log('init action')
    //
  }
}
