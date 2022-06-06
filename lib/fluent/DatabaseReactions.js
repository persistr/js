class DatabaseReactions {
  constructor(db) {
    this.db = db
    this.registrations = {}
    this.cancellations = {}
  }

  async register (name, type, toolbox) {
    const db = this.db
    this.registrations[name] = { type, toolbox }
    await this.resume(name)
  }

  async get(name, options) {
    const registration = this.registrations[name]
    const type = registration.type

    let context = await this.db.object(reactionname(name)).read() || type.context
    if (type.get) context = await type.get({ ...registration.toolbox, db: this.db }, context, options)
    let plain = { ...context }
    delete plain._type
    delete plain._last
    return plain
  }

  async pause(name) {
    const registration = this.registrations[name]
    const type = registration.type

    const token = this.cancellations[name]
    if (token) {
      token.cancel()
      delete this.cancellations[name]
    }
  }

  async resume(name) {
    const registration = this.registrations[name]
    const type = registration.type

    const token = this.cancellations[name]
    if (token) return

    const db = this.db
    let view = await db.object(reactionname(name)).read() || type.context
    let selector = { types: type.events }
    if (view && view._last && view._last.stream && view._last.id) selector.after = `${view._last.stream}.${view._last.id}`

    const handler = async event => {
      let context = await db.object(reactionname(name)).read() || type.context
      context = await type.on({ ...registration.toolbox, db }, context, event) || context
      await db.object(reactionname(name), { ...context, _last: event.meta }).write()
    }

    this.cancellations[name] = { cancel: () => {} }
    db.events(selector).each(event => { handler(event) }, this.cancellations[name])
  }
}

function reactionname(name) {
  return `reaction_${name.replace(/[^a-zA-Z0-9]+/gi, '')}`
}

module.exports = DatabaseReactions
