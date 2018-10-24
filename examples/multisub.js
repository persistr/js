// This example demonstrates how to have multiple real-time event subscriptions
// in the same node.js application.

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
  await domain.events({ after: 'past-events' }).each(async event => {
    console.log(`Domain event: ${JSON.stringify(event.data)}`)
    count++

    // After receiving 10 events, clean up by deleting the space and all its content,
    // including domains, streams, and events.
    if (count == 10) {
      //await account.subscriptions().cancel()
      await space.destroy()
      //process.exit()
    }
  })

  // Create several event streams and save some events.
  for (let index = 0; index < 10; index++) {
    setTimeout(async () => {
      let streamID = uuidv4()
      await domain.stream(streamID).events({ after: 'past-events' }).each((event, subscription) => {
        console.log(`${streamID} event: ${JSON.stringify(event.data)}`)
        if (!subscription) throw new Error('subscription must not be null')
      })
      await domain.stream(streamID).events().write({ data: { hello: `world ${index}` }})
    }, (index + 1) * 1000)
  }

  // Although we've reached the end of main(), application won't exit. This is because
  // there is an event listener still active above (the domain events listener).
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
