jest.mock('async-cache', () => {
  return jest.fn().mockImplementation(() => {
    return { get: () => { throw new Error('Error on create feed') } }
  })
})

const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')
const logger = require('../lib/logger')
const { createFeed } = require('./feed-options')

logger.mockTypes(() => jest.fn())

describe('middleware', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup({
      ...loadConfig(__dirname),
      dev: false,
      feed: [
        { ...createFeed(), ...{ path: '/feed-error.xml' } }
      ]
    }))
  }, 60000)

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
