import axios from 'axios'
import F from './file'
import { Log, getLocalCookies, setJSONString } from './tool'
import { config as CONFIG } from '../config'

export const get = <T>(url: string): Promise<{ data: T }> => {
  const cookie = getLocalCookies()?.data
  if (!cookie) {
    Log.error('本地cookie加载失败，程序中断')
    process.exit(0)
  }
  return new Promise(async (resolve, reject) => {
    const config = {
      url: CONFIG.host + url,
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
        reject(error)
      })
  })
}

export const post = <T>(url: string, params: any, header?: object): Promise<{ data: T }> => {
  return new Promise((resolve, reject) => {
    const config = {
      url: CONFIG.host + url,
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
        reject(error)
      })
  })
}
