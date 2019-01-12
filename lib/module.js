import path from 'path'
import fs from 'fs-extra'
import AsyncCache from 'async-cache'
import { promisify } from 'util'
import { Feed } from 'feed'
import consola from 'consola'

const logger = consola.withScope('nuxt:feed')

const defaults = {
  path: '/feed.xml',
  async create (feed) {},
  cacheTime: 1000 * 60 * 15
}

export default async function feed () {
  // Factory function
  if (typeof this.options.feed === 'function') {
    this.options.feed = await this.options.feed()
  }

  // Factory object
  if (!Array.isArray(this.options.feed)) {
    if (this.options.feed.factory) {
      this.options.feed = await this.options.feed.factory(this.options.feed.data)
    }
  }

  // Single feed
  if (!Array.isArray(this.options.feed)) {
    this.options.feed = [this.options.feed]
  }

  const options = Object.assign([], this.options.feed).map(o => Object.assign({}, defaults, o))

  const feedCache = new AsyncCache({
    load (feedIndex, callback) {
      createFeed(options[feedIndex], callback).catch(err => /* istanbul ignore next */ logger.error(err))
    }
  })

  feedCache.get = promisify(feedCache.get)

  options.forEach((feedOptions, index) => {
    this.nuxt.hook('generate:before', async () => {
      const xmlGeneratePath = path.resolve(this.options.srcDir, path.join('static', feedOptions.path))
      await fs.removeSync(xmlGeneratePath)
      await fs.outputFile(xmlGeneratePath, await feedCache.get(index))
    })

    this.addServerMiddleware({
      path: feedOptions.path,
      async handler (req, res, next) {
        try {
          const xml = await feedCache.get(index)
          res.setHeader('Content-Type', resolveContentType(feedOptions.type))
          res.end(xml)
        } catch (err) /* istanbul ignore next */ {
          next(err)
        }
      }
    })
  })
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
    feed.options = Object.assign({ generator: 'https://github.com/nuxt-community/feed-module' }, feed.options)
  } catch (err) /* istanbul ignore next */ {
    logger.error(err)
    logger.fatal('Error while executing feed creation function')
  }
  return callback(null, feed[feedOptions.type](), feedOptions.cacheTime)
}

module.exports.meta = require('../package.json')
