import CryptoJS from 'crypto-js'
import { RESPONSE_CODE } from '../../../common/constants'
import WXBizDataCrypt from '../../../common/WXBizDataCrypt'
import config from '../../../framework/config'
import rp from '../../../rp'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(token, encryptedData, iv) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelAccount = global.db.mp_account
      const ModelToken = global.db.mp_token
      // 根据token获取手机号码
      const tokenCol = await ModelToken.collection.findOne({ token })
      if (!tokenCol) {
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      const account = await ModelAccount.collection.findOne({ unionId: tokenCol.unionId })
      // const { code, payload: UserInfo } = await rp.getUserInfo(account.mobile)
      // if (code !== 0) {
      //   reject(RESPONSE_CODE.FAIL_WX_USER)
      // }
      const sessionKey = CryptoJS.AES.decrypt(tokenCol.token, tokenCol.unionId)
        .toString(CryptoJS.enc.Utf8)
      const pc = new WXBizDataCrypt(config.wx.appid, sessionKey)
      const { nickName, avatarUrl } = pc.decryptData(encryptedData, iv)
      if (account) {
        resolve({
          mobile: account.mobile,
          nickName,
          avatarUrl,
          // address: UserInfo.walletAddress,
          // role: UserInfo.role
          address: '0xbc6f5f2b827e8a286f3b0bdf0cf0cf80318bf694',
          role: 'OPERATOR'
        })
      } else {
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
    } catch (e) {
      reject(RESPONSE_CODE.FAIL_WX_USER)
    }
  })
}


export default logic
