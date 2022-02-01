/* eslint-disable no-console */
import axios from 'axios';

import { FeedConfig, FeedConfigFactory } from '../../src/types';
import { Article } from './article-model';

export const sources: FeedConfigFactory = () => {
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

  return articleCategories.map<FeedConfig>((category) => {
    const apiUrl = `https://inshortsv2.vercel.app/news?type=${category}`;

    return {
      meta: {
        id: category,
        title: `${category}-feed`,
        link: apiUrl,
        description: 'Sample RSS feed generated from InShorts v2 API articles',
        copyright: 'Feed module - Maciej Pędzich; InShorts API - Sumit Kolhe'
      },
      path: `/feeds/${category}.xml`,
      type: 'rss2',
      async create(feed) {
        const { data } = await axios.get<{ articles: Article[] }>(apiUrl);
        const { articles } = data;

        articles.forEach((article) => {
          feed.addItem({
            id: article.created_at.toString(),
            title: article.title,
            link: article.source_url,
            content: article.description,
            date: new Date(article.created_at)
          });
        });
      }
    };
  });
};
