const signalHandler = () => {
  global.logger.info('SIGINT received, exiting....')
  global.logger.info(`------------- ${global.APP_NAME} ends -------------`)
  process.exit()
}

const exitrocess = (code) => {
  logger.info(`process exiting with code= ${code}`)
}
process.on('SIGINT', signalHandler)
process.on('exit', exitrocess)
