import { random } from '../common/utils'

const defaultsOptions = {}

module.exports = (opts) => {
  const _opts = {}
  Object.assign(_opts, defaultsOptions, opts)
  return async (ctx, next) => {
    ctx._session_id_debugging = random(100000, 500000)
    logger.debug(`[${ctx._session_id_debugging}]request debugging: \n ${ctx.method} ${ctx.request.path}${ctx.request.search}`)
    if (ctx.request.rawBody) {
      logger.debug(`${ctx.request.rawBody}`)
    }
    return next()
  }
}
