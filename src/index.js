/* eslint-disable global-require */
import http from 'http'
import { logger } from './framework/log4js'
import config from './framework/config'
import appRoutine from './framework/middleware_scaffold'

async function main() {
  const APP_NAME = 'Mickey Purse Service'
  global.APP_NAME = APP_NAME
  require('./framework/signal')
  logger.info(`------------- ${APP_NAME} starts --------------`)
  // start the server
  const app = await appRoutine()
  http.createServer(app.callback())
    .listen(config.server.port)
  logger.info(`server ip: ${config.server.ip}`)
  logger.info(`server port: ${config.server.port}`)
}

main()
