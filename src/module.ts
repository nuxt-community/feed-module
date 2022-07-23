import { defineNuxtModule } from '@nuxt/kit'
import { resolveSources } from './feed'
import type { FeedSource, FeedSourcesFactory } from './feed'

export interface ModuleOptions {
  options?: Partial<FeedSource['options']>
  create?: FeedSource['create']
  data?: FeedSource['data']
  sources: FeedSource[] | FeedSourcesFactory
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/feed',
    configKey: 'feed',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    sources: []
  },
  async setup (options, nuxt) {
    console.log(options)
    const sources = await resolveSources(options.sources)
    console.log(sources)
  }
})
