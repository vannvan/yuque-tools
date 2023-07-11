export default class Init implements ICommand {
  public name = 'init'
  public description = '初始化配置'
  ctx: any
  constructor() {
    //
  }
  action() {
    console.log('init action')
    //
  }
}
