import logic from '../../../business/wallet/sms/verification'
import { responseHandler } from '../../../common/utils'
import { RESPONSE_CODE } from '../../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()

const schemaRequest = {
  id: '/wallet/sms/verification',
  type: 'object',
  properties: {
    mobile: {
      type: 'string',
    },
    code: {
      type: 'string'
    },
    token: {
      type: 'string'
    }
  },
  required: ['mobile', 'code', 'token']
}

module.exports.action = {}
module.exports.action.POST = async (ctx) => {
  const { mobile, code, token } = ctx.request.body
  let result = null
  try {
    result = await logic(mobile, code, token)
    responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, result)
  } catch (e) {
    responseHandler(ctx, 200, e || RESPONSE_CODE.FAIL_SMS_CHECK, result)
  }
}


module.exports.validation = {}
/**
 * @return {boolean}
 */
module.exports.validation.POST = async (ctx) => {
  const validateResult = jsonValidator.validate(ctx.request.body, schemaRequest)
  return validateResult.valid
}
