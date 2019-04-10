const fs = require('fs')

class Annotation {
  constructor(stream) {
    this.stream = stream
  }

  get api() {
    return this.account.api
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
    return this.api.destroyAnnotation({ space: this.space.name, domain: this.domain.name, stream: this.stream.id })
  }

  async export() {
    const annotation = await this.read()
    fs.writeFileSync(`${this.space.name}.${this.domain.name}.${this.stream.id}.annotation.json`, JSON.stringify(annotation))
  }

  async read() {
    return this.api.readAnnotation({ space: this.space.name, domain: this.domain.name, stream: this.stream.id })
  }
}

module.exports = Annotation
