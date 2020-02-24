const Stream = require('./Stream')
const Label = require('./Label')

class Pipeline {
  constructor(domain) {
    this.domain = domain
    this.sources = []
    this.transforms = []
    this.destinations = []
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

  events (options) {
    this.sources.push(options)
    return this
  }

  transform (options) {
    if (options.fn) this.transforms.push(options.fn)
    return this
  }

  write (options) {
    this.destinations.push(options)
    return this
  }

  activate() {
    for (const source of this.sources) {
      this.domain.events(source).each(event => {
        // Transform the event.
        let transformedEvent = deepCopy(event)
        for (const transform of this.transforms) {
          transformedEvent = transform(transformedEvent)
        }

        // Remember the original metadata.
        transformedEvent.data._meta = deepCopy(event.meta)

        // Write event to all destinations.
        for (const destination of this.destinations) {
          if (destination.stream && transformedEvent.meta.stream !== destination.stream) {
            this.domain.stream(destination.stream).events().write(transformedEvent)
          }
        }
      })
    }
  }
}

function deepCopy(obj) {
  let copy = {}
  for (const key of Object.keys(obj)) {
    if (typeof(obj[key]) === 'object') {
      copy[key] = deepCopy(obj[key])
    }
    else {
      copy[key] = obj[key]
    }
  }
  return copy
}

module.exports = Pipeline
