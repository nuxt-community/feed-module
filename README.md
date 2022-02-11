# @nuxtjs/feed-next

## NOTE

Due to a certain [Nuxt 3 module-builder bug](https://github.com/nuxt/module-builder/issues/22), this module only works in development mode on Windows.

📰 Generate RSS/JSON feeds for your Nuxt application

## Installation

```sh
$ npm install --save @nuxtjs/feed-next
# OR
$ yarn add @nuxtjs/feed-next
```

## Basic Usage

```ts
// nuxt.config.ts

import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  buildModules: ['@nuxtjs/feed-next'],
  feed: {
    sources: [
      {
        meta: {
          id: 'articles',
          title: 'Articles from My Cool Blog',
          link: 'https://mycoolblog.com/articles',
          description: 'Cool articles from My Cool Blog',
          copyright: '2022-present My Cool Blog'
        },
        type: 'rss2', // OR: 'atom1', 'json1'
        path: '/feed.xml',
        create(feed) {
          // More on that function below
        }
      }
    ]
  }
});
```
## About `create` function

This method is required in order to populate the [feed](https://github.com/jpmonette/feed) object passed as the only `create` function argument. Here's an example using [InShorts v2 API](https://github.com/sumitkolhe/inshorts-api-v2):

```ts
import axios from 'axios';

async create(feed) {
  const { data } = await axios.get<{ articles: Article[] }>(
    'https://inshortsv2.vercel.app/news?type=automobile'
  );
  const { articles } = data;

  for (const article of articles) {
    feed.addItem({
      id: article.created_at.toString(),
      title: article.title,
      link: article.source_url,
      content: article.description,
      date: new Date(article.created_at)
    });
  }
}
```

## Dynamic module config - factory function

There are cases, where the _static array_ config could turn out to be more WET and less readable/flexible. For instance, what if you needed to generate feeds based on multiple different categories, which you may also want to fetch from an external API?

That's where _factory function_ comes into play. It allows one to programmatically create a `sources` array in a more flexible way. Here's another example:

```ts
import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  modules: ['@nuxtjs/feed-next'],
  feed: {
    sources() {
      const categories = ['vue', 'vite', 'nuxt', 'vitepress'];
      const currentYear = new Date().getFullYear();

      // Factory function HAS TO return a source objects array
      return categories.map((category) => ({
          meta: {
            id: category,
            title: `${category} feed`,
            link: `https://mycoolblog.com/articles/${category}`,
            description: `Cool articles about ${category}`,
            copyright: `${currentYear} My Cool Blog`
          },
          type: 'rss2',
          path: `/feeds/${category}.xml`,
          async create(feed) {
            // Fetch and add articles from given category
          }
        })
      );
    }
  }
});
```

## Migration - comparison with the 2.0.0 version

This version aimed to maintain as similar of an API as possible (along with bringing Nuxt 3 compatibility to the table, obviously). However, there are two key changes caused by Nuxt 3 being unable to parse anything else than objects as module options, as well as feed package type definitions: 

- This module accepts an object with a single property called `sources`, containing feed configuration objects
- Each source object is required to be specified with a `meta` object including the following properties: `id`, `title`, `description`, `link`, and `copyright`

## Development

- Run `npm run prepare` to generate type stubs.
- Use `npm run play` to start [playground](./playground) in development mode.

## LICENSE

[MIT License](https://github.com/nuxt-community/feed-module/blob/master/LICENSE)
