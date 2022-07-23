import { defineNuxtConfig } from 'nuxt'
import type { Author } from 'feed'
import FeedModule from '..'

export default defineNuxtConfig({
  modules: [
    FeedModule
  ],
  feed: {
    options: {
      title: 'My blog',
      description: 'This is my personal feed!'
    },
    data: {
      name: 'Alexander Lichter',
      email: 'example@lichter.io'
    },
    create (feed, _, commonData) {
      feed.addContributor(commonData as Author)
    },
    sources: [
      {
        type: 'atom1',
        path: '/feed.atom',
        options: {},
        data: 'Atom 1',
        create (feed, data) {
          feed.addCategory(data as string)
        }
      },
      {
        type: 'json1',
        path: '/feed.json',
        options: {},
        data: 'JSON 1',
        create (feed, data) {
          feed.addCategory(data as string)
        }
      },
      {
        type: 'rss2',
        path: '/feed.xml',
        options: {},
        data: 'RSS 2',
        create (feed, data) {
          feed.addCategory(data as string)
        }
      }
    ]
  }
})
