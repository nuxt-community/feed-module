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
}
