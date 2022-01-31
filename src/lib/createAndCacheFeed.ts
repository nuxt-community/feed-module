import { Feed } from 'feed';
import LRUCache from 'lru-cache';

import { ModuleFeedConfig } from '../types/ModuleFeedConfig';

export async function createAndCacheFeed(
  feedConfig: ModuleFeedConfig,
  cacheKey: number,
  cacheInstance: LRUCache<number, string>
) {
  const validFeedTypes = ['rss2', 'atom1', 'json1'];

  if (!validFeedTypes.includes(feedConfig.type)) {
    throw new Error('Feed can only be of type "rss2", "atom1", or "json1"');
  }

  const feed = new Feed(feedConfig.meta);
  const FIFTEEN_MINITES = 15 * 60 * 1000;

  await feedConfig.create(feed);
  cacheInstance.set(
    cacheKey,
    feed[feedConfig.type](),
    feedConfig.maxAge || FIFTEEN_MINITES
  );
}
