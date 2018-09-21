# eventscentral

Events Central

// Access Persistr and Events Central.
var persistr = require('./lib/persistr')
var eventscentral = new persistr.EventsCentral()

// Connect to Persistr Events Central.
await eventscentral.connect()

await eventscentral.push({
    stream: '3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd',
    id: 'e7849413-72a4-4555-8add-1d8060871b43',
    data: { hello: 'world' },
    meta: {}
})

await eventscentral.each({ stream: '3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd' }, event => {
    console.log(event)
})

eventscentral.stream('3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd')
    .write({
        id: 'e7849413-72a4-4555-8add-1d8060871b44',
        data: { hello: 'world' },
        meta: {}
    })

eventscentral.stream('3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd')
    .on('data', (event) => {
        console.log(event)
    })
    .on('replayed', () => {
        console.log('Caught up with past events. Live processing started.')
    })
    .on('end', () => {
        console.log('End of stream')
    })


var _ = require('highland')

_(eventscentral.stream('3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd', { startWith: 'e7849413-72a4-4555-8add-1d8060871b44' }))
    .take(4)
    .filter(event => event.meta.id == 'e7849413-72a4-4555-8add-1d8060871b44')
    .map(event => JSON.stringify(event) + '\n')
    .pipe(process.stdout)


// Obtain up-to-date version of aggregate.
_(eventscentral.stream('3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd'))
    .filter(event => event.meta.type == 'bankaccount')
    .reduce({}, (aggregate, event) => {
    })


await eventscentral.disconnect()



eventscentral.stream(stream).push({ id: id, data: data, meta: meta })

eventscentral.stream(stream).startWith().filter().each(event => {
  console.log(`Received: ${JSON.stringify(event.data)} ${JSON.stringify(event.meta)}`)
})
