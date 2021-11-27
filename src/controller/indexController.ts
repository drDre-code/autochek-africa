import { Request, Response } from 'express';
import { getAllStory, getTop10, Story, karmaBasedValidation } from '../utils';

export const lastTwentyFive = async (_req: Request, res: Response) => {
  try {
    const allStory = await getAllStory();
    // last 25 stories is the first 25 in the array since it's already sorted
    const select25: Story[] = allStory.slice(0, 25);
    // get titles of selceted 25
    const titles: string[] = select25.map((story) => story.title);
    // get top 10 words
    const top10 = await getTop10(titles);
    res.status(200).json(top10);
  } catch (e) {
    const message = (e as Error).message || e;
    res.status(500).json({ error: message });
  }
};

export const lastWeek = async (_req: Request, res: Response) => {
  try {
    const allStory = await getAllStory();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const lastWeekDate = Date.now() - sevenDays;
    const lastWeekStory = allStory.filter((story) => story.time > lastWeekDate);

    //  get titles of last weeks story
    const titles = lastWeekStory.map((story) => story.title);
    const top10 = await getTop10(titles);
    res.status(200).json(top10);
  } catch (e) {
    const message = (e as Error).message || e;
    res.status(500).json({ error: message });
  }
};

export const last600Stories = async (_req: Request, res: Response) => {
  try {
    const allStory = await getAllStory();
    const select600: Story[] = allStory.slice(0, 600);
    const validatedStory = await karmaBasedValidation(select600);

    const titles = validatedStory.map((story) => story.title);
    const top10 = await getTop10(titles);
    res.status(200).json(top10);
  } catch (e) {
    const message = (e as Error).message || e;
    res.status(500).json({ error: message });
  }
};
