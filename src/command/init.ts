export default class Init implements ICommand {
  public name = 'init'
  public description = '初始化配置'
  ctx: TCLIContext
  constructor(ctx: TCLIContext) {
    this.ctx = ctx
  }
  action() {
    console.log('init action')
    //
  }
}
