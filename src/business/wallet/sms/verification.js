import moment from 'moment'
import { RESPONSE_CODE } from '../../../common/constants'
import rp from '../../../rp'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(mobile, code, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelAccount = global.db.mp_account
      const ModelToken = global.db.mp_token
      const tokenCol = await ModelToken.collection.findOne({ token })
      if (!tokenCol) {
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      const result = await rp.checkSMSCode(mobile, code)
      if (result.code === 200) {
        // 登陆成功 -> 保存用户mobile和openid
        const saveModel = {
          mobile,
          unionId: tokenCol.unionId,
          createdAt: moment()
            .format('YYYY-MM-DD HH:mm:ss')
        }
        const modelFind = await ModelAccount.collection.findOne({ unionId: tokenCol.unionId })
        if (modelFind) {
          await ModelAccount.collection.update({ unionId: tokenCol.unionId }, saveModel)
        } else {
          await ModelAccount.collection.insertOne(saveModel)
        }
        resolve('')
      } else {
        reject(RESPONSE_CODE.FAIL_SMS_CHECK)
      }
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_SMS_CHECK)
    }
  })
}

export default logic
