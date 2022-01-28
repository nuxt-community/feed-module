import { Feed, FeedOptions } from 'feed';

export type ModuleFeedConfig = {
  meta: FeedOptions;
  path: string;
  type: 'rss2' | 'atom1' | 'json1';
  maxAge: number;
  create(feed: Feed): Promise<unknown> | unknown;
};
