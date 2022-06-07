//const Cursor = require('./Cursor')
//const Cursors = require('./Cursors')
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

  get connection() {
    return this.account.connection
  }

  get store() {
    return this.account.store
  }

  use (db) {
    return new Database(db, this.account)
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

/*
  cursors () {
    return new Cursors(this)
  }

  cursor(name, options) {
    return new Cursor(this, name, options)
  }
*/

  object(id, data) {
    return new DatabaseObject(this, id, data)
  }

  async domain({ folder, tools, objects, views, reactions }) {
    // Reset the domain.
    this.objects = new DatabaseObjects(this)
    this.reactions = new DatabaseReactions(this)
    this.views = new DatabaseViews(this)

    // Configure toolbox with default and user-supplied tools.
    const toolbox = { ...tools, db: this }

    function glob_root(pattern, root, subfolder, options) {
      if (!folder) return []
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
    for (const [id, object] of Object.entries(objects ?? {})) {
      this.objects.register(id, object, toolbox)
    }

    // Register all domain views.
    for (const file of glob_root('**/*.js', folder, 'views', {})) {
      this.views.register(file.id, require(file.abspath), toolbox)
    }
    for (const [id, view] of Object.entries(views ?? {})) {
      this.views.register(id, view, toolbox)
    }

    // Register all domain reactions.
    for (const file of glob_root('**/*.js', folder, 'reactions', {})) {
      this.reactions.register(file.id, require(file.abspath), toolbox)
    }
    for (const [id, reaction] of Object.entries(reactions ?? {})) {
      this.reactions.register(id, reaction, toolbox)
    }
  }

  async exists () {
    let db = undefined
    try {
      db = await this.store.databases.find({ name: this.name })
    }
    catch (error) {
      db = undefined
    }
    return (db !== null && db !== undefined)
  }

  async notExists () {
    return !(await this.exists())
  }

  async create() {
    const account = await this.account.profile()
    await this.store.databases.create({ name: this.name, account: account.id })
    return this
  }

  async createIfNotExists () {
    if (await this.notExists()) await this.create()
    return this
  }

  async destroy() {
    await this.store.databases.destroy({ db: this.name })
  }

  async rename(name) {
    await this.store.databases.rename({ db: this.name, to: name })
    this.name = name
    return this
  }

  async grant({ role, email }) {
    await this.store.accounts.grant({ db: this.name, role, email })
    return this
  }

  async revoke({ email }) {
    await this.store.accounts.revoke({ db: this.name, email })
    return this
  }
}

module.exports = Database
