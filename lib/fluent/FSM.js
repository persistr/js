class FSM {
  constructor(rules) {
    this.rules = rules
  }

  on(aggregate, event) {
    for (const rule of this.rules) {
      if (rule.on === event.data.transaction) {
        var shouldDoAction = true
        if (rule.where && !rule.where(aggregate, event)) {
          shouldDoAction = false
        }

        if (shouldDoAction) {
          if (rule.do) rule.do(aggregate, event)
        }
      }
    }
  }
}

module.exports = FSM
