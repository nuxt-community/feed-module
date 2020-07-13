jest.setTimeout(60000)

const { resolve, join } = require('path')
const { readFileSync } = require('fs')
const { setup, generate, loadConfig, get } = require('@nuxtjs/module-test-utils')
const logger = require('../lib/logger')
const { createFeed, feedOptions } = require('./feed-options')

const config = loadConfig(__dirname)
config.dev = false

logger.mockTypes(() => jest.fn())

describe('module', () => {
  let nuxt

  beforeEach(() => {
    logger.clear()
  })

  afterEach(async () => {
    if (nuxt) {
      await nuxt.close()
    }
  })

  test('generate simple rss', async () => {
    ({ nuxt } = await generate({
      ...config,
      feed: [
        { ...createFeed(), ...{ path: '/feed.xml' } },
        { ...createFeed(), ...{ path: '/feed2.xml' } }
      ]
    }))

    const filePath = resolve(nuxt.options.rootDir, join(nuxt.options.generate.dir, 'feed.xml'))
    expect(readFileSync(filePath, { encoding: 'utf8' })).toMatchSnapshot()
  })

  test('generate simple rss in subdir', async () => {
    ({ nuxt } = await generate({
      ...config,
      feed: [
        { ...createFeed(), ...{ path: join('/feeds/articles', 'feed.xml') } }
      ]
    }))

    const filePath = resolve(nuxt.options.rootDir, join(nuxt.options.generate.dir, '/feeds/articles', 'feed.xml'))
    expect(readFileSync(filePath, { encoding: 'utf8' })).toMatchSnapshot()
  })

  test('simple rss', async () => {
    ({ nuxt } = await setup(config))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('simple atom', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        createFeed('atom1')
      ]
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('simple json', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        createFeed('json1')
      ]
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('non-latin rss', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        {
          create (feed) {
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
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('object rss', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: {
        data: { title: 'Feed Title' },
        create (feed, data) {
          feedOptions.title = data.title
          feed.options = feedOptions
        },
        type: 'rss2'
      }
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('factory rss', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: {
        data: { title: 'Feed Title' },
        factory: data => ({
          data,
          create (feed, { title }) {
            feedOptions.title = data.title
            feed.options = feedOptions
          },
          type: 'rss2'
        })
      }
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('function rss', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: () => createFeed()
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('multi rss', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        { ...createFeed(), ...{ path: '/feed1.xml' } },
        { ...createFeed(), ...{ path: '/feed2.xml' } }
      ]
    }))

    const html1 = await get('/feed1.xml')
    expect(html1).toMatchSnapshot()

    const html2 = await get('/feed2.xml')
    expect(html2).toMatchSnapshot()
  })

  test('no type set', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        {}
      ]
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()

    expect(logger.fatal).toHaveBeenCalledWith('Could not create Feed /feed.xml - Unknown feed type')
  })

  test('error on create feed', async () => {
    ({ nuxt } = await setup({
      ...config,
      feed: [
        {
          create (feed) {
            throw new Error('Error on create feed')
          },
          type: 'rss2'
        }
      ]
    }))

    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()

    expect(logger.error).toHaveBeenCalledWith(new Error('Error on create feed'))
    expect(logger.fatal).toHaveBeenCalledWith('Error while executing feed creation function')
  })
})
