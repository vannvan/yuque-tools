export default class Upgrade implements ICommand {
  public name = 'upgrade'
  public description = '工具升级'
  ctx: any
  constructor() {
    //
  }
  action() {
    console.log('init action')
    //
  }
}
