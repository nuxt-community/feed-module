import { resolve, join, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { useNuxt } from '@nuxt/kit';
import { Feed } from 'feed';

import { FeedSource } from '../types';

export async function generateFeedFile(source: FeedSource) {
  const nuxt = useNuxt();
  const feed = new Feed({
    ...source.meta,
    generator: 'https://github.com/nuxt-community/feed-module'
  });

  const fileContent = feed[source.type]();
  const filePath = resolve(
    nuxt.options.rootDir,
    join(nuxt.options.srcDir, '/public', source.path)
  );
  const fileDirectory = dirname(filePath);

  await source.create(feed);

  if (!existsSync(fileDirectory)) {
    mkdirSync(fileDirectory, { recursive: true });
  }

  writeFileSync(filePath, fileContent);
}
