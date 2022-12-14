import { constants } from 'node:fs'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { Feed, FeedOptions } from 'feed'
import { dirname } from 'pathe'
import { joinURL } from 'ufo'
import type { NuxtTemplate } from '@nuxt/schema'
import type { ModuleOptions } from './module'

export interface FeedSource {
  type: 'atom1' | 'json1' | 'rss2'
  path: string
  options?: Partial<FeedOptions>
  create?(options: {
    feed: Feed
    routes: FeedTemplate['options']['routes']
    data: FeedSource['data']
  }): void | Promise<void>
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

  throw new TypeError('`sources` option must be an array of feed sources, a function that returns it, or a promise that resolves to it')
}

// cf. NuxtTemplate from @nuxt/schema
export interface FeedTemplate {
  dst: NonNullable<NuxtTemplate['dst']>
  options: {
    source: FeedSource,
    routes: PrerenderGenerateRouteMock[]
  }
}

// Copied PrerenderGenerateRoute from nitropack (not exported)
interface PrerenderGenerateRouteMock {
  route: string
  contents?: string
  data?: ArrayBuffer
  fileName?: string
  error?: Error & {
      statusCode: number
      statusMessage: string
  }
  generateTimeMS?: number
  skip?: boolean
}

// cf. ResolvedNuxtTemplate from @nuxt/schema
export interface ResolvedFeedTemplate {
  dst: string
  contents: string
}

export async function createFeedTemplate (feedTemplate: FeedTemplate): Promise<ResolvedFeedTemplate> {
  const { dst, options: { source, routes } } = feedTemplate
  const { type, path: filePath, create, data, options } = source

  // @ts-expect-error because there are some bugs in upstream type definitons (https://github.com/jpmonette/feed/issues/138).
  // Anyway, let's ignore the error at this moment because they may be configured in `source.create` function.
  const feed = new Feed({
    generator: 'https://github.com/nuxt-community/feed-module',
    ...options,
    link: joinURL(options?.link || '', filePath)
  })

  if (typeof create === 'function') {
    await create({ feed, routes, data })
  }

  // Now it's time to validate feed options.
  // The following functions validate feed options according to their official specification.
  if (type === 'atom1') {
    validateAtomFeedOptions(feed)
  } else if (type === 'json1') {
    validateJsonFeedOptions(feed)
  } else if (type === 'rss2') {
    validateRssFeedOptions(feed)
  }

  const contents = feed[type]()

  return {
    dst,
    contents
  }
}

// Ref. https://www.rfc-editor.org/rfc/rfc4287
function validateAtomFeedOptions (feed: Feed) {
  if (!feed.options.id) {
    throw new Error('Atom feed requires `id` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }

  if (!feed.options.title) {
    throw new Error('Atom feed requires `title` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }

  if (!feed.options.updated) {
    throw new Error('Atom feed requires `updated` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }
}

// Ref. https://www.jsonfeed.org/version/1.1/
function validateJsonFeedOptions (feed: Feed) {
  if (!feed.options.title) {
    throw new Error('JSON feed requires `id` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }
}

// Ref. https://www.rssboard.org/rss-specification
function validateRssFeedOptions (feed: Feed) {
  if (!feed.options.description) {
    throw new Error('RSS feed requires `description` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }

  if (!feed.options.link) {
    throw new Error('RSS feed require `link` to be configured as a non-empty string in their `source.options` or `source.create` function')
  }

  if (!feed.options.title) {
    throw new Error('RSS feed requires `title` to be configured as a non-empty string in its `source.options` or `source.create` function')
  }
}

export async function writeFeedFile (dst: ResolvedFeedTemplate['dst'], data: string): Promise<void> {
  const dir = dirname(dst)

  try {
    await access(dir, constants.W_OK)
  } catch {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(dst, data)
}
