// Load environment variables from .env in project root.
const path = require('path')
const dotEnvPath = path.resolve('./.env')
require('dotenv').config({ path: dotEnvPath })

// Dependencies.
const assert = require('assert')
const { persistr } = require('../lib/persistr')
const uuidv4 = require('uuid/v4')

// Globals.
const account = persistr.account({ credentials: { apikey: process.env.PERSISTR_API_KEY }})
let space = undefined
let domain = undefined

describe('testing', function () {
  after(async function () {
    // Clean-up.
    if (space) await space.destroy()

    // Shutdown test.
    setTimeout(function () {
      process.exit()
    }, 1000)
  })

  describe('race conditions', function () {
    before(async function () {
      this.timeout(5000)

      // Create a new Persistr project for integration testing.
      space = await account.space(uuidv4()).create()
      domain = await space.domain('tests').create()
    })

    describe('emitting event while handling another event', function () {
      it('should not pre-empt current event listener', function (done) {
        this.timeout(5000)

        let stream = domain.stream('54991973-93f4-447d-9cf0-41ab2a840df3')

        let receivedFirst = false
        let receivedSecond = false
        let processedFirst = false
        let processedSecond = false
        domain.events({ after: 'past-events' }).each(async (event, subscription) => {
          console.log(event)
          if (event.meta.type === 'first') {
            assert(!receivedFirst)
            assert(!receivedSecond)
            receivedFirst = true
            await stream.events().write({ meta: { type: 'second' }})
            await new Promise(async (resolve, reject) => {
              setTimeout(() => { resolve() }, 1000)
            })
            await new Promise(async (resolve, reject) => {
              setTimeout(() => {
                assert(receivedFirst)
                assert(!receivedSecond)
                assert(!processedFirst)
                assert(!processedSecond)
                processedFirst = true
                resolve()
              }, 0)
            })
          }
          else if (event.meta.type === 'second') {
            assert(receivedFirst)
            assert(!receivedSecond)
            receivedSecond = true
            await new Promise(async (resolve, reject) => {
              setTimeout(() => {
                assert(receivedFirst)
                assert(receivedSecond)
                assert(processedFirst)
                assert(!processedSecond)
                processedSecond = true
                resolve()
              }, 0)
            })
            await subscription.cancel()
            done()
          }
        })

        stream.events().write({ meta: { type: 'first' }})
      })
    })

  })
})
