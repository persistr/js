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
  const space = await account.space(uuidv4()).create()
  const domain = await space.domain('demo').create()

  // Listen to all events being saved to any stream within the demo domain.
  let count = 0;
  domain.events().each(async (event, subscription) => {
    console.log(event)
    count++

    // After receiving 10 events, clean up by deleting the space and all its content,
    // including domains, streams, and events.
    if (count == 10) {
      await subscription.cancel()
      await space.destroy()
      process.exit()
    }
  })

  // Create several event streams and save some events.
  for (let index = 0; index < 10; index++) {
    setTimeout(() => {
      domain.stream(uuidv4()).events().write({ data: { hello: `world ${index}` }})
    }, (index + 1) * 1000)
  }

  // Although we've reached the end of main(), application won't exit. This is because
  // there is an event listener still active above (the domain events listener).
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
