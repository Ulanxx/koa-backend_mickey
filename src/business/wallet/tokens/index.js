import { RESPONSE_CODE } from '../../../common/constants'
import rp from '../../../rp'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(token) {
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
      // get tokens from business api by account
      // const { code, payload: rawTokens } = await rp.getUserTokens(mobile)
      // if (code !== 0) {
      //   reject(RESPONSE_CODE.FAIL_GET_TOKENS)
      // }
      // logger.info(`rawTokens---${rawTokens}`)
      // const tokens = rawTokens.map(item => (
      //   {
      //     symbol: item.symbol,
      //     name: item.name,
      //     title: item.title,
      //     url: item.url,
      //     description: item.description,
      //     category: item.category,
      //     brand: item.brand,
      //     channel: item.channel,
      //     variants: item.variants,
      //     tokens: {
      //       to: item.tokens.to,
      //       tokenId: item.tokens.tokenId,
      //       blockNumber: item.tokens.blockNumber,
      //       txHash: item.tokens.txHash,
      //       status: item.tokens.status
      //     }
      //   }
      // ))
      resolve([{ brand: 'BT21' }, { brand: 'BT21' }, { brand: 'GUNDAM' }])
    } catch (e) {
      reject(RESPONSE_CODE.FAIL_GET_TOKENS)
    }
  })
}

export default logic
