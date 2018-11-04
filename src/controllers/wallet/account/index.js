import logic from '../../../business/wallet/account/index'
import { responseHandler } from '../../../common/utils'
import { RESPONSE_CODE } from '../../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()

const schemaRequest = {
  id: '/wallet/account',
  type: 'object',
  properties: {
    token: {
      type: 'string',
    },
    encryptedData: {
      type: 'string',
    },
    iv: {
      type: 'string',
    },
  },
  required: ['token', 'encryptedData', 'iv']
}


module.exports.action = {}
module.exports.action.POST = async (ctx) => {
  const { token, encryptedData, iv } = ctx.request.body
  let result = null
  try {
    result = await logic(token, encryptedData, iv)
    responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, result)
  } catch (e) {
    responseHandler(ctx, 200, e || RESPONSE_CODE.FAIL_WX_USER, result)
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
