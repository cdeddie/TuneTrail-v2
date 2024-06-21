import { FastAverageColor } from 'fast-average-color';
import { prominent, average } from 'color.js';
import Vibrant from 'node-vibrant/lib/bundle.js'

const fac = new FastAverageColor();

export type Tag = {
  type: 'Artist' | 'Track';
  id: string;
  name: string;
  image: string;
  colour: string;
};

export const getAverageColour = async(imgUrl: string) => {
  const response = await fac.getColorAsync(imgUrl);
  return response.rgb;
};

export const getProminentColour = async (imgUrl: string): Promise<string> => {
  const palette = await Vibrant.from(imgUrl).getPalette();
  if (palette.Vibrant && Array.isArray(palette.Vibrant.rgb)) {
    const [r, g, b] = palette.Vibrant.rgb;
    return `rgb(${r},${g},${b})`;
  }
  throw new Error('Failed to extract prominent color');
};

export const createTag = async(item: any): Promise<Tag> => {
  // Only artists have genres
  if ('genres' in item) {
    return {
      type: 'Artist',
      id: item.id || '',
      name: item.name || '',
      image: item.images?.[1]?.url || '',
      colour: await getProminentColour(item.images?.[2]?.url),
    };
  } else {
    return {
      type: 'Track',
      id: item.id,
      name: item.name,
      image: item.album.images[1]?.url || '',
      colour: await getProminentColour(item.album.images[1]?.url)
    };
  }
};