const uuidv4 = require('uuid/v4')

class DatabaseObjects {
  constructor(db) {
    this.db = db
    this.types = {}
  }

  register (name, type, toolbox) {
    const db = this.db
    this.types[name] = { type, toolbox }
    db.events({ types: type.events }).each(async event => {
      let object = await db.object(event.meta.stream).read() || {}
      object = await type.on(toolbox, object, event) || {}
      await db.object(event.meta.stream, { ...object, _last: event.meta }).write()
    })
  }

  async create (name) {
    const db = this.db
    const registration = this.types[name]
    const type = registration.type
    let object = { _type: type, id: uuidv4() }
    type.commands.forEach(cmd => {
      object[cmd] = async function (data) {
        let event = await this._type.do({ ...registration.toolbox, db }, this, cmd, data)
        event.meta.stream = this.id
        return await db.stream(this.id).event(event.meta.type, event.data).append()
      }
    })
    await db.object(object.id, object).write()
    return object
  }

  async get(id, options) {
    const object = await this.db.object(id).read()
    if (options && options.plain) {
      let plain = { ...object }
      delete plain._type
      delete plain._last
      return plain
    }
    return object
  }
}

module.exports = DatabaseObjects
