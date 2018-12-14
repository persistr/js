var fs = require('fs')

class Event {
  constructor(stream, id) {
    this.stream = stream
    this.id = id
  }

  get account() {
    return this.space.account
  }

  get space() {
    return this.domain.space
  }

  get domain() {
    return this.stream.domain
  }

  async destroy() {
    return this.account.api.destroyEvent({ space: this.space.name, domain: this.domain.name, stream: this.stream.id, event: this.id })
  }

  async export() {
    const event = await this.read()
    const file = `${this.space.name}.${this.domain.name}.${this.stream.id}.${this.id}.json`
    if (fs.existsSync(file)) fs.truncateSync(file)
    fs.writeFileSync(file, `${JSON.stringify(event)}`)
  }

  async eachLabel(callback) {
    // TODO
    return this
  }

  async read() {
    return this.account.api.readEvent({ space: this.space.name, domain: this.domain.name, stream: this.stream.id, event: this.id })
  }
}

module.exports = Event
