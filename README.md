# Persistr Javascript SDK

Official Javascript SDK for interacting with Persistr Server and Persistr Cloud

## Installing

#### Node.js

Install the Persistr JS SDK as part of a Node.js project:

```
npm install @persistr/js
```

Then require it in your code:

```
const { persistr } = require('@persistr/js')
```

#### Browser

Use UNPKG - a fast, global content delivery network for everything on npm - to load the Persistr JS SDK into your HTML page:

```
<script crossorigin src="https://unpkg.com/@persistr/js"></script>
```

Alernatively, the `dist` folder contains the minified version of the SDK ready to be loaded into your HTML page. Host and serve it via your own application web server.

In the browser, you'll have access to the global `persistr` object.

## Getting Started

#### Connecting to Persistr Server

Call `connect()` on the `persistr` object and pass in a connection string. Here's an example of connecting to `demo` database on Persistr Server running on `localhost` port 3010 with `demo` username and `demo` password:

```
const { db } = await persistr.connect('persistr://demo:demo@localhost:3010/demo?tls=false')
```

#### Writing events

Once you're connected to a database, you can read or write events. Events are organized into event streams. You can create a brand new event stream by calling `stream()` on the database object:

```
const stream = db.stream()
```

Now write several events into the same stream:

```
await stream.event('open account', { credit: 5000 }).append()
await stream.event('deposit', { credit: 50000 }).append()
await stream.event('pay bill', { payee: 'AT&T', debit: 10000 }).append()
await stream.event('ABM cash withdrawal', { debit: 2000 }).append()
await stream.event('service charge', { debit: 200 }).append()
```

The first argument to `event()` is the event type and the second argument is the event data. Event type is always required but event data is optional. Events are always appended to a stream.


#### Reading events from a single stream

Pass event selectors to `stream.events()` and then process each matching event:

```
await stream.events({ until: 'caught-up', limit: 5 }).each(event => console.log(event))
```

The value `caught-up` for the `until` selector is a special value that ends the iteration once the end of the event stream is reached. Without it, you'd smoothly transition from reading historical events to listening to real-time events. Here's an example of that:

```
await stream.events().each(event => console.log(event))
```

This will read all historical events in the stream followed by a seamless transition to listening to real-time events.

#### Reading events from multiple streams

Often, you'll want to read events from any event stream. To do that, invoke `events()` on the database instead:

```
await db.events({ until: 'caught-up', limit: 5 }).each(event => console.log(event))
```

That will display the first 5 events in the database, regardless of what event stream they belong to. To establish a real-time subscription instead, omit the `until` selector:

```
await db.events().each(event => console.log(event))
```

This will read all historical events followed by listening to real-time events.

#### Event selectors

You can use any of the following selectors in the `events()` function:

- **from**: Start from a specific event instead of from the first event available. The given event is included in the results. *Default:* Start on the first event available
- **after**: Start after a specific event instead of from the first event available. The given event is NOT included in the results. Special value of `past-events` can be used to skip over all historical events and listen only to real-time events. *Default:* Start on the first event available
- **to**: End on a specific event instead of on the last event available. The given event is included in the results. *Default:* No end
- **until**: End just before a specific event. The given event is NOT included in the results. Special value of `caught-up` can be used to end results as soon as all historical events have been processed. *Default:* No end
- **types**: Array of event types to include in results. *Default:* All event types are included in results
- **limit**: Maximum number of events to include in results. *Default:* No maximum

#### Event properties

When you receive an event, it will have `data` and `metadata` properties. Data will contain whatever was passed in when the event was appended to a stream. Metadata is automatically assigned to the event by Persistr and contains:

- **id**: Event identifier. Event IDs are guaranteed to be unique within a stream. A fully-qualified event identifier is composed of database name, stream identifier, and event identifier
- **type**: Event type
- **ts**: Event timestamp in UTC. This timestamp is assigned by Persistr upon writing the event
- **tz**: Timezone of the event producer (the client that wrote the event)
- **db**: Database identifier
- **ns**: Namespace
- **stream**: Stream identifier

#### Cleaning up

Close the database when you're done.

```
await db.close()
```

## Examples

An official collection of example code is [available here](https://github.com/persistr/examples). All examples run out-of-the-box with a default install of Persistr Server on a local machine.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (LGPL).
