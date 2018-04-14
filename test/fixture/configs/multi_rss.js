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
    {
      path: '/feed.xml',
      create (feed) {
        feed.options = {
          title: 'Feed 0',
          description: 'This is my personal feed!',
          id: 'http://example.com/',
          link: 'http://example.com/',
          image: 'http://example.com/image.png',
          favicon: 'http://example.com/favicon.ico',
          updated: new Date(2000, 6, 14), // optional, default = today
          copyright: 'All rights reserved 2013, John Doe',
          generator: 'awesome', // optional, default = 'Feed for Node.js'
          feedLinks: {
            json: 'https://example.com/json',
            atom: 'https://example.com/atom'
          },
          author: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            link: 'https://example.com/johndoe'
          }
        }
      },
      type: 'rss2'
    },
    {
      path: '/feed1.xml',
      create (feed) {
        feed.options = {
          title: 'Feed 1',
          description: 'This is my personal feed!',
          id: 'http://example.com/',
          link: 'http://example.com/',
          image: 'http://example.com/image.png',
          favicon: 'http://example.com/favicon.ico',
          updated: new Date(2000, 6, 14), // optional, default = today
          copyright: 'All rights reserved 2013, John Doe',
          generator: 'awesome', // optional, default = 'Feed for Node.js'
          feedLinks: {
            json: 'https://example.com/json',
            atom: 'https://example.com/atom'
          },
          author: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            link: 'https://example.com/johndoe'
          }
        }
      },
      type: 'rss2'
    }
  ]
}
