import { defineNuxtModule } from '@nuxt/kit';
import { dirname, join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';
import LRUCache from 'lru-cache';

import { ModuleOptions } from './types/ModuleOptions';
import { parseModuleOptions } from './lib/parseModuleOptions';
import { createAndCacheFeed } from './lib/createAndCacheFeed';
import { getContentType } from './lib/getContentType';

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
    const options = moduleOptions || nuxt.options.feed;
    const feedConfigs = parseModuleOptions(options);
    const cache = new LRUCache<number, string>();

    for (const [index, config] of feedConfigs.entries()) {
      createAndCacheFeed(config, index, cache);

      const feedGenerationPath = resolve(
        nuxt.options.rootDir,
        join(nuxt.options.generate.dir, config.path)
      );
      const feedGenerationDir = dirname(feedGenerationPath);

      if (!existsSync(feedGenerationDir)) {
        mkdirSync(feedGenerationDir);
      }

      const feedFileContent = cache.get(index) as string;

      writeFileSync(feedGenerationPath, feedFileContent);
      nuxt.options.serverMiddleware.push({
        path: config.path,
        handler: (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader('Content-Type', getContentType(config.type));
          res.end(feedFileContent);
        }
      });
    }
  }
});
