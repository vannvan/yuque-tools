import path from 'path'
import { loginYuque, ytool, getBookStacks } from '../src/sdk/index.js'
import fs from 'fs'

const accountInfo = fs.readFileSync(path.resolve('./yuque.config.json'))
const _accountInfo = JSON.parse(accountInfo.toString())
describe('ytool test', () => {
  it('login yuque failed', async () => {
    console.log('开始登录语雀')
    let login = await loginYuque({
      userName: 'test',
      // password: 'test',
    })

    expect(login).toMatch('登录失败')
  })

  it('login yuque success', async () => {
    let login = await loginYuque({
      userName: _accountInfo.userName,
      password: _accountInfo.password,
    })

    expect(login).toMatch('ok')
  })

  it('init', async () => {
    ytool.init({
      userName: '',
      password: '',
      tocRange: [],
      skipDoc: false,
      linebreak: false,
    })
  })

  it('getBookStacks', async () => {
    console.log(ytool)
    console.log(_accountInfo)

    // getBookStacks()
  })
})
