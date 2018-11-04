import { RESPONSE_CODE, ERROR } from './constants'

/**
 * handler response and handler error
 * @param {object} ctx
 * @param {number} status
 * @param {number} code
 * @param  data
 */
const responseHandler = (ctx, status, code, data) => {
  if (code === RESPONSE_CODE.SUCCERSS) {
    ctx.status = status
    ctx.body = {
      code,
      payload: data
    }
  } else {
    ctx.status = status
    ctx.body = {
      code,
      error: ERROR[code]
    }
  }
}

// max exclusive
const random = (min, max) => {
  if ((min === undefined) && (max === undefined)) {
    return Math.random()
  }
  return Math.floor(Math.random() * (max - min) + min)
}

export {
  random,
  responseHandler,
}
