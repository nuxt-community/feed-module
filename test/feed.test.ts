import { expect, it, describe } from 'vitest'
import { resolveSources } from '../src/feed'
import type { FeedSource, FeedSourcesFactory } from '../src/feed'

const sources: FeedSource[] = [
  {
    type: 'atom1',
    path: '/feed.atom'
  },
  {
    type: 'json1',
    path: '/feed.json'
  },
  {
    type: 'rss2',
    path: '/feed.xml'
  }
]

const sourcesFactory: FeedSourcesFactory = () => sources

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
})
