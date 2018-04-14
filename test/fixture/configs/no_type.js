const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../../'),
  srcDir: resolve(__dirname, '../'),
  dev: false,
  render: {
    resourceHints: false
  },
  modules: ['@@'],
  feed: [
    {}
  ]
}
