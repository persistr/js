const Cursor = require('./Cursor')
const Cursors = require('./Cursors')
const DatabaseObject = require('./DatabaseObject')
const DatabaseObjects = require('./DatabaseObjects')
const DatabaseReactions = require('./DatabaseReactions')
const DatabaseViews = require('./DatabaseViews')
const Events = require('./Events')
const Namespace = require('./Namespace')
const Namespaces = require('./Namespaces')
const Stream = require('./Stream')
const Streams = require('./Streams')

const glob = require('glob')
const path = require('path')

class Database {
  constructor(name, account) {
    this.name = name
    this.account = account
    this.objects = new DatabaseObjects(this)
    this.reactions = new DatabaseReactions(this)
    this.views = new DatabaseViews(this)
  }

  get api() {
    return this.account.api
  }

  use (db) {
    return new Database(db, this.account)
  }

  async close() {
    await this.account.close()
  }

  namespaces() {
    return new Namespaces(this)
  }

  namespace(name) {
    return this.ns(name)
  }

  ns(name) {
    return new Namespace(name, this)
  }

  streams(options) {
    if (options.ns) options.ns = this.ns(options.ns)
    return new Streams({ ...options, db: this })
  }

  events (options) {
    return new Events({ ...options, db: this })
  }

  stream(id) {
    return this.ns('').stream(id)
  }

  cursors () {
    return new Cursors(this)
  }

  cursor(name, options) {
    return new Cursor(this, name, options)
  }

  object(id, data) {
    return new DatabaseObject(this, id, data)
  }

  async domain({ folder, tools }) {
    // Configure toolbox with default and user-supplied tools.
    const toolbox = { ...tools, db: this }

    function glob_root(pattern, root, subfolder, options) {
      return glob.sync(pattern, { ...options, cwd: path.resolve(root, subfolder) })
        .map(file => {
          const info = { ...path.parse(file), relpath: file, abspath: path.resolve(root, subfolder, file) }
          info.id = [ info.dir.replace('/', '.'), info.name ].join('.').replace(/^\./, '')
          return info
        })
    }

    // Register all domain objects.
    for (const file of glob_root('**/*.js', folder, 'objects', { ignore: [ '**/commands/*', '**/events/*' ]})) {
      this.objects.register(file.id.replace(/\.index$/, ''), require(file.abspath), toolbox)
    }

    // Register all domain views.
    for (const file of glob_root('**/*.js', folder, 'views', {})) {
      this.views.register(file.id, require(file.abspath), toolbox)
    }

    // Register all domain reactions.
    for (const file of glob_root('**/*.js', folder, 'reactions', {})) {
      this.reactions.register(file.id, require(file.abspath), toolbox)
    }
  }

  async create() {
    await this.api.createDatabase({ db: this.name })
    return this
  }

  async destroy() {
    await this.api.destroyDatabase({ db: this.name })
  }

  async rename(name) {
    await this.api.renameDatabase({ db: this.name, to: name })
    this.name = name
    return this
  }

  async grant({ role, email }) {
    await this.api.grantAccount({ db: this.name, role, email })
    return this
  }

  async revoke({ email }) {
    await this.api.revokeAccount({ db: this.name, email })
    return this
  }
}

module.exports = Database
