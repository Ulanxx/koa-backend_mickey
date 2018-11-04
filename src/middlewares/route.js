/* eslint-disable global-require */
const _ = require('lodash')
const Path = require('path')
const pathToRegex = require('path-to-regexp')


const defaultsOptions = {}

function decode(val) {
  if (val) {
    return decodeURIComponent(val)
  }
  return val
}

/**
 * routing as configured
 * before routing:
 * 1. do validation for this endpoint
 * if failed http response status 400, no detailed reason provided
 * if the precondition is satisfied, call controller action.
 * @param opts
 * @returns {function(*=, *): *}
 */

module.exports = (opts) => {
  const _opts = {}
  Object.assign(_opts, defaultsOptions, opts)
  return async (ctx, next) => {
    if (ctx.status >= 200 && ctx.status !== 404) {
      logger.warn(`ctx status -- ${ctx.status}`)
    } else {
      const { path } = ctx.request
      const { method } = ctx
      let m
      const keys = []
      // looking for the routes
      if (_opts.routes) {
        const { routes } = _opts
        const routeFound = _.find(routes, (p) => {
          const methodMatched = (p.method === method)
          const pathRegex = pathToRegex(p.path, keys)
          m = pathRegex.exec(path)
          return !!m && methodMatched
        })
        if (routeFound && m) {
          // find file
          let filePath = m[0]
          m.slice(1)
            .map(decode)
            .forEach((param) => {
              filePath = filePath.replace(`/${param}`, '')
            })
          const actionPath = Path.join('../controllers', filePath)
          // require file
          try {
            const route = require(actionPath) // eslint-disable-line import/no-dynamic-require
            ctx.path_resolved = m
            if (route.validation) {
              let validationFunc
              if ((typeof route.validation[method]) === 'function') {
                validationFunc = route.validation[method]
              } else if ((typeof route.validation) === 'function') {
                validationFunc = route.validation
              } else {
                // defaults to no need to validate
                validationFunc = () => true
              }
              if (!await validationFunc(ctx)) {
                ctx.status = 400
                logger.warn(`[controller validation failed]400 bad request: ${JSON.stringify(ctx.request.body)}`)
              } else if (route.action) {
                if ((typeof route.action[method]) === 'function') {
                  await route.action[method](ctx)
                } else if ((typeof route.action) === 'function') {
                  await route.action(ctx)
                } else {
                  // noinspection ExceptionCaughtLocallyJS
                  throw new Error('controller code is not finished')
                }
              }
            } else if (typeof route === 'function') {
              await route(ctx)
            }
          } catch (err) {
            if (err) {
              ctx.status = err.status
              ctx.body = {
                code: err.code,
                error: err.message
              }
            } else {
              logger.error(err.stack)
              ctx.status = 500
            }
          }
        }
      }
    }
    return next()
  }
}
