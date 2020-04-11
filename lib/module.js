const { join, resolve } = require('path')
const { promisify } = require('util')
const { writeFileSync } = require('fs')
const { Feed } = require('feed')
const AsyncCache = require('async-cache')
const logger = require('./logger')

const defaults = {
  path: '/feed.xml',
  async create (feed) {},
  cacheTime: 1000 * 60 * 15
}

module.exports = async function (moduleOptions) {
  const options = [
    ...await parseOptions(this.options.feed),
    ...await parseOptions(moduleOptions)
  ].map(o => ({ ...defaults, ...o }))

  const feedCache = new AsyncCache({
    load (feedIndex, callback) {
      createFeed(options[feedIndex], callback).catch(err => logger.error(err))
    }
  })

  feedCache.get = promisify(feedCache.get)

  options.forEach((feedOptions, index) => {
    this.nuxt.hook('generate:done', async () => {
      if (index === 0) {
        logger.info('Generating feeds')
      }

      const xmlGeneratePath = resolve(this.options.rootDir, join(this.options.generate.dir, feedOptions.path))

      writeFileSync(xmlGeneratePath, await feedCache.get(index))

      logger.success('Generated', feedOptions.path)
    })

    this.addServerMiddleware({
      path: feedOptions.path,
      async handler (req, res, next) {
        try {
          const xml = await feedCache.get(index)
          res.setHeader('Content-Type', resolveContentType(feedOptions.type))
          res.end(xml)
        } catch (err) {
          next(err)
        }
      }
    })
  })
}

async function parseOptions (options) {
  // Factory function
  if (typeof options === 'function') {
    options = await options()
  }

  // Factory object
  if (!Array.isArray(options)) {
    if (options.factory) {
      options = await options.factory(options.data)
    }
  }

  // Check if is empty
  if (Object.keys(options).length === 0) {
    return []
  }

  // Single feed
  if (!Array.isArray(options)) {
    options = [options]
  }

  return options
}

function resolveContentType (type) {
  const lookup = {
    rss2: 'application/rss+xml',
    atom1: 'application/atom+xml',
    json1: 'application/json'
  }
  return (lookup.hasOwnProperty(type) ? lookup[type] : 'application/xml') + '; charset=UTF-8'
}

async function createFeed (feedOptions, callback) {
  if (!['rss2', 'json1', 'atom1'].includes(feedOptions.type)) {
    logger.fatal(`Could not create Feed ${feedOptions.path} - Unknown feed type`)
    return callback(null, '', feedOptions.cacheTime)
  }

  const feed = new Feed()

  try {
    await feedOptions.create.call(this, feed, feedOptions.data)
    feed.options = {
      generator: 'https://github.com/nuxt-community/feed-module',
      ...feed.options
    }
  } catch (err) {
    logger.error(err)
    logger.fatal('Error while executing feed creation function')

    return callback(null, '', feedOptions.cacheTime)
  }

  return callback(null, feed[feedOptions.type](), feedOptions.cacheTime)
}

module.exports.meta = require('../package.json')
