const Errors = require('../Errors')

const endpoints = {
	destroyAnnotation: require('./annotation/destroy.js'),
	readAnnotation: require('./annotation/read.js'),
	createDatabase: require('./database/create.js'),
	destroyDatabase: require('./database/destroy.js'),
	readDatabase: require('./database/read.js'),
	listDatabases: require('./databases/list.js'),
	destroyEvent: require('./event/destroy.js'),
	readEvent: require('./event/read.js'),
	createNamespace: require('./namespace/create.js'),
	destroyNamespace: require('./namespace/destroy.js'),
	readNamespace: require('./namespace/read.js'),
	truncateNamespace: require('./namespace/truncate.js'),
	listNamespaces: require('./namespaces/list.js'),
	destroyObject: require('./object/destroy.js'),
	readObject: require('./object/read.js'),
	writeObject: require('./object/write.js'),
	annotateStream: require('./stream/annotate.js'),
	destroyStream: require('./stream/destroy.js'),
	readStream: require('./stream/read.js'),
	writeStream: require('./stream/write.js'),
	listStreams: require('./streams/list.js')
}

class API {
  constructor() {
    this.type = 'local'
    this.store = {
      events: [],
      index: {
        events: {}
      },
      annotations: {},
      objects: {},
      subscriptions: []
    }
  }
  
  async destroyAnnotation (params) {
    return Errors.handle(async () => endpoints.destroyAnnotation(this.store, params))
  }

  async readAnnotation (params) {
    return Errors.handle(async () => endpoints.readAnnotation(this.store, params))
  }

  async createDatabase (params) {
    return Errors.handle(async () => endpoints.createDatabase(this.store, params))
  }

  async destroyDatabase (params) {
    return Errors.handle(async () => endpoints.destroyDatabase(this.store, params))
  }

  async readDatabase (params) {
    return Errors.handle(async () => endpoints.readDatabase(this.store, params))
  }

  async listDatabases (params) {
    return Errors.handle(async () => endpoints.listDatabases(this.store, params))
  }

  async destroyEvent (params) {
    return Errors.handle(async () => endpoints.destroyEvent(this.store, params))
  }

  async readEvent (params) {
    return Errors.handle(async () => endpoints.readEvent(this.store, params))
  }

  async createNamespace (params) {
    return Errors.handle(async () => endpoints.createNamespace(this.store, params))
  }

  async destroyNamespace (params) {
    return Errors.handle(async () => endpoints.destroyNamespace(this.store, params))
  }

  async readNamespace (params) {
    return Errors.handle(async () => endpoints.readNamespace(this.store, params))
  }

  async truncateNamespace (params) {
    return Errors.handle(async () => endpoints.truncateNamespace(this.store, params))
  }

  async listNamespaces (params) {
    return Errors.handle(async () => endpoints.listNamespaces(this.store, params))
  }

  async readObject (params) {
    return Errors.handle(async () => endpoints.readObject(this.store, params))
  }

  async writeObject (params) {
    return Errors.handle(async () => endpoints.writeObject(this.store, params))
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
}

module.exports = API
