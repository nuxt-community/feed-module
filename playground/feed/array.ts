import { $fetch } from 'ohmyfetch';

import { FeedSource } from '../../src/types';
import { Article } from './article-model';

export const sources: FeedSource[] = [
  {
    meta: {
      id: 'science',
      title: 'Science RSS Feed',
      link: 'https://inshortsv2.vercel.app/news?type=science',
      description: 'Sample RSS feed generated from InShorts v2 API articles',
      copyright: 'Feed module - Nuxt Community; InShorts API - Sumit Kolhe'
    },
    path: '/rss.xml',
    type: 'rss2',
    async create(feed) {
      const { articles } = await $fetch<{ articles: Article[] }>(
        'https://inshortsv2.vercel.app/news?type=science'
      );

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
  }
];
