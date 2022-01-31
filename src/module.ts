import { defineNuxtModule } from '@nuxt/kit';

import { FeedConfigFactory } from './types/FeedConfigFactory';
import { FeedConfig } from './types/FeedConfig';
import { resolveModuleOptions } from './lib/resolveModuleOptions';
import { generateFeedFile } from './lib/generateFeedFile';

export interface ModuleOptions {
  feed?: FeedConfigFactory | FeedConfig[];
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    feed?: FeedConfigFactory | FeedConfig[];
  }
  interface NuxtOptions {
    feed?: FeedConfigFactory | FeedConfig[];
  }
}

export default defineNuxtModule<FeedConfigFactory | FeedConfig[]>({
  meta: {
    name: '@nuxt-modules/feed',
    configKey: 'feed'
  },
  setup(moduleOptions, nuxt) {
    nuxt.hook('build:done', async () => {
      const feedConfigs = await resolveModuleOptions(moduleOptions);
      const containsFeedsWithInvalidTypes = feedConfigs.some(
        (config) => !['rss2', 'atom1', 'json1'].includes(config.type)
      );

      if (containsFeedsWithInvalidTypes) {
        throw new TypeError('Some feeds contain invalid types');
      }

      const callbackWithNuxtAsThis = generateFeedFile.bind(
        nuxt
      ) as typeof generateFeedFile;

      await Promise.all(feedConfigs.map(callbackWithNuxtAsThis));
    });
  }
});
