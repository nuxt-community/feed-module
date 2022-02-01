import { defineNuxtConfig } from 'nuxt3';

import FeedModule from '..';

import { sources } from './feed/array';
// Uncomment the import below and comment one above for a factory example
// Do the opposite to switch back to static array config
// import { sources } from './feed/factory';

export default defineNuxtConfig({
  srcDir: './',
  buildModules: [FeedModule],
  feed: { sources }
});
