import { RESPONSE_CODE } from '../../../common/constants'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(token) {
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
      const find = await ModelTransaction.find({ from: mobile }, { _id: 0 })
      resolve(find)
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_TRANSACTION)
    }
  })
}

export default logic
