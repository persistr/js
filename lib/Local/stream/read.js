const matcher = require('matcher')
module.exports = async function(store, { space, domain, stream, from, after, to, until, types, limit, each }) {
  let events = store.events.filter(event => event.meta.space === space && event.meta.domain === domain && event.meta.stream === stream)
  if (types) {
    types = Array.isArray(types) ? types : [types]
    events = events.filter(event => types.some(type => matcher.isMatch(event.meta.type, type)))
  }

  for (const event of events) {
    await each(event)
  }

  return undefined
}
