module.exports = async function(store, { space, domain, from, after, to, until, types, limit, each }) {

  let events = store.events.filter(event => event.meta.space === space && event.meta.domain === domain)

/*
  events = events.filter(event => DateTime.fromISO(event.meta.ts).diff(from).valueOf() > 0)
  diff

  if (from) {
    let dt = DateTime.fromISO(from, { setZone: true })
    if (dt.isValid) {
      conditions += ' AND ts >= ?'
      params.push(dt.toSQL())
      options.from = dt.toSQL()
    }
    else {
      if (!stream) {
        let tokens = after.split('.')
        from = tokens.pop()
        stream = tokens.pop()
      }

      let results = await sql.read('SELECT ts FROM Events WHERE space = ? AND domain = ? AND stream = ? AND id = ?', [ uuid2hex(spaceID), uuid2hex(domainID), uuid2hex(stream), uuid2hex(from) ])
      if (!results || !results[0] || !results[0].ts) throw new Errors.EventNotFound(space, domain, stream, from)

      conditions += ' AND ts >= ?'
      const ts = results[0].ts
      params.push(ts)
      options.from = ts
    }
  }
*/

  if (types) {
    types = Array.isArray(types) ? types : [types]
    events = events.filter(event => types.some(type => type === event.meta.type))
  }

/*
  events.length = limit
    //.filter(event => event.meta.ts
*/

  for (const event of events) {
    await each(event)
  }

  //return events.slice(-1).pop().meta.id
  return undefined
}
