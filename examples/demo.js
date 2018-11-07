// Creates data used for demos

// This example demonstrates how to write events into an event stream and later
// read them back from the stream. Events are arbitrary JSON objects.

// Read sensitive data like the secret Persistr API key from a local .env file.
require('dotenv').config()

// Dependencies
const { persistr } = require('../lib/persistr')
const uuidv4 = require('uuid/v4')

async function main() {
  // Authenticate with Persistr using an API key. You must have an active Persistr
  // account. Grab your API key from your account details.
  const account = await persistr.account({ credentials: { apikey: process.env.PERSISTR_API_KEY }})

  // Access demo account, space, and domain. If the space doesn't exist, it will be
  // created. Since we're generating a new UUID as the space name, we'll get a brand
  // new space and domain each time this example is run.
  const space = await account.space('finance') //.create()
  const domain = await space.domain('banking') //.create()

  // Create a new event stream.
  const streamID = uuidv4()
  const stream = await domain.stream(streamID)
  console.log(`Created new stream with ID: ${streamID}`)

  // Write several events to the stream we created. Each event represents a completed
  // bank account transaction.
  await stream.events().write([
    { data: { credit: 5000 }, meta: { type: 'account opened' }},
    { data: { credit: 50000 }, meta: { type: 'cheque deposited' }},
    { data: { payee: 'AT&T', debit: 10000 }, meta: { type: 'bill paid' }}
  ])

  // You can also write events one-at-a-time.
  await stream.events().write({ data: { debit: 2000 }, meta: { type: 'cash withdrawn' }})
  await stream.events().write({ data: { debit: 200 }, meta: { type: 'service fee charged' }})
  console.log('Wrote 5 events into the stream')

  // Replay events and display them on command line.
  console.log('Replaying events from the stream')
  await stream.events({ until: 'caught-up' }).each(event => console.log(event))
  console.log('Caught up')

  // Demo data needs to be manually destroyed.
  console.log('Done')
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
