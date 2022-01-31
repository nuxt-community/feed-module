import { FeedConfig } from './FeedConfig';

export type FeedConfigFactory = () => Promise<FeedConfig[]> | FeedConfig[];
