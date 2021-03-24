const Errors = require('../Errors')
const HTTP = require('../utils/http')

const endpoints = {
	activateAccount: require('./account/activate.js'),
	createAccount: require('./account/create.js'),
	deactivateAccount: require('./account/deactivate.js'),
	destroyAccount: require('./account/destroy.js'),
	getAccount: require('./account/get.js'),
	grantAccount: require('./account/grant.js'),
	profileAccount: require('./account/profile.js'),
	revokeAccount: require('./account/revoke.js'),
	listAccounts: require('./accounts/list.js'),
	destroyAnnotation: require('./annotation/destroy.js'),
	readAnnotation: require('./annotation/read.js'),
	advanceCursor: require('./cursor/advance.js'),
	createCursor: require('./cursor/create.js'),
	destroyCursor: require('./cursor/destroy.js'),
	getCursor: require('./cursor/get.js'),
	readCursor: require('./cursor/read.js'),
	rewindCursor: require('./cursor/rewind.js'),
	listCursors: require('./cursors/list.js'),
	cloneDatabase: require('./database/clone.js'),
	createDatabase: require('./database/create.js'),
	destroyDatabase: require('./database/destroy.js'),
	readDatabase: require('./database/read.js'),
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
  
  async activateAccount (params) {
    return Errors.handle(async () => endpoints.activateAccount(this.http, params))
  }

  async createAccount (params) {
    return Errors.handle(async () => endpoints.createAccount(this.http, params))
  }

  async deactivateAccount (params) {
    return Errors.handle(async () => endpoints.deactivateAccount(this.http, params))
  }

  async destroyAccount (params) {
    return Errors.handle(async () => endpoints.destroyAccount(this.http, params))
  }

  async getAccount (params) {
    return Errors.handle(async () => endpoints.getAccount(this.http, params))
  }

  async grantAccount (params) {
    return Errors.handle(async () => endpoints.grantAccount(this.http, params))
  }

  async profileAccount (params) {
    return Errors.handle(async () => endpoints.profileAccount(this.http, params))
  }

  async revokeAccount (params) {
    return Errors.handle(async () => endpoints.revokeAccount(this.http, params))
  }

  async listAccounts (params) {
    return Errors.handle(async () => endpoints.listAccounts(this.http, params))
  }

  async destroyAnnotation (params) {
    return Errors.handle(async () => endpoints.destroyAnnotation(this.http, params))
  }

  async readAnnotation (params) {
    return Errors.handle(async () => endpoints.readAnnotation(this.http, params))
  }

  async advanceCursor (params) {
    return Errors.handle(async () => endpoints.advanceCursor(this.http, params))
  }

  async createCursor (params) {
    return Errors.handle(async () => endpoints.createCursor(this.http, params))
  }

  async destroyCursor (params) {
    return Errors.handle(async () => endpoints.destroyCursor(this.http, params))
  }

  async getCursor (params) {
    return Errors.handle(async () => endpoints.getCursor(this.http, params))
  }

  async readCursor (params) {
    return Errors.handle(async () => endpoints.readCursor(this.http, params))
  }

  async rewindCursor (params) {
    return Errors.handle(async () => endpoints.rewindCursor(this.http, params))
  }

  async listCursors (params) {
    return Errors.handle(async () => endpoints.listCursors(this.http, params))
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
