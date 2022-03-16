class DatabaseViews {
  constructor(db) {
    this.db = db
    this.registrations = {}
    this.promises = {}
  }

  register (name, type, toolbox) {
    const db = this.db
    this.registrations[name] = { type, toolbox }
    if (!type.extends) {
      this.resume(name)
    }
  }

  async get(name, options) {
    const registration = this.registrations[name]
    const type = registration.type
    if (type.extends) {
      let base = await this.get(type.extends, options)
      return await type.get({ ...registration.toolbox, db: this.db }, base, options)
    }

    let object = await this.db.object(viewname(name)).read() || type.default
    if (type.get) object = await type.get({ ...registration.toolbox, db: this.db }, object, options)
    let plain = { ...object }
    delete plain._type
    delete plain._last
    return plain
  }

  async refresh(name) {
    const promise = this.promises[name]
    if (promise) promise.cancel()

    const registration = this.registrations[name]
    const type = registration.type
    await db.object(viewname(name)).destroy()
    this.promises[name] = db.events({ types: type.events }).each(async event => {
      let object = await db.object(viewname(name)).read() || type.default
      object = await type.on({ ...registration.toolbox, db }, object, event) || {}
      await db.object(viewname(name), { ...object, _last: event.meta }).write()
    })
  }

  async resume(name) {
    const promise = this.promises[name]
    if (promise) return

    const db = this.db
    const registration = this.registrations[name]
    const type = registration.type
    let view = await db.object(viewname(name)).read() || type.default
    let selector = { types: type.events }
    if (view && view._last && view._last.stream && view._last.id) selector.after = `${view._last.stream}.${view._last.id}`
    this.promises[name] = db.events(selector).each(async event => {
      let object = await db.object(viewname(name)).read() || type.default
      object = await type.on({ ...registration.toolbox, db }, object, event) || {}
      await db.object(viewname(name), { ...object, _last: event.meta }).write()
    })
  }
}

function viewname(name) {
  return `view_${name.replace(/[^a-zA-Z0-9]+/gi, '')}`
}

module.exports = DatabaseViews
