const { resolve } = require('path')
const { createFeed } = require('../feed-options')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    { handler: require('../../') }
  ],
  feed: [
    createFeed()
  ]
}
