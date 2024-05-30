import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export type Tag = {
  type: 'Artist' | 'Track';
  id: string;
  name: string;
  image: string;
  colour: string;
};

const getAverageColour = async(imgUrl: string) => {
  const response = await fac.getColorAsync(imgUrl);
  console.log(response.rgba);
  return response.rgba;
};

export const createTag = async(item: any): Promise<Tag> => {
  // Only artists have genres
  if ('genres' in item) {
    return {
      type: 'Artist',
      id: item.id || '',
      name: item.name || '',
      image: item.images?.[2]?.url || '',
      colour: await getAverageColour(item.images?.[2]?.url)
    };
  } else {
    return {
      type: 'Track',
      id: item.id,
      name: item.name,
      image: item.album.images[1]?.url || '',
      colour: await getAverageColour(item.album.images[1]?.url)
    };
  }
};