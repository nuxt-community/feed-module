import FeedModule from '..'

export default defineNuxtConfig({
  modules: [
    FeedModule
  ],
  feed: {
    sources: [
      {
        type: 'atom1',
        path: '/feed.atom',
        options: {
          id: 'test-id',
          title: 'test-title',
          updated: new Date()
        },
        data: ['Atom 1'],
        create ({ feed, routes, data }) {
          // @ts-ignore for quick debug
          routes.forEach(route => feed.addItem({ link: route.route, content: route.contents }))
          data?.forEach(d => feed.addCategory(d))
        }
      },
      {
        type: 'json1',
        path: '/feed.json',
        options: {
          title: 'test-title'
        },
        data: ['JSON 1'],
        create ({ feed, routes, data }) {
          // @ts-ignore for quick debug
          routes.forEach(route => feed.addItem({ link: route.route, content: route.contents }))
          data?.forEach(d => feed.addCategory(d))
        }
      },
      {
        type: 'rss2',
        path: '/feed.xml',
        options: {
          title: 'test-title',
          description: 'test-description'
        },
        data: ['RSS 2'],
        create ({ feed, routes, data }) {
          // @ts-ignore for quick debug
          routes.forEach(route => feed.addItem({ link: route.route, content: route.contents }))
          data?.forEach(d => feed.addCategory(d))
        }
      }
    ]
  }
})
