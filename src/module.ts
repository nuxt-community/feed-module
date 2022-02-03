import { defineNuxtModule } from '@nuxt/kit';

import { FeedSource, FeedSourcesFactory } from './types';
import { resolveModuleOptions } from './lib/resolveModuleOptions';
import { generateFeedFile } from './lib/generateFeedFile';

export * from './types';

export interface ModuleOptions {
  sources: FeedSourcesFactory | FeedSource[];
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    feed?: ModuleOptions;
  }
  interface NuxtOptions {
    feed?: ModuleOptions;
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/feed',
    configKey: 'feed'
  },
  setup(moduleOptions, nuxt) {
    nuxt.hook('build:before', async () => {
      const FeedSources = await resolveModuleOptions(moduleOptions.sources);

      const generateFileWithNuxtBound = generateFeedFile.bind(
        nuxt
      ) as typeof generateFeedFile;

      await Promise.all(FeedSources.map(generateFileWithNuxtBound));
    });
  }
});
