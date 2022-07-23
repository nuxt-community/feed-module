import { constants } from 'node:fs'
import { access, mkdir, writeFile } from 'node:fs/promises'
import type { Nuxt } from '@nuxt/schema'
import { Feed, FeedOptions } from 'feed'
import { resolve, join, dirname } from 'pathe'
import { joinURL } from 'ufo'
import type { ModuleOptions } from './module'

export type FeedSource = {
  type: 'atom1' | 'json1' | 'rss2'
  path: string
  options?: FeedOptions
  create?(feed: Feed, data: FeedSource['data'], commonData: FeedSource['data']): void | Promise<void>
  data?: unknown
}

export type FeedSourcesFactory = () => FeedSource[] | Promise<FeedSource[]>

// Ref: Nuxt Kit's `NuxtTemplate` interface
export type FeedTemplate = {
  dst: string
  getContents: () => string | Promise<string>
}

export async function resolveSources (sources: ModuleOptions['sources']): Promise<FeedSource[]> {
  if (Array.isArray(sources)) {
    return sources
  }

  if (typeof sources === 'function') {
    return await sources()
  }

  throw new TypeError('`sources` option must be an array of feed sources or a function that returns it')
}

export function createFeedTemplate (nuxt: Nuxt, { source, commonOptions = {}, commonCreate, commonData }: {
  source: FeedSource,
  commonOptions?: ModuleOptions['options'],
  commonCreate?: ModuleOptions['create'],
  commonData?: ModuleOptions['data']
}): FeedTemplate {
  const {
    options,
    path: filePath,
    type,
    create,
    data
  } = source
  const {
    options: {
      rootDir,
      srcDir,
      dir: {
        public: publicDir
      }
    }
  } = nuxt

  return {
    dst: resolve(rootDir, join(srcDir, publicDir, filePath)),
    getContents: async () => {
      const feed = new Feed({
        generator: 'https://github.com/nuxt-community/feed-module',
        ...commonOptions,
        ...options,
        link: joinURL((options || commonOptions).link || '', filePath)
      })

      commonCreate && await commonCreate(feed, data, commonData)
      create && await create(feed, data, commonData)

      return feed[type]()
    }
  }
}

export async function writeFeedFile (dst: FeedTemplate['dst'], data: string): Promise<void> {
  const dir = dirname(dst)

  try {
    await access(dir, constants.W_OK)
  } catch {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(dst, data)
}
