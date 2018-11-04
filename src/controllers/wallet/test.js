import { responseHandler } from '../../common/utils'
import { RESPONSE_CODE } from '../../common/constants'

const { Validator } = require('jsonschema')

const jsonValidator = new Validator()
module.exports.action = {}
module.exports.action.GET = async (ctx) => {
  responseHandler(ctx, 200, RESPONSE_CODE.SUCCERSS, 'success')
}

module.exports.validation = {}
/**
 * @return {boolean}
 */
module.exports.validation.POST = () => (true)
