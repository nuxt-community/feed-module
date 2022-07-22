import { defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/feed',
    configKey: 'feed',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {},
  setup (options, nuxt) {}
})
