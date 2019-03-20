jest.setTimeout(60000)

const { resolve, join } = require('path')
const { existsSync, removeSync, readFileSync } = require('fs-extra')
const { Nuxt, Builder, Generator } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')
const logger = require('@/logger')
const { createFeed, feedOptions } = require('./feed-options')

const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt, port

logger.mockTypes(() => jest.fn())

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await nuxt.ready()
  await new Builder(nuxt).build()
  port = await getPort()
  await nuxt.listen(port)

  return nuxt
}

describe('module', () => {
  beforeEach(() => {
    logger.clear()
  })

  afterEach(async () => {
    const filePath = resolve(nuxt.options.srcDir, join(nuxt.options.dir.static, 'feed.xml'))
    if (existsSync(filePath)) {
      removeSync(filePath)
    }

    if (nuxt) {
      await nuxt.close()
    }
  })

  test('generate simple rss', async () => {
    nuxt = new Nuxt(config)
    await nuxt.ready()

    const builder = new Builder(nuxt)
    const generator = new Generator(nuxt, builder)
    await generator.generate()

    const filePath = resolve(nuxt.options.srcDir, join(nuxt.options.dir.static, 'feed.xml'))
    expect(readFileSync(filePath, { encoding: 'utf8' })).toMatchSnapshot()
  })

  test('simple rss', async () => {
    nuxt = await setupNuxt(config)

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('simple atom', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        createFeed('atom1')
      ]
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('simple json', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        createFeed('json1')
      ]
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('non-latin rss', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        {
          create(feed) {
            feed.options = {
              title: 'Популярные новости России и мира',
              link: 'http://site.ru/feed.xml',
              description: 'Новости России и мира на сайте site.ru',
              updated: new Date(Date.UTC(2000, 6, 14))
            }
            feed.addContributor({
              name: 'Команда проекта site.ru',
              email: 'support@ site.ru',
              link: 'http://site.ru/'
            })
          },
          type: 'rss2'
        }
      ]
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('object rss', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: {
        data: { title: 'Feed Title' },
        create(feed, data) {
          feedOptions.title = data.title
          feed.options = feedOptions
        },
        type: 'rss2'
      }
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('factory rss', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: {
        data: { title: 'Feed Title' },
        factory: data => ({
          data,
          create(feed, { title }) {
            feedOptions.title = data.title
            feed.options = feedOptions
          },
          type: 'rss2'
        })
      }
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('function rss', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: () => createFeed()
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('multi rss', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        { ...createFeed(), ...{ path: '/feed1.xml' } },
        { ...createFeed(), ...{ path: '/feed2.xml' } }
      ]
    })

    const html1 = await get('/feed1.xml')
    expect(html1).toMatchSnapshot()

    const html2 = await get('/feed2.xml')
    expect(html2).toMatchSnapshot()
  })

  test('no type set', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        {}
      ]
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()

    expect(logger.fatal).toHaveBeenCalledWith('Could not create Feed /feed.xml - Unknown feed type')
  })

  test('error on create feed', async () => {
    nuxt = await setupNuxt({
      ...config,
      feed: [
        {
          create(feed) {
            throw new Error('Error on create feed')
          },
          type: 'rss2'
        }
      ]
    })

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()

    expect(logger.error).toHaveBeenCalledWith(new Error('Error on create feed'))
    expect(logger.fatal).toHaveBeenCalledWith('Error while executing feed creation function')
  })
})
