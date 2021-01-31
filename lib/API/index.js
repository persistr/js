const Errors = require('../Errors')
const HTTP = require('../utils/http')

const endpoints = {
	getAccount: require('./account/get.js'),
	grantAccount: require('./account/grant.js'),
	revokeAccount: require('./account/revoke.js'),
	destroyAnnotation: require('./annotation/destroy.js'),
	readAnnotation: require('./annotation/read.js'),
	cloneDatabase: require('./database/clone.js'),
	createDatabase: require('./database/create.js'),
	destroyDatabase: require('./database/destroy.js'),
	renameDatabase: require('./database/rename.js'),
	listDatabases: require('./databases/list.js'),
	destroyEvent: require('./event/destroy.js'),
	readEvent: require('./event/read.js'),
	createNamespace: require('./namespace/create.js'),
	destroyNamespace: require('./namespace/destroy.js'),
	readNamespace: require('./namespace/read.js'),
	renameNamespace: require('./namespace/rename.js'),
	truncateNamespace: require('./namespace/truncate.js'),
	listNamespaces: require('./namespaces/list.js'),
	annotateStream: require('./stream/annotate.js'),
	destroyStream: require('./stream/destroy.js'),
	readStream: require('./stream/read.js'),
	writeStream: require('./stream/write.js'),
	listStreams: require('./streams/list.js')
}

class API {
  constructor(identity, url) {
    this.type = 'persistr'
    this.identity = identity
    this.server = url
    this.http = new HTTP(this.server, this.identity)
  }
  
  async getAccount (params) {
    return Errors.handle(async () => endpoints.getAccount(this.http, params))
  }

  async grantAccount (params) {
    return Errors.handle(async () => endpoints.grantAccount(this.http, params))
  }

  async revokeAccount (params) {
    return Errors.handle(async () => endpoints.revokeAccount(this.http, params))
  }

  async destroyAnnotation (params) {
    return Errors.handle(async () => endpoints.destroyAnnotation(this.http, params))
  }

  async readAnnotation (params) {
    return Errors.handle(async () => endpoints.readAnnotation(this.http, params))
  }

  async cloneDatabase (params) {
    return Errors.handle(async () => endpoints.cloneDatabase(this.http, params))
  }

  async createDatabase (params) {
    return Errors.handle(async () => endpoints.createDatabase(this.http, params))
  }

  async destroyDatabase (params) {
    return Errors.handle(async () => endpoints.destroyDatabase(this.http, params))
  }

  async readDatabase (params) {
    return Errors.handle(async () => endpoints.readDatabase(this.http, params))
  }

  async renameDatabase (params) {
    return Errors.handle(async () => endpoints.renameDatabase(this.http, params))
  }

  async listDatabases (params) {
    return Errors.handle(async () => endpoints.listDatabases(this.http, params))
  }

  async destroyEvent (params) {
    return Errors.handle(async () => endpoints.destroyEvent(this.http, params))
  }

  async readEvent (params) {
    return Errors.handle(async () => endpoints.readEvent(this.http, params))
  }

  async createNamespace (params) {
    return Errors.handle(async () => endpoints.createNamespace(this.http, params))
  }

  async destroyNamespace (params) {
    return Errors.handle(async () => endpoints.destroyNamespace(this.http, params))
  }

  async readNamespace (params) {
    return Errors.handle(async () => endpoints.readNamespace(this.http, params))
  }

  async renameNamespace (params) {
    return Errors.handle(async () => endpoints.renameNamespace(this.http, params))
  }

  async truncateNamespace (params) {
    return Errors.handle(async () => endpoints.truncateNamespace(this.http, params))
  }

  async listNamespaces (params) {
    return Errors.handle(async () => endpoints.listNamespaces(this.http, params))
  }

  async annotateStream (params) {
    return Errors.handle(async () => endpoints.annotateStream(this.http, params))
  }

  async destroyStream (params) {
    return Errors.handle(async () => endpoints.destroyStream(this.http, params))
  }

  async readStream (params) {
    return Errors.handle(async () => endpoints.readStream(this.http, params))
  }

  async writeStream (params) {
    return Errors.handle(async () => endpoints.writeStream(this.http, params))
  }

  async listStreams (params) {
    return Errors.handle(async () => endpoints.listStreams(this.http, params))
  }
}

module.exports = API
