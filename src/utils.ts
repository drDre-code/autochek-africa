import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';

export interface Story {
  title: string;
  [key: string]: number | string | number[];
}

const myCache = new NodeCache();

const getAllStoryIDs = async (): Promise<number[]> => {
  const data = myCache.get('uniqueIDs');
  if (data) return data as number[];
  const urls = [
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
    'https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty',
    'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty',
    'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty',
    'https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty',
  ];
  const value = urls.map((url) => axios.get(url));
  const response = await Promise.all(value);
  const allIDs: number[] = response.map((item) => item.data).flat();
  const uniqueIDs = [...new Set(allIDs)];
  myCache.set('uniqueIDs', uniqueIDs, 60 * 5); // store data in cache for 5mins
  return uniqueIDs;
};

export const getAllStory = async (): Promise<Story[]> => {
  const data = myCache.get('allStories');
  if (data) return data as Story[];
  const ids = await getAllStoryIDs();
  const storyPromise = ids.map((id: number) =>
    axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
    ),
  );

  const storyResponse = await Promise.allSettled(storyPromise);
  const validStory = (
    storyResponse.filter(
      (res) => res.status === 'fulfilled',
    ) as PromiseFulfilledResult<AxiosResponse>[]
  )
    .map(({ value }) => value.data)
    .sort((a, b) => b.time - a.time);
  myCache.set('allStories', validStory, 60 * 5); // store data in cache for 5mins
  return validStory;
};

export const getTop10 = async (input: string[]) => {
  //  get and obj showing the count of words
  const wordCount = input.reduce(
    (acc: { [key: string]: number }, item: string) => {
      // replace all not letters so as to enable us remove (,":;)
      const title = item.toLowerCase().replace(/[^a-zA-z0-9. ]/g, '');
      const words = title.split(' ');

      for (const i of words) {
        acc[i] ? (acc[i] += 1) : (acc[i] = 1);
      }

      return acc;
    },
    {},
  );

  // Get top 10 words
  const uniqueWords = Object.keys(wordCount);
  const values = Object.values(wordCount);
  const output: { [key: string]: number } = {};
  let count = 0;
  const valu = input.filter((word) => word.includes('week'));
  valu;
  while (count < 10) {
    const indexOfMax = values.indexOf(Math.max(...values));
    const value = values.splice(indexOfMax, 1)[0];
    const word = uniqueWords.splice(indexOfMax, 1)[0];
    if (word !== '') {
      output[word] = value;
      count++;
    }
  }
  return output;
};

export const karmaBasedValidation = async (stories: Story[]) => {
  // Get user
  const userInfo = stories.map((story) =>
    axios.get(
      `https://hacker-news.firebaseio.com/v0/user/${story.by}.json?print=pretty`,
    ),
  );
  const usersData = (await Promise.allSettled(
    userInfo,
  )) as PromiseFulfilledResult<AxiosResponse>[];
  // Filter stories whose user has 10000 or more karma
  const output = stories.reduce(
    (acc: string[], story: Story, index: number) => {
      const userResponse = usersData[index];
      if (userResponse.status === 'fulfilled' && userResponse.value.data) {
        const { karma } = userResponse.value.data;
        if (karma >= 10000) {
          acc.push(story.title);
        }
      }
      return acc;
    },
    [],
  );
  return output;
};
