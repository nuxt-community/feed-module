# Feed module - Everyone deserves RSS, Atom and Json
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/feed/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/feed)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/feed.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/feed)
[![Build Status](https://travis-ci.org/nuxt-community/feed-module.svg?branch=master)](https://travis-ci.org/nuxt-community/feed-module)
[![codecov](https://codecov.io/gh/nuxt-community/feed-module/branch/master/graph/badge.svg)](https://codecov.io/gh/nuxt-community/feed-module)
[![Dependencies](https://david-dm.org/nuxt-community/feed-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/feed-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> 

[📖 **Release Notes**](./CHANGELOG.md)

## Features

* Three different feed types (RSS 2.0, ATOM 1.0 and JSON 1.0)
* As many feeds as you like!
* Completely customizable. Need to fetch data before? No problem!
* Works with **all modes** (yes, even generate!)
* For Nuxt 2.x and higher

## Setup

- Add `@nuxtjs/feed` dependency using yarn or npm to your project
- Add `@nuxtjs/feed` to `modules` section of `nuxt.config.js`

```js
export default {
  modules: [
    // Simple usage
    '@nuxtjs/feed',
 ],
 feed: [
   // Your feeds here
 ]
}
```

- Configure it as you need

## Configuration

So.. how to get these feeds working now?

### Configuration object overview

```js
export default {
 //...
 feed: [
   // A default feed configuration object
   {
     path: '/feed.xml', // The route to your feed.
     async create (feed) {}, // The create function (see below)
     cacheTime: 1000 * 60 * 15, // How long should the feed be cached
     type: 'rss2', // Can be: rss2, atom1, json1
     data: ['Some additional data'] //will be passed as 2nd argument to `create` function
   }
 ]
 //...
}
```

### Feed create function

Let's take a closer look on the `create` function. This is the API that 
actually modifies your upcoming feed.

A simple create function could look like this:

```js
//Import axios into your nuxt.config.js
import axios from 'axios'

// In your `feed` array:
async create (feed){
  feed.options = {
    title: 'My blog',
    link: 'https://lichter.io/feed.xml',
    description: 'This is my personal feed!',
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
         async create (feed) {
           feed.options = {
             title: `${t.name} - My blog`,
             link: `https://blog.lichter.io/${t.slug}.xml`,
             description: `All posts related to ${t.name} of my blog`,
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

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter
