import { resolve, join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { Feed } from 'feed';
import { Nuxt } from '@nuxt/schema';

import { FeedSource } from '../types';

export async function generateFeedFile(this: Nuxt, config: FeedSource) {
  const feed = new Feed({
    ...config.meta,
    generator: 'https://github.com/nuxt-community/feed-module'
  });

  await config.create(feed);

  const fileContent = feed[config.type]();
  const filePath = resolve(
    this.options.rootDir,
    join(this.options.srcDir, '/public', config.path)
  );
  const outputDir = dirname(filePath);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(filePath, fileContent);
}
