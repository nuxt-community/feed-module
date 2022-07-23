import { Feed, FeedOptions } from 'feed'
import type { ModuleOptions } from './module'

export type FeedSource = {
  type: 'atom1' | 'json1' | 'rss2'
  path: string
  options?: FeedOptions
  create?(feed: Feed, data: FeedSource['data'], commonData: FeedSource['data']): void | Promise<void>
  data?: any[]
}

export type FeedSourcesFactory = () => FeedSource[] | Promise<FeedSource[]>

export async function resolveSources (sources: ModuleOptions['sources']): Promise<FeedSource[]> {
  if (Array.isArray(sources)) {
    return sources
  }

  if (typeof sources === 'function') {
    return await sources()
  }

  throw new TypeError('`sources` option must be an array of feed sources or a function that returns it')
}
