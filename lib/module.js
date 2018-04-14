const path = require('path')
const fs = require('fs-extra')
const AsyncCache = require('async-cache')
const pify = require('pify')
const Feed = require('feed')
const consola = require('consola')

const logger = consola.withScope('nuxt:feed')

const defaults = {
  path: '/feed.xml',
  async create (feed) {},
  cacheTime: 1000 * 60 * 15
}

module.exports = async function feed (moduleOptions) {
  const options = Object.assign([], this.options.feed, moduleOptions).map(o => Object.assign({}, defaults, o))

  const feedCache = new AsyncCache({
    maxAge: options.cacheTime,
    load (feedIndex, callback) {
      createFeed(options[feedIndex], callback)
    }
  })

  feedCache.get = pify(feedCache.get)

  await options.forEach(async (feedOptions, index) => {
    this.nuxt.hook('generate:before', async () => {
      const xmlGeneratePath = path.resolve(this.options.srcDir, path.join('static', feedOptions.path))
      await fs.removeSync(xmlGeneratePath)
      await fs.outputFile(xmlGeneratePath, await feedCache.get(index))
    })

    this.nuxt.hook('generate:extendRoutes', async routes => {
      routes.push(feedOptions.path)
    })
    this.addServerMiddleware({
      path: feedOptions.path,
      handler (req, res, next) {
        feedCache.get(index)
          .then(xml => {
            res.setHeader('Content-Type', resolveContentType(feedOptions.type))
            res.end(xml)
          })
          .catch(/* istanbul ignore next: Nuxt handling */ err => { next(err) })
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
  return lookup.hasOwnProperty(type) ? lookup[type] : 'application/xml'
}

async function createFeed (feedOptions, callback) {
  if (['rss2', 'json1', 'atom1'].indexOf(feedOptions.type) === -1) {
    logger.fatal(`Could not create Feed ${feedOptions.path} - Unknown feed type`)
    return callback(null, '', feedOptions.cacheTime)
  }

  const feed = new Feed()
  await feedOptions.create.call(this, feed)
  return callback(null, feed[feedOptions.type](), feedOptions.cacheTime)
}

module.exports.meta = require('../package.json')
