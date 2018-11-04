import moment from 'moment/moment'
import { RESPONSE_CODE } from '../../../common/constants'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(token, to, good, tokenId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelAccount = global.db.mp_account
      const ModelToken = global.db.mp_token
      const ModelTransaction = global.db.mp_transaction
      const tokenCol = await ModelToken.collection.findOne({ token })
      if (!tokenCol) {
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      const { mobile } = await ModelAccount.collection.findOne({ unionId: tokenCol.unionId })
      if (!mobile) {
        reject(RESPONSE_CODE.FAIL_WX_USER_CATCH)
      }
      // TODO 调用transfer接口s
      const saveModel = {
        from: mobile,
        good,
        to,
        tokenId,
        createdAt: moment()
          .format('YYYY-MM-DD HH:mm:ss')
      }
      const findOne = await ModelTransaction.collection.findOne({ tokenId })
      if (findOne) {
        reject(RESPONSE_CODE.FAIL_TRANSACTION_DUPLICATE)
      } else {
        const insertOne = await ModelTransaction.collection.insertOne(saveModel)
        if (insertOne.ops) {
          resolve('')
        } else {
          reject(RESPONSE_CODE.FAIL_TRANSACTION)
        }
      }
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_TRANSACTION)
    }
  })
}

export default logic
