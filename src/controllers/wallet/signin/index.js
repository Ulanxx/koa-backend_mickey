import logic from '../../../business/wallet/signin/index'
import { responseHandler } from '../../../common/utils'
import { RESPONSE_CODE } from '../../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()

const schemaRequest = {
  id: '/wallet/signin',
  type: 'object',
  properties: {
    code: {
      type: 'string',
    }
  },
  required: ['code']
}

module.exports.action = {}
module.exports.action.POST = async (ctx) => {
  const { code } = ctx.request.body
  let result = null
  try {
    result = await logic(code)
    responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, result)
  } catch (e) {
    responseHandler(ctx, 200, e || RESPONSE_CODE.FAIL_LOGIN, result)
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
