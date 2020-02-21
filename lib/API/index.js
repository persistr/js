const Errors = require('../Errors')
const HTTP = require('../utils/http')
var MQ = require('../mq')

const endpoints = {
	allowAccount: require('./account/allow.js'),
	authenticateAccount: require('./account/authenticate.js'),
	disallowAccount: require('./account/disallow.js'),
	getAccount: require('./account/get.js'),
	destroyAnnotation: require('./annotation/destroy.js'),
	readAnnotation: require('./annotation/read.js'),
	continueCursor: require('./cursor/continue.js'),
	createDomain: require('./domain/create.js'),
	destroyDomain: require('./domain/destroy.js'),
	modelDomain: require('./domain/model.js'),
	readDomain: require('./domain/read.js'),
	renameDomain: require('./domain/rename.js'),
	truncateDomain: require('./domain/truncate.js'),
	listDomains: require('./domains/list.js'),
	destroyEvent: require('./event/destroy.js'),
	readEvent: require('./event/read.js'),
	readModel: require('./model/read.js'),
	readObject: require('./object/read.js'),
	listObjects: require('./objects/list.js'),
	mqSettings: require('./settings/mq.js'),
	cloneSpace: require('./space/clone.js'),
	createSpace: require('./space/create.js'),
	destroySpace: require('./space/destroy.js'),
	renameSpace: require('./space/rename.js'),
	listSpaces: require('./spaces/list.js'),
	annotateStream: require('./stream/annotate.js'),
	destroyStream: require('./stream/destroy.js'),
	readStream: require('./stream/read.js'),
	writeStream: require('./stream/write.js'),
	listStreams: require('./streams/list.js'),
	createSubscription: require('./subscription/create.js'),
	destroySubscription: require('./subscription/destroy.js'),
	listSubscriptions: require('./subscriptions/list.js'),
	getType: require('./type/get.js'),
	setType: require('./type/set.js')
}

class API {
  constructor(identity) {
    this.identity = identity
    this.server = process.env.PERSISTR_API_URL || `https://api${suffix(identity.environment)}.persistr.com`
    this.http = new HTTP(this.server, this.identity)
  }
  
  async allowAccount (params) {
    return Errors.handle(async () => endpoints.allowAccount(this.http, params))
  }

  async authenticateAccount (params) {
    return Errors.handle(async () => endpoints.authenticateAccount(this.http, params))
  }

  async disallowAccount (params) {
    return Errors.handle(async () => endpoints.disallowAccount(this.http, params))
  }

  async getAccount (params) {
    return Errors.handle(async () => endpoints.getAccount(this.http, params))
  }

  async destroyAnnotation (params) {
    return Errors.handle(async () => endpoints.destroyAnnotation(this.http, params))
  }

  async readAnnotation (params) {
    return Errors.handle(async () => endpoints.readAnnotation(this.http, params))
  }

  async continueCursor (params) {
    return Errors.handle(async () => endpoints.continueCursor(this.http, params))
  }

  async createDomain (params) {
    return Errors.handle(async () => endpoints.createDomain(this.http, params))
  }

  async destroyDomain (params) {
    return Errors.handle(async () => endpoints.destroyDomain(this.http, params))
  }

  async modelDomain (params) {
    return Errors.handle(async () => endpoints.modelDomain(this.http, params))
  }

  async readDomain (params) {
    return Errors.handle(async () => endpoints.readDomain(this.http, params))
  }

  async renameDomain (params) {
    return Errors.handle(async () => endpoints.renameDomain(this.http, params))
  }

  async truncateDomain (params) {
    return Errors.handle(async () => endpoints.truncateDomain(this.http, params))
  }

  async listDomains (params) {
    return Errors.handle(async () => endpoints.listDomains(this.http, params))
  }

  async destroyEvent (params) {
    return Errors.handle(async () => endpoints.destroyEvent(this.http, params))
  }

  async readEvent (params) {
    return Errors.handle(async () => endpoints.readEvent(this.http, params))
  }

  async readModel (params) {
    return Errors.handle(async () => endpoints.readModel(this.http, params))
  }

  async readObject (params) {
    return Errors.handle(async () => endpoints.readObject(this.http, params))
  }

  async listObjects (params) {
    return Errors.handle(async () => endpoints.listObjects(this.http, params))
  }

  async mqSettings (params) {
    return Errors.handle(async () => endpoints.mqSettings(this.http, params))
  }

  async cloneSpace (params) {
    return Errors.handle(async () => endpoints.cloneSpace(this.http, params))
  }

  async createSpace (params) {
    return Errors.handle(async () => endpoints.createSpace(this.http, params))
  }

  async destroySpace (params) {
    return Errors.handle(async () => endpoints.destroySpace(this.http, params))
  }

  async renameSpace (params) {
    return Errors.handle(async () => endpoints.renameSpace(this.http, params))
  }

  async listSpaces (params) {
    return Errors.handle(async () => endpoints.listSpaces(this.http, params))
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

  async createSubscription (params) {
    return Errors.handle(async () => endpoints.createSubscription(this.http, params))
  }

  async destroySubscription (params) {
    return Errors.handle(async () => endpoints.destroySubscription(this.http, params))
  }

  async listSubscriptions (params) {
    return Errors.handle(async () => endpoints.listSubscriptions(this.http, params))
  }

  async getType (params) {
    return Errors.handle(async () => endpoints.getType(this.http, params))
  }

  async setType (params) {
    return Errors.handle(async () => endpoints.setType(this.http, params))
  }
}

function suffix(environment) {
  if (!environment) return ''
  return `-${environment}`
}

module.exports = API
