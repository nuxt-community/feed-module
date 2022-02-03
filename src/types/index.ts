import { Feed, FeedOptions } from 'feed';

export type FeedSource = {
  meta: FeedOptions;
  path: string;
  type: 'rss2' | 'atom1' | 'json1';
  create(feed: Feed): Promise<unknown> | unknown;
};

export type FeedSourcesFactory = () => Promise<FeedSource[]> | FeedSource[];
