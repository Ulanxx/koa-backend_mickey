import { RESPONSE_CODE } from '../../../common/constants'
import rp from '../../../rp'

/**
 * verification
 * @returns {Promise<*>}
 */
async function logic(token, content) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelToken = global.db.mp_token
      const ModelAccount = global.db.mp_account
      const tokenCol = await ModelToken.collection.findOne({ token })
      if (!tokenCol) { // No token
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      const { mobile } = await ModelAccount.collection.findOne({ unionId: tokenCol.unionId })
      if (!mobile) { // No user
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      resolve(content)
      // // verification from business api by account
      // const {
      //   code: verificationStatus,
      //   payload: verificationData
      // } = await rp.verification(mobile, JSON.stringify(content))
      // if (verificationStatus === 0) {
      //   resolve(verificationData)
      // } else {
      //   resolve({
      //     brand: code.merchandise.brand,
      //     detail: code
      //   })
      //   reject(RESPONSE_CODE.FAIL_VERIFICATION)
      // }
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_VERIFICATION)
    }
  })
}

export default logic
