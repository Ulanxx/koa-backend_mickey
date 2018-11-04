import CryptoJS from 'crypto-js'
import { RESPONSE_CODE } from '../../../common/constants'
import rp from '../../../rp'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelToken = global.db.mp_token
      let result = await rp.getWxSession(code)
      result = JSON.parse(result)
      const tokenCol = await ModelToken.collection.findOne({ unionId: result.openid })
      const token = CryptoJS.AES.encrypt(result.session_key, result.openid)
        .toString()
      const save = {
        token,
        unionId: result.openid
      }
      if (!tokenCol) {
        // 生成token并存储
        await ModelToken.collection.insertOne(save)
      } else {
        await ModelToken.collection.update({ unionId: result.openid }, save)
      }
      resolve(token)
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_LOGIN)
    }
  })
}

export default logic
