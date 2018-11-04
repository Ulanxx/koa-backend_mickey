import config from '../../../framework/config'
import { RESPONSE_CODE } from '../../../common/constants'
import rp from '../../../rp'

/**
 *
 * @returns {Promise<*>}
 */
async function logic(mobile) {
  return new Promise(async (resolve, reject) => {
    try {
      const ModelSMS = global.db.mp_sms_code
      const CurTime = Math.floor(Date.now() / 1000)
      const smsCollectionItem = await ModelSMS.collection.findOne({ mobile })
      if (smsCollectionItem && smsCollectionItem.createdAt) {
        if (CurTime - parseInt(smsCollectionItem.createdAt, 10) < config.SMS.expires_time) {
          reject(RESPONSE_CODE.FAIL_SMS_EXPIRES_SHORT)
          return
        }
      }
      const smsObj = await rp.getSMSCode(mobile, CurTime)
      logger.info(smsObj)
      if (smsObj.code === 200) {
        const saveModel = {
          code: smsObj.obj,
          mobile,
          createdAt: Math.floor(Date.now() / 1000)
        }
        const smsMobileItem = await ModelSMS.collection.findOne({ mobile })
        if (!smsMobileItem) {
          await ModelSMS.collection.insertOne(saveModel)
        } else {
          await ModelSMS.collection.update({ mobile }, saveModel)
        }
        resolve(smsObj.obj)
      } else {
        reject(RESPONSE_CODE.FAIL_SMS)
      }
    } catch (e) {
      logger.error(e)
      reject(RESPONSE_CODE.FAIL_SMS)
    }
  })
}

export default logic
