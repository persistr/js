// This example demonstrates how to create a snapshot of data stored in an event stream and
// later retrieve the snapshot. Events are arbitrary JSON objects.

// Read sensitive data like the secret Persistr API key from a local .env file.
require('dotenv').config()

// Dependencies
const Persistr = require('../lib/persistr')
const uuidv4 = require('uuid/v4')

async function main() {
  // Authenticate with Persistr using an API key. You must have an active Persistr
  // account. Grab your API key from your account details.
  const persistr = new Persistr({ apikey: process.env.PERSISTR_API_KEY })

  // Access demo account, space, and domain. If the space doesn't exist, it will be
  // created. Since we're generating a new UUID as the space name, we'll get a brand
  // new space and domain each time this example is run.
  const account = await persistr.account()
  const space = await account.space(uuidv4()).create()
  const domain = await space.domain('demo').create()

  // Create a new event stream.
  const streamID = uuidv4()
  const stream = await domain.stream(streamID)
  console.log(`Created new stream with ID: ${streamID}`)

  // Write several events to the stream we created. Each event represents a completed
  // bank account transaction.
  console.log('Writing events')
  await stream.events().write([
    { data: { transaction: 'open account', credit: 5000 }},
    { data: { transaction: 'deposit', credit: 50000 }},
    { data: { transaction: 'pay bill', payee: 'AT&T', debit: 10000 }},
    { data: { transaction: 'ABM cash withdrawal', debit: 2000 }},
    { data: { transaction: 'service charge', debit: 200 }}
  ])

  // Display current balance.
  let bankAccount = await BankAccount(stream)
  console.log(`Balance = ${bankAccount.balance}`)

  // Write a few more events to the same event stream.
  console.log('Writing more events')
  await stream.events().write([
    { data: { transaction: 'deposit', credit: 500000 }},
    { data: { transaction: 'pay bill', payee: 'Chase', debit: 100000 }}
  ])

  // Display current balance.
  bankAccount = await BankAccount(stream)
  console.log(`Balance = ${bankAccount.balance}`)

  // Clean up by deleting the space and all its content including domains, streams, and events.
  await space.destroy()
  console.log('Done cleaning up')
}

async function BankAccount(stream) {
  // Obtain the most recent snapshot. Or if no snapshot exists, initialize new bank account.
  let bankAccount = await stream.annotation().read() || { balance: 0 }

  // Replay all events in the stream until caught up.
  console.log('Catching up on new events')
  await stream.events({ after: bankAccount.eventID, until: 'caught-up' }).each(event => {
    console.log(event.data)
    bankAccount.eventID = event.meta.id
    if (event.data.credit) bankAccount.balance += event.data.credit
    if (event.data.debit) bankAccount.balance -= event.data.debit
  })

  // Save the snapshot by using the annotation feature of Persistr streams.
  await stream.annotate(bankAccount)

  return bankAccount
}

// Run main() and catch any errors.
async function run(f) { try { await f() } catch (error) { console.log(error.message) }}
run(main)
