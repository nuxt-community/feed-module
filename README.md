# Feed module - Everyone deserves RSS, Atom and Json
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/feed/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/feed)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/feed.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/feed)
[![Build Status](https://travis-ci.org/nuxt-community/feed-module.svg?branch=master)](https://travis-ci.org/nuxt-community/feed-module)
[![Codecov](https://img.shields.io/codecov/c/github/.svg?style=flat-square)](https://codecov.io/gh/)
[![Dependencies](https://david-dm.org//status.svg?style=flat-square)](https://david-dm.org/)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> 

[📖 **Release Notes**](./CHANGELOG.md)

## Features

* Three different feed types (RSS 2.0, ATOM 1.0 and JSON 1.0)
* As many feeds as you like!
* Completely customizable. Need to fetch data before? No problem!
* Works with **all modes** (yes, even generate!)

## Setup

- Add `@nuxtjs/feed` dependency using yarn or npm to your project
- Add `@nuxtjs/feed` to `modules` section of `nuxt.config.js`

```js
{
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
{
 //...
 feed: [
   // A default feed configuration object
   {
     path: '/feed.xml', // The route to your feed.
     async create (feed) {}, // The create function (see below)
     cacheTime: 1000 * 60 * 15, // How long should the feed be cached
     type: 'rss2' // Can be: rss2, atom1, json1
   }
 ],
 //...
}
```

### Feed create function

Let's take a closer look on the `create` function. This is the API that 
actually modifies your upcoming feed.

A simple create function could look like this:

```js
create = async feed => {
  feed.options = {
    title: 'My blog',
    description: 'This is my personal feed!',
  }
  
  const posts = await axios.get('https://blog.lichter.io/posts/').data
  posts.forEach(post => { 
    feed.addItem({
        title: post.title,
        id: post.url,
        link: post.url,
        description: post.description,
        content: post.content
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

Using the `create` function gives you unlimited possibilities to customize your feed!

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter
