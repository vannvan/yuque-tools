import axios from 'axios'
import F from './dev/file.js'
import { getLocalCookies, setJSONString } from './tool.js'
import { config as CONFIG } from '../core/config.js'
import path from 'path'
import { Log } from './dev/log.js'

const getHost = () => {
  const configUserInfo = JSON.parse(F.read(path.resolve(CONFIG.localConfig))) || {}
  const { host } = configUserInfo
  return host || CONFIG.host
}

export const get = <T>(url: string): Promise<{ data: T }> => {
  const cookie = getLocalCookies()?.data

  if (!cookie) {
    Log.error('本地cookie加载失败，程序中断')
    process.exit(0)
  }
  return new Promise(async (resolve, reject) => {
    // console.log('请求地址', getHost() + url)
    const config = {
      url: getHost() + url,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        cookie: cookie,
      },
    }
    axios(config)
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        Log.error(error.code)
        reject(error.code)
      })
  })
}

export const post = <T>(url: string, params: any, header?: object): Promise<{ data: T }> => {
  return new Promise((resolve, reject) => {
    //  登录接口统一使用yuque域名
    const config = {
      url: (/login/.test(url) ? CONFIG.host : getHost()) + url,
      method: 'post',
      data: params,
      headers: Object.assign(header || {}, {
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        cookie: getLocalCookies(),
      }),
    }
    axios(config)
      .then((res) => {
        if (res.headers['set-cookie']) {
          const cookieContent = setJSONString({
            expired: Date.now(),
            data: res.headers['set-cookie'],
          })
          F.touch2(CONFIG.cookieFile, cookieContent)
        }
        resolve(res.data)
      })
      .catch((error) => {
        Log.error(error.code)
        reject(error.code)
      })
  })
}
