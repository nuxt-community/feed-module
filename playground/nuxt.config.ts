import { defineNuxtConfig } from 'nuxt3';
import axios from 'axios';

import FeedModule from '..';

interface Post {
  author: string;
  content: string;
  date: string;
  imageUrl: string;
  readMoreUrl: string;
  time: string;
  title: string;
  url: string;
}

export default defineNuxtConfig({
  srcDir: './',
  modules: [FeedModule],
  feed: [
    {
      meta: {
        id: 'dupa',
        title: 'dupa',
        link: 'https://www.dupa.pl',
        description: 'dupa',
        copyright: '2022 dupa. Ol rajc rizewd'
      },
      path: '/feed.xml',
      type: 'rss2',
      async create(feed) {
        const response = await axios.get<{ data: Post[] }>(
          'https://inshortsapi.vercel.app/news?category=science'
        );

        response.data.data.forEach((post) => {
          const timeString = post.time.substring(0, 5);
          const [hoursString, minutesString] = timeString.split(':');

          const pmBonus = hoursString.endsWith('pm') ? 12 : 0;
          const hours = parseInt(hoursString, 10) + pmBonus;
          const minutes = parseInt(minutesString, 10);

          const [dateAddedString] = post.date.split(',');
          const date = new Date(dateAddedString);
          date.setHours(hours, minutes);

          feed.addItem({
            title: post.title,
            id: post.url,
            link: post.url,
            content: post.content,
            date
          });
        });
      }
    }
  ]
});
