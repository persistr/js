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
  
  destroyAnnotation (params) {
    return Errors.handle(() => endpoints.destroyAnnotation(this.store, params))
  }

  readAnnotation (params) {
    return Errors.handle(() => endpoints.readAnnotation(this.store, params))
  }

  createDatabase (params) {
    return Errors.handle(() => endpoints.createDatabase(this.store, params))
  }

  destroyDatabase (params) {
    return Errors.handle(() => endpoints.destroyDatabase(this.store, params))
  }

  readDatabase (params) {
    return Errors.handle(() => endpoints.readDatabase(this.store, params))
  }

  listDatabases (params) {
    return Errors.handle(() => endpoints.listDatabases(this.store, params))
  }

  destroyEvent (params) {
    return Errors.handle(() => endpoints.destroyEvent(this.store, params))
  }

  readEvent (params) {
    return Errors.handle(() => endpoints.readEvent(this.store, params))
  }

  createNamespace (params) {
    return Errors.handle(() => endpoints.createNamespace(this.store, params))
  }

  destroyNamespace (params) {
    return Errors.handle(() => endpoints.destroyNamespace(this.store, params))
  }

  readNamespace (params) {
    return Errors.handle(() => endpoints.readNamespace(this.store, params))
  }

  truncateNamespace (params) {
    return Errors.handle(() => endpoints.truncateNamespace(this.store, params))
  }

  listNamespaces (params) {
    return Errors.handle(() => endpoints.listNamespaces(this.store, params))
  }

  destroyObject (params) {
    return Errors.handle(() => endpoints.destroyObject(this.store, params))
  }

  readObject (params) {
    return Errors.handle(() => endpoints.readObject(this.store, params))
  }

  writeObject (params) {
    return Errors.handle(() => endpoints.writeObject(this.store, params))
  }

  annotateStream (params) {
    return Errors.handle(() => endpoints.annotateStream(this.store, params))
  }

  destroyStream (params) {
    return Errors.handle(() => endpoints.destroyStream(this.store, params))
  }

  readStream (params) {
    return Errors.handle(() => endpoints.readStream(this.store, params))
  }

  writeStream (params) {
    return Errors.handle(() => endpoints.writeStream(this.store, params))
  }

  listStreams (params) {
    return Errors.handle(() => endpoints.listStreams(this.store, params))
  }
}

module.exports = API
