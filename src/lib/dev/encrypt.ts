import JSEncrypt from 'jsencrypt-node'
import { config as CONFIG } from '../../core/config.js'

/**
 * 加密
 * @param password
 * @returns
 */
export const encrypt = (password: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(CONFIG.publicKey)
  const time = Date.now()
  const symbol = time + ':' + password
  return encryptor.encrypt(symbol)
}
