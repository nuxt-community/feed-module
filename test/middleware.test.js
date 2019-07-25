jest.setTimeout(60000)
jest.mock('async-cache', () => {
  return jest.fn().mockImplementation(() => {
    return { get: () => { throw new Error('Error on create feed') } }
  })
})

const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')
const logger = require('../lib/logger')
const { createFeed } = require('./feed-options')

const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt, port

logger.mockTypes(() => jest.fn())

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

describe('middleware', () => {
  beforeAll(async () => {
    nuxt = new Nuxt({
      ...config,
      feed: [
        { ...createFeed(), ...{ path: '/feed-error.xml' } }
      ]
    })
    await nuxt.ready()
    await new Builder(nuxt).build()
    port = await getPort()
    await nuxt.listen(port)
  })

  beforeEach(() => {
    logger.clear()
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('error on handler', async () => {
    await expect(get('/feed-error.xml')).rejects.toMatchObject({
      statusCode: 500
    })
  })
})
