const Instance = require('./Instance')
const Errors = require('../Errors')

function define({ name, context, workflow, actions, mutations, invocations, repository, registry }) {
  let fn = function({ name, context, workflow, actions, mutations, invocations, repository, registry }) {
    this.name = name
    this.context = context
    this.workflow = workflow
    this.actions = actions
    this.mutations = mutations
    this.invocations = invocations
    this.repository = repository
    this.registry = registry
  }
  .bind(null, { name, context, workflow, actions, mutations, invocations, repository, registry })

  return new Proxy(fn, {
    construct(Target, args) {
      const t = new Target(...args)

      const { id, repository, registry } = args[0] || {}
      const obj = new Instance({ type: t, id, repository, registry })

      obj.stream.events().each(event => {
        obj.service.send({ type: event.meta.type, data: event.data, meta: event.meta })

        // TODO: If the version number matches, resolve outstanding promise
        if (obj.promise && obj.resolve) {
          obj.resolve()

          obj.promise = undefined
          obj.resolve = undefined
          obj.reject = undefined
        }

        obj.emit('mutated', event)
      })

      const handler = {
        get: function(obj, prop) {
          if (prop in obj) return obj[prop]
          if (prop in obj.service.state.context) return obj.service.state.context[prop]
          if (prop in obj.type.mutations) {
            const fn = obj.type.mutations[prop]
            return new Proxy(fn, {
              apply: async function(target, thisArg, argumentsList) {
                obj.emit('mutating', { mutation: prop, params: argumentsList[0] })

                if (obj.stream.api.type === 'persistr') {
                  // Another command already being processed?
                  if (obj.promise) {
                    throw new Errors.StatusCode('', 409, 'Conflict', `{"error":"Command '${prop}' cannot be executed on out-of-date object"}`)
                  }

                  // TODO: Store a Promise inside the object with expected version number
                  obj.promise = new Promise((resolve, reject) => {
                    obj.resolve = resolve
                    obj.reject = reject
                  })

                  // TODO: This can raise exception if event can't be processed
                  await obj.stream.as(obj.type.name).mutation(prop).invoke(argumentsList[0])

                  // Wait for event to be consumed by domain object.
                  await obj.promise
                }

                if (obj.stream.api.type === 'local') {
                  const event = fn(obj.service.state.context, argumentsList[0])

                  // Does it handle the FOO event?
                  if (!obj.service.state.nextEvents.includes(event.meta.type)) {
                    throw new Errors.StatusCode('', 422, 'Unprocessable Entity', `{"error":"Command '${prop}' cannot be executed in state '${obj.service.state.value}'"}`)
                  }

                  // Another command already being processed?
                  if (obj.promise) {
                    throw new Errors.StatusCode('', 409, 'Conflict', `{"error":"Command '${prop}' cannot be executed on out-of-date object"}`)
                  }

                  // TODO: Store a Promise inside the object with expected version number
                  obj.promise = new Promise((resolve, reject) => {
                    obj.resolve = resolve
                    obj.reject = reject
                  })

                  // TODO: This can raise exception if event can't be processed
                  await obj.stream.events().write(event)

                  // Wait for event to be consumed by domain object.
                  await obj.promise
                }
              }
            })
          }
        }
      }

      const instance = new Proxy(obj, handler)
      return instance
    }
  })
}

module.exports = { define }
