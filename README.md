# Nuxt Feed

- [![npm version][npm-version-src]][npm-version-href]
- [![npm downloads][npm-downloads-src]][npm-downloads-href]
- [![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
- [![Codecov][codecov-src]][codecov-href]
- [![License][license-src]][license-href]

> Feed module enables everyone to have RSS, Atom and Json.

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- 🪄&nbsp; Three different feed types (ATOM 1.0, JSON 1.0, and RSS 2.0)
- 👌&nbsp; As many feeds as you like
- 📦&nbsp; Completely customizable
- 🚀&nbsp; [Nuxt 3](https://v3.nuxtjs.org/) support

## Setup

1. Add `@nuxtjs/feed` dependency to your project

```bash
# Using yarn
yarn add --dev @nuxtjs/feed

# Using npm
npm install --save-dev @nuxtjs/feed
```

2. Add `@nuxtjs/feed` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    ['@nuxtjs/feed', { /* module options */ }]
  ],
  feed: { /* module options */ }
}
```

3. [Configure module options](#configuration)

## Configuration

```js
{
  // Common feed options for all sources (see below)
  options: {}

  // Common function to create feed object for all sources (see below)
  async create (feed, data, commonData) {},

  // Array of common data to pass to create function
  data: ['string', 1, true]

  // Array of options for feed sources
  sources: [
    {
      // Type of feed (`atom1`, `json1`, or `rss2`)
      type: 'atom1',

      // Path to feed file relative to directory of Nuxt `dir.public` option
      path: '/feed.xml',

      // Feed options (see below)
      options: {}

      // Function to create feed object for this resource (see below)
      async create (feed, data, commonData) {},

      // Array of data to pass to create function
      data: ['string', 1, true]
    }
  ]
}
```

### Sources Factory function

Imagine that you want to add a feed per blog category, but you don't want to add every category by hand.

In such case, you can define `sources` option as a function that returns an array of feed sources.

### Feed Create Function

You can create or "extend" feed object for each source inside `create` function.

`create` function at top level is called for all sources.

If you define `create` function at both top level and source level, top-level one is called first and then source-level one.

A simple create function could look like this:

```js
import axios from 'axios'

// At top-level or source-level
async create (feed) {
  feed.options = {
    title: 'My blog',
    description: 'This is my personal feed!'
  }

  const { data } = await axios.get('https://blog-api.lichter.io/posts')
  const { posts } = data

  posts.forEach(post => {
    const { title, url, description, content } = post

    feed.addItem({ title, id: url, link: url, description, content })
  })

  feed.addCategory('Nuxt.js')

  feed.addContributor({
    name: 'Alexander Lichter',
    email: 'example@lichter.io',
    link: 'https://lichter.io/'
  })
}
```

## Development

- Clone this repository
- Run `yarn install` to install dependencies
- Run `yarn run dev:prepare` to generate type stubs
- Use `yarn run dev` to start [playground](./playground) in development mode
- Use `yarn run dev:build` to build Nuxt application of [playground](./playground)
- Use `yarn run dev:generate` to generate Nuxt appllication of [playground](./playground)

## License

[MIT License](./LICENSE)

Copyright (c) - Nuxt Community
