const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const defaultsOptions = {
  hostname: '127.0.0.1',
}

module.exports = async (opts) => {
  const _opts = {}
  Object.assign(_opts, defaultsOptions, opts)

  const user = encodeURIComponent(opts.user)
  const password = encodeURIComponent(opts.password)
  const { authMechanism } = opts

  const url = `mongodb://${user}:${password}@${opts.host}:${opts.port}/${opts.db}?authMechanism=${authMechanism}&authSource=${opts.authSource}`
  mongoose.set('useCreateIndex', true)
  mongoose.connect(url, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', err => logger.error(`mongodb connection error: ${err}`))
  db.once('open', () => {
    logger.info(`Connected to mongodb with mongoose: ${opts.host}: ${opts.port}`)
  })

  const schemas = {}

  // iterate all src/schemas/*.json
  const files = fs.readdirSync(path.join(__dirname, '..', 'schemas'))

  files.forEach((file) => {
    const fullPath = path.join(__dirname, '../', 'schemas', file)
    const baseName = path.basename(file, '.json')
    if (file.endsWith('.json') && fs.lstatSync(fullPath)
      .isFile()) {
      const data = fs.readFileSync(fullPath, 'utf8')
      const schema = new mongoose.Schema(JSON.parse(data), {
        versionKey: false,
        timestamps: true
      })
      schemas[baseName] = mongoose.model(baseName, schema)
    }
  })

  global.db = schemas
  return async (ctx, next) => {
    ctx.db = schemas
    return next()
  }
}
