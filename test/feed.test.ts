import type { Nuxt } from '@nuxt/schema'
import type { Author } from 'feed'
import { expect, it, describe } from 'vitest'
import { resolveSources, createFeedTemplate } from '../src/feed'
import type { FeedSource, FeedSourcesFactory } from '../src/feed'

const nuxtMock = {
  options: {
    rootDir: '/test',
    srcDir: '/test',
    dir: {
      public: 'public'
    }
  }
} as Nuxt

const sources: FeedSource[] = [
  {
    type: 'atom1',
    path: '/feed.atom',
    data: 'Atom 1',
    create (feed, data) {
      feed.addCategory(data as string)
    }
  },
  {
    type: 'json1',
    path: '/feed.json',
    data: 'JSON 1',
    create (feed, data) {
      feed.addCategory(data as string)
    }
  },
  {
    type: 'rss2',
    path: '/feed.xml',
    data: 'RSS 2',
    create (feed, data) {
      feed.addCategory(data as string)
    }
  }
]

const sourcesFactory: FeedSourcesFactory = () => sources

const commonPropertiesForSources = {
  commonOptions: {
    // This is needed for Atom `updated` and RSS `lastBuildDate` in snapshots not to be changed.
    // Without this defined, the properties are set as the time when feed is created.
    updated: new Date(Date.UTC(2018, 0, 9)),
    // This is to test if #9 is supported
    link: 'https://lichter.io/'
  },
  commonData: {
    name: 'Alexander Lichter',
    email: 'example@lichter.io'
  },
  commonCreate (feed, _, commonData) {
    feed.addContributor(commonData as Author)
  }
}

describe('feed', () => {
  describe('resolveSources', () => {
    it('should receive an array and is fulfilled with the received array', async () => {
      expect(await resolveSources(sources)).toBe(sources)
    })

    it('should receive a function and is fulfilled with an array return by the function', async () => {
      expect(await resolveSources(sourcesFactory)).toBe(sources)
    })

    it('should throw a type error if neither an array nor a function is passed', () => {
      expect(resolveSources).rejects.toThrowError(/^`sources` option must be an array of feed sources or a function that returns it$/)
    })
  })

  describe('createFeedTemplate', () => {
    it("should returns an object whose `dst` property is a path consited of Nuxt's `public` directory and sources' `path` property", () => {
      const feedTemplate = createFeedTemplate(nuxtMock, { source: sources[0] })
      expect(feedTemplate.dst).toBe('/test/public/feed.atom')
    })

    it('should returns an object whose `getContents` property is a function that returns correct Atom content', async () => {
      const feedTemplate = createFeedTemplate(nuxtMock, { source: sources[0], ...commonPropertiesForSources })
      expect(await feedTemplate.getContents()).toMatchSnapshot()
    })

    it('should returns an object whose `getContents` property is a function that returns correct JSON content', async () => {
      const feedTemplate = createFeedTemplate(nuxtMock, { source: sources[1], ...commonPropertiesForSources })
      expect(await feedTemplate.getContents()).toMatchSnapshot()
    })

    it('should returns an object whose `getContents` property is a function that returns correct RSS content', async () => {
      const feedTemplate = createFeedTemplate(nuxtMock, { source: sources[2], ...commonPropertiesForSources })
      expect(await feedTemplate.getContents()).toMatchSnapshot()
    })
  })
})
