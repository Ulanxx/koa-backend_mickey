import config from './config'

const path = require('path')

const Koa = require('koa')
const cors = require('koa-cors')
const bodyParser = require('koa-json-body')
const requestDebugging = require('../middlewares/request_debugging')
const responseDebugging = require('../middlewares/response_debugging')
const db = require('../middlewares/mongodb_mongoose')
const route = require('../middlewares/route')

const routeConfig = require(path.join(process.cwd(), 'config', 'routes.json')) // eslint-disable-line import/no-dynamic-require
const app = new Koa()

export default async () => {
  app.use(await db(config.database))
  app.use(bodyParser({ fallback: true }))
  app.use(requestDebugging())
  app.use(cors())
  // routes
  app.use(route(routeConfig))
  app.use(responseDebugging())
  return app
}
