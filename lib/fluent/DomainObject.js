const FSM = require('./FSM')

var reducers = {}

class DomainObject {
  constructor(spec) {
    if (spec) {
      // Initialize a brand new instance to sane values.
      if (spec.defaults && (typeof spec.defaults === 'object')) {
        Object.assign(this, spec.defaults)
      }

      // Create a state machine for processing reduction rules.
      if (spec.name && spec.reductions) {
        const cls = spec.name
        reducers[cls] = new FSM(spec.reductions)
      }

      // Remember the name.
      this.name = spec.name
    }
  }

  get reducer() {
    return (aggregate, event) => {
      // Create a state machine for processing reduction rules.
      var cls = this.constructor.name
      if (cls !== 'DomainObject') {
        if (!reducers[cls] && this.reductions) {
          reducers[cls] = new FSM(this.reductions)
        }
      }
      else {
        cls = this.name
      }

      // Execute reduction rules for given event.
      if (reducers[cls]) reducers[cls].on(aggregate, event)

      return aggregate
    }
  }

  get reductions() {
    return []
  }
}

module.exports = DomainObject
