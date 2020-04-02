const d3 = require('d3-array')
const { DateTime } = require('luxon')
const sift = require('sift')
module.exports = async function(store, { space, domain, from, after, to, until, types, filters, groupby, rollupto, limit, each }) {
  let events = store.events.filter(event => event.meta.space === space && event.meta.domain === domain)

  if (types) {
    types = Array.isArray(types) ? types : [types]
    events = events.filter(event => types.some(type => type === event.meta.type))
  }

  if (filters) {
    filters.forEach(filter => {
      let clone = {}
      Object.keys(filter).forEach(key => {
        if (key.startsWith('$') || key.startsWith('meta.')) {
          clone[key] = filter[key]
        }
        else {
          clone[`data.${key}`] = filter[key]
        }
      })
      events = events.filter(sift(clone))
    })
  }

  if (groupby) {
    if (groupby.timestamp) {
      if (rollupto) {
        events = d3.rollup(events, group => {
          let item = {}
          for (const key of Object.keys(rollupto)) {
            if (rollupto[key] === '$count') {
              item[key] = group.length
            }
          }
          return item
        }, event => DateTime.fromISO(event.meta.ts).toFormat(groupby.timestamp))

        let groups = []
        for (let [key, value] of events) {
          for (const key2 of Object.keys(rollupto)) {
            if (rollupto[key2] === '$key') {
              value[key2] = key
              break
            }
          }
          groups.push(value)
        }

        events = groups
      }
      else {
        events = d3.group(events, event => DateTime.fromISO(event.meta.ts).toFormat(groupby.timestamp))
      }
    }
  }

  for (const event of events) {
    await each(event)
  }

  return undefined
}
