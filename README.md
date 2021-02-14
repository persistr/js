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

Events are always appended to the stream.

The first argument to `event()` is the event type and the second argument is the event data.

#### Reading events from a single stream

Pass event selectors to `stream.events()` and then process each matching event:

```
await stream.events({ until: 'caught-up', limit: 5 }).each(event => console.log(event))
```

The value `caught-up` for the `until` selector is a special value that ends the iteration once the end of the event stream is reached. Without it, you'd smoothly transition from reading historical events to listening to real-time events. Here's an example of that:

```
await stream.events().each(event => console.log(event))
```

The above `await` will never complete because `stream.events()` without any selectors will simply listen forever to real-time events.

#### Reading events from multiple streams

Often, you'll want to read events from any event stream. To do that, invoke `events()` on the database instead:

```
await db.events({ until: 'caught-up', limit: 5 }).each(event => console.log(event))
```

That will display the first 5 events in the database, regardless of what event stream they belong to.

To establish a real-time subscription, omit the `until` selector:

```
await db.events().each(event => console.log(event))
```

This will read all historical events followed by all real-time events.

#### Cleaning up

Close the database when you're done.

```
await db.close()
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations (LGPL).
