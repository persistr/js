const uuidv4 = require('uuid/v4')
const { Machine, assign, interpret } = require('xstate')
const EventEmitter = require('events').EventEmitter

class Instance {
  constructor({ type, id, repository, registry }) {
    this.type = type
    this.id = id || uuidv4()
    this.repository = repository || type.repository
    this.stream = this.repository.stream(this.id)
    this.registry = registry || type.registry
    this.emitter = new EventEmitter()
    this.write = event => {
      this.stream.events().write(event)
    }
    this.xstate = Machine(
      {
        id: `${type.name} ${id}`,
        context: type.context,
        states: transpileStates(type.workflow.states, this.repository.api.type !== 'local'),
        initial: type.workflow.initial,
        strict: false
      },
      {
        actions: type.actions,
        services: transpileInvocations(type.invocations || {}, this.registry, this.write, this.repository.api.type !== 'local')
      }
    )
    this.mutations = type.mutations
    this.service = interpret(this.xstate)
    this.service.start()
  }

  data() {
    return { id: this.id, state: this.service.state.value, ...this.service.state.context }
  }

  latest() {
    return this._latest
  }

  get state() {
    return this.service.state.value
  }

  on(event, callback) {
    this.emitter.on(event, callback)
  }

  emit(event, params) {
    this.emitter.emit(event, params)
  }
}

function transpileStates(states, excludeInvocations) {
  for (let state of Object.keys(states)) {
    for (let field of Object.keys(states[state])) {
      if (field === 'invoke') {
        if (excludeInvocations) {
          delete states[state][field]
        }
        else {
          if (Array.isArray(states[state][field])) {
            let list = []
            for (const item of states[state][field]) {
              list.push({ src: item })
            }
            states[state][field] = list
          }
          else {
            states[state][field] = { src: states[state][field] }
          }
        }
      }
    }
  }
  return states
}

function transpileInvocations(invocations, registry, write, exclude) {
  if (exclude) return {}
  for (let service of Object.keys(invocations)) {
    const cb = invocations[service]
    invocations[service] = (context, event) => callback => {
      cb(registry, context, event, evt => write(evt)).invoke()
    }
  }
  return invocations
}

module.exports = Instance
