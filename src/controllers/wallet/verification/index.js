import logic from '../../../business/wallet/verification/index'
import { responseHandler } from '../../../common/utils'
import { RESPONSE_CODE } from '../../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()

const schemaRequest = {
  id: '/wallet/verification',
  type: 'object',
  properties: {
    token: {
      type: 'string',
    },
    content: {
      type: 'object'
    }
  },
  required: ['token', 'content']
}

module.exports.action = {}
module.exports.action.POST = async (ctx) => {
  const { token, content } = ctx.request.body
  let result = null
  try {
    result = await logic(token, content)
    responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, result)
  } catch (e) {
    responseHandler(ctx, 200, e || RESPONSE_CODE.FAIL_VERIFICATION, result)
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
