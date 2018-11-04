const path = require('path')

let fileName = null

if (process.env.NODE_ENV === 'development') {
  fileName = 'server.dev.json'
} else if (process.env.NODE_ENV) {
  fileName = `server.${process.env.NODE_ENV}.json`
} else {
  // defaults to this config path
  fileName = 'server.json'
}

const config = require(path.join(process.cwd(), 'config', fileName)) // eslint-disable-line import/no-dynamic-require

export default config
