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
    fs.writeFileSync(`${this.space.name}.${this.domain.name}.${this.stream.name}.${this.id}.json`, JSON.stringify(event))
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
