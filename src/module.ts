import { defineNuxtModule } from '@nuxt/kit'
import { resolveSources, createFeedTemplate } from './feed'
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
    const {
      options: commonOptions,
      create: commonCreate,
      data: commonData,
      sources
    } = options
    const _sources = await resolveSources(sources)

    nuxt.hook('build:done', () => {
      const feedTemplates = _sources.map((source) => {
        return createFeedTemplate(nuxt, { source, commonOptions, commonCreate, commonData })
      })
      console.log(feedTemplates)
    })
  }
})
