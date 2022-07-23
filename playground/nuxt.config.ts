import { defineNuxtConfig } from 'nuxt'
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
    create () {
      console.log('common create function')
    },
    data: ['common data'],
    sources: [
      {
        type: 'rss2',
        path: '/feed.xml',
        options: {},
        create () {
          console.log('source create function')
        },
        data: ['source data']
      }
    ]
  }
})
