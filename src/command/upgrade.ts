import latestVersion from 'latest-version'
export default class Upgrade implements ICommand {
  public name = 'upgrade'
  public description = '工具升级'
  ctx: TCLIContext
  constructor(ctx: TCLIContext) {
    this.ctx = ctx
  }
  async action() {
    // console.log(this.ctx)

    const { cliInfo } = this.ctx

    const currentVersion = cliInfo.version

    const latestV = await latestVersion('yuque-tools')

    if (currentVersion != latestV) {
      console.log('有新版本')
      console.log('latestV', latestV)
    }
  }
}
