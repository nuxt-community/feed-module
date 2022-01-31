import { resolve, join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { Feed } from 'feed';
import { Nuxt } from '@nuxt/schema';

import { FeedConfig } from '../types/FeedConfig';

export async function generateFeedFile(this: Nuxt, config: FeedConfig) {
  const feed = new Feed({
    ...config.meta,
    generator: 'https://github.com/nuxt-modules/feed'
  });

  await config.create(feed);

  const fileContent = feed[config.type]();
  const filePath = resolve(
    this.options.rootDir,
    join(this.options.srcDir, '/public', config.path)
  );
  const outputDir = dirname(filePath);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  writeFileSync(filePath, fileContent);
}
