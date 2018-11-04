import logic from '../../../business/wallet/transaction'
import { responseHandler } from '../../../common/utils'
import { RESPONSE_CODE } from '../../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()

const schemaRequest = {
  id: '/wallet/transaction',
  type: 'object',
  properties: {
    token: {
      type: 'string',
    },
    to: {
      type: 'string'
    },
    good: {
      type: 'object'
    },
    tokenId: {
      type: 'string'
    }
  },
  required: ['token', 'to', 'good', 'tokenId']
}

module.exports.action = {}
module.exports.action.POST = async (ctx) => {
  const {
    token,
    to,
    good,
    tokenId
  } = ctx.request.body
  let result = null
  try {
    result = await logic(token, to, good, tokenId)
    responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, result)
  } catch (e) {
    responseHandler(ctx, 200, e || RESPONSE_CODE.FAIL_TRANSACTION, result)
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
