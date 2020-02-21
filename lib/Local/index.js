const Errors = require('../Errors')

const endpoints = {
	destroyAnnotation: require('./annotation/destroy.js'),
	readAnnotation: require('./annotation/read.js'),
	createDomain: require('./domain/create.js'),
	destroyDomain: require('./domain/destroy.js'),
	readDomain: require('./domain/read.js'),
	truncateDomain: require('./domain/truncate.js'),
	listDomains: require('./domains/list.js'),
	destroyEvent: require('./event/destroy.js'),
	readEvent: require('./event/read.js'),
	invokeFunction: require('./function/invoke.js'),
	registerFunction: require('./function/register.js'),
	mqSettings: require('./settings/mq.js'),
	destroySpace: require('./space/destroy.js'),
	listSpaces: require('./spaces/list.js'),
	annotateStream: require('./stream/annotate.js'),
	destroyStream: require('./stream/destroy.js'),
	readStream: require('./stream/read.js'),
	writeStream: require('./stream/write.js'),
	listStreams: require('./streams/list.js'),
	getType: require('./type/get.js'),
	setType: require('./type/set.js')
}

class API {
  constructor() {
    this.store = {
      events: [],
      index: {
        events: {}
      },
      annotations: {},
      functions: {},
      types: {}
    }
  }
  
  async destroyAnnotation (params) {
    return Errors.handle(async () => endpoints.destroyAnnotation(this.store, params))
  }

  async readAnnotation (params) {
    return Errors.handle(async () => endpoints.readAnnotation(this.store, params))
  }

  async createDomain (params) {
    return Errors.handle(async () => endpoints.createDomain(this.store, params))
  }

  async destroyDomain (params) {
    return Errors.handle(async () => endpoints.destroyDomain(this.store, params))
  }

  async readDomain (params) {
    return Errors.handle(async () => endpoints.readDomain(this.store, params))
  }

  async truncateDomain (params) {
    return Errors.handle(async () => endpoints.truncateDomain(this.store, params))
  }

  async listDomains (params) {
    return Errors.handle(async () => endpoints.listDomains(this.store, params))
  }

  async destroyEvent (params) {
    return Errors.handle(async () => endpoints.destroyEvent(this.store, params))
  }

  async readEvent (params) {
    return Errors.handle(async () => endpoints.readEvent(this.store, params))
  }

  async invokeFunction (params) {
    return Errors.handle(async () => endpoints.invokeFunction(this.store, params))
  }

  async registerFunction (params) {
    return Errors.handle(async () => endpoints.registerFunction(this.store, params))
  }

  async mqSettings (params) {
    return Errors.handle(async () => endpoints.mqSettings(this.store, params))
  }

  async destroySpace (params) {
    return Errors.handle(async () => endpoints.destroySpace(this.store, params))
  }

  async listSpaces (params) {
    return Errors.handle(async () => endpoints.listSpaces(this.store, params))
  }

  async annotateStream (params) {
    return Errors.handle(async () => endpoints.annotateStream(this.store, params))
  }

  async destroyStream (params) {
    return Errors.handle(async () => endpoints.destroyStream(this.store, params))
  }

  async readStream (params) {
    return Errors.handle(async () => endpoints.readStream(this.store, params))
  }

  async writeStream (params) {
    return Errors.handle(async () => endpoints.writeStream(this.store, params))
  }

  async listStreams (params) {
    return Errors.handle(async () => endpoints.listStreams(this.store, params))
  }

  async getType (params) {
    return Errors.handle(async () => endpoints.getType(this.store, params))
  }

  async setType (params) {
    return Errors.handle(async () => endpoints.setType(this.store, params))
  }
}

module.exports = API
