module.exports = class UnsupportedFilter extends require('./PersistrError') {
  constructor ({ filter, on }) {
    super(`Unsupported filter '${filter}' on ${on}`)
  }
}
