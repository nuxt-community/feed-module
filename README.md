# Feed module - Everyone deserves RSS, Atom and Json

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![Dependencies][david-dm-src]][david-dm-href]
[![Standard JS][standard-js-src]][standard-js-href]

> Feed module enables everyone to have RSS, Atom and Json.

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Three different feed types (RSS 2.0, ATOM 1.0 and JSON 1.0)
- As many feeds as you like!
- Completely customizable. Need to fetch data before? No problem!
- Works with **all modes** (yes, even generate!)
- For Nuxt 2.x and higher

## Setup

1. Add the `@nuxtjs/feed` dependency with `yarn` or `npm` to your project
2. Add `@nuxtjs/feed` to the `modules` section of `nuxt.config.js`:
3. Configure it:

```js
{
  modules: [
    ['@nuxtjs/feed', {
      // Your feeds here
    }]
  ]
}
```

### Using top level options

```js
{
  modules: [
    '@nuxtjs/feed'
  ],
  feed: [
    // Your feeds here
  ]
}
```

## Configuration

So.. how to get these feeds working now?

### Configuration object overview

```js
{
  feed: [
    // A default feed configuration object
    {
      path: '/feed.xml', // The route to your feed.
      async create(feed) {}, // The create function (see below)
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2', // Can be: rss2, atom1, json1
      data: ['Some additional data'] // Will be passed as 2nd argument to `create` function
    }
  ]
}
```

### Feed create function

Let's take a closer look on the `create` function. This is the API that 
actually modifies your upcoming feed.

A simple create function could look like this:

```js
import axios from 'axios'

// In your `feed` array:
async create(feed) {
  feed.options = {
    title: 'My blog',
    link: 'https://lichter.io/feed.xml',
    description: 'This is my personal feed!'
  }

  const posts = await (axios.get('https://blog-api.lichter.io/posts')).data
  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: post.description,
      content: post.content
    })
  })

  feed.addCategory('Nuxt.js')

  feed.addContributor({
    name: 'Alexander Lichter',
    email: 'example@lichter.io',
    link: 'https://lichter.io/'
  })
}
```

Feed creation is based on the [feed](https://github.com/jpmonette/feed) package.
Please use it as reference and further documentation for modifying the `feed` object
that is passed to the `create` function.

Using the `create` function gives you almost unlimited possibilities to customize your feed!

### Using a feed factory function

There is one more thing. Imagine you want to add a feed per blog category, but you don't want
to add every category by hand.

You can use a `factory function` to solve that problem. Instead of a hardcoded array, you can setup
a function that will be called up on feed generation. The function **must** return an array with all
feeds you want to generate.

```js
{
  feed: async () => {
    const posts = (await axios.get('https://blog-api.lichter.io/posts')).data
    const tags = (await axios.get('https://blog-api.lichter.io/tags')).data

    return tags.map(t => {
      const relevantPosts = posts.filter(/*filter posts somehow*/)

      return {
        path: `/${t.slug}.xml`, // The route to your feed.
        async create(feed) {
          feed.options = {
            title: `${t.name} - My blog`,
            link: `https://blog.lichter.io/${t.slug}.xml`,
            description: `All posts related to ${t.name} of my blog`
          }

          relevantPosts.forEach(post => {
            feed.addItem({
              title: post.title,
              id: post.id,
              link: `https://blog.lichter.io/posts/${post.slug}`,
              description: post.excerpt,
              content: post.text
            })
          })
        },
        cacheTime: 1000 * 60 * 15,
        type: 'rss2'
      }
    })
  }
}
```

In case you want to pass in data into the factory function, you can use a *factory object*.

```js
{
  feed: {
    data: ['Your data here']
    factory: (dataFromFeedDotData) => {/* your factory function */}
  }
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/@nuxtjs/feed.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/feed
[npm-downloads-src]: https://img.shields.io/npm/v/@nuxtjs/feed/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/feed
[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/feed-module.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/feed-module
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/feed-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/feed-module
[david-dm-src]: https://david-dm.org/nuxt-community/feed-module/status.svg?style=flat-square
[david-dm-href]: https://david-dm.org/nuxt-community/feed-module
[standard-js-src]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-js-href]: https://standardjs.com
