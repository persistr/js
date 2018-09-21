const DomainObject = require('../fluent/DomainObject')
module.exports = {
  reduce: function (options) {
    const cls = options.to
    if (typeof cls === 'object') {
      return s => {
        const spec = options.to
        var o = new DomainObject(spec)
        return s
          .reduce(o, o.reducer)
          .toPromise(Promise)
      }
    }

    return s => {
      var o = new cls()
      return s
        .reduce(o, o.reducer)
        .toPromise(Promise)
    }
  }
}
