const Errors = require('../Errors')
const fs = require('fs')
const HTTP = require('../utils/http')
var MQ = require('../mq')

class API {
  constructor(identity) {
    this.identity = identity
    this.server = process.env.PERSISTR_API_URL || 'https://api.persistr.com'
    this.messages = MQ.create({
      type: 'PubNub',
      subscribeKey: 'sub-c-d2ea0032-8ef6-11e8-a15f-2efe3b6c3d95'
    })
    this.http = new HTTP(this.server, this.identity)
  }
}

function name(folder, file) {
  const noun = folder.charAt(0).toUpperCase() + folder.substr(1)
  const verb = file.replace(/\.js$/, '')
  return `${verb}${noun}`
}

function registerEndpoint(API, subfolder) {
  fs.readdirSync(`${__dirname}/${subfolder}`).forEach(file => {
    // Ignore subfolders.
    const stats = fs.statSync(`${__dirname}/${subfolder}/${file}`)
    if (stats.isDirectory()) {
      return
    }

    // Ignore hidden files.
    if (file.startsWith('.')) {
      return
    }

    // Register individual API endpoint.
    var endpoint = require(`./${subfolder}/${file}`)
    API.prototype[name(subfolder, file)] = async function(params) {
      return Errors.handle(async () => endpoint(this.http, params))
    }
  })
}

function registerEndpoints(API) {
  // Register all endpoints contained in each subfolder.
  const folder = __dirname
  fs.readdirSync(folder).forEach(subfolder => {
    const stats = fs.statSync(`${folder}/${subfolder}`)
    if (stats.isDirectory()) {
      registerEndpoint(API, `${subfolder}`)
    }
  })
}

registerEndpoints(API)

module.exports = API
