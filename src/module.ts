import { defineNuxtModule } from '@nuxt/kit';

import { FeedConfig, FeedConfigFactory } from './types';
import { resolveModuleOptions } from './lib/resolveModuleOptions';
import { generateFeedFile } from './lib/generateFeedFile';

export interface ModuleOptions {
  sources: FeedConfigFactory | FeedConfig[];
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
    name: '@nuxt-modules/feed',
    configKey: 'feed'
  },
  setup(moduleOptions, nuxt) {
    nuxt.hook('build:before', async () => {
      const feedConfigs = await resolveModuleOptions(moduleOptions.sources);

      const generateFileWithNuxtBound = generateFeedFile.bind(
        nuxt
      ) as typeof generateFeedFile;

      await Promise.all(feedConfigs.map(generateFileWithNuxtBound));
    });
  }
});
