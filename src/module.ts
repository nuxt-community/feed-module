import { defineNuxtModule } from '@nuxt/kit'
import { join } from 'pathe'
import { createFeedTemplate, resolveSources, writeFeedFile } from './feed'
import type { FeedSource, FeedSourcesFactory } from './feed'

export interface ModuleOptions {
  sources: FeedSource[] | FeedSourcesFactory
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/feed',
    configKey: 'feed',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false
    }
  },
  defaults: {
    sources: []
  },
  async setup (options, nuxt) {
    const sources = await resolveSources(options.sources)

    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('close', async () => {
        const routes = (nitro._prerenderedRoutes || []).filter(prerenderedRoute => prerenderedRoute.fileName?.endsWith('.html'))
        const publicDir = nitro.options.output.publicDir

        await Promise.all(sources.map(async (source) => {
          const { dst, contents } = await createFeedTemplate({
            dst: join(publicDir, source.path),
            options: { source, routes }
          })

          await writeFeedFile(dst, contents)
        }))
      })
    })
  }
})
