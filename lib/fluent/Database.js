const Cursor = require('./Cursor')
const Cursors = require('./Cursors')
const DatabaseObject = require('./DatabaseObject')
const DatabaseObjects = require('./DatabaseObjects')
const DatabaseViews = require('./DatabaseViews')
const Events = require('./Events')
const Namespace = require('./Namespace')
const Namespaces = require('./Namespaces')
const Stream = require('./Stream')
const Streams = require('./Streams')

const fs = require('fs')
const path = require('path')

class Database {
  constructor(name, account) {
    this.name = name
    this.account = account
    this.objects = new DatabaseObjects(this)
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

    // TODO: Move to 'fs-traversal' package.
    const visit_folder = function(base, dirs, fn) {
      const folder = path.resolve(base, ...dirs)
      fs.readdirSync(folder).forEach(file => {
        if (fs.statSync(`${folder}/${file}`).isDirectory()) return visit_folder(base, [ ...dirs, file ], fn)
        if (file.toLowerCase().endsWith('.js')) fn(base, dirs, folder, file, path.resolve(folder, file))
      })
    }

    // Register all domain objects.
    visit_folder(path.resolve(folder, 'objects'), [], (base, dirs, folder, file, filepath) => {
      this.objects.register(path.parse(file).name, require(filepath), toolbox)
    })

    // Register all domain views.
    visit_folder(path.resolve(folder, 'views'), [], (base, dirs, folder, file, filepath) => {
      this.views.register(`${[ ...dirs, path.parse(file).name ].join('.')}`, require(filepath), toolbox)
    })
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
