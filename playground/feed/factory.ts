import { $fetch } from 'ohmyfetch';

import { FeedSource, FeedSourcesFactory } from '../../src/module';
import { Article } from './article-model';

export const sources: FeedSourcesFactory = () => {
  const articleCategories = [
    'national',
    'business',
    'politics',
    'sports',
    'technology',
    'startups',
    'entertainment',
    'education',
    'automobile',
    'science',
    'travel',
    'fashion'
  ];

  return articleCategories.map<FeedSource>((category) => {
    const apiUrl = `https://inshortsv2.vercel.app/news?type=${category}`;

    return {
      meta: {
        id: category,
        title: `Feed about ${category}`,
        link: apiUrl,
        description: 'Sample RSS feed generated from InShorts v2 API articles',
        copyright: 'Feed module - Nuxt Community; InShorts API - Sumit Kolhe'
      },
      path: `/feeds/${category}.xml`,
      type: 'rss2',
      async create(feed) {
        const { articles } = await $fetch<{ articles: Article[] }>(apiUrl);

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
    };
  });
};
