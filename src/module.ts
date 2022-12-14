import { defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'feed-module',
    configKey: 'feed',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false
    }
  },
  defaults: {
  },
  setup (options, nuxt) {
  }
})
