import Vibrant              from 'node-vibrant/lib/bundle.js'
import { FastAverageColor } from 'fast-average-color';

// Direct string return
export const pickBWTextColour = (colour: string): string => {
  const [r, g, b] = colour.slice(4, -1).split(',').map(Number);

  const luminance = r * 0.299 + g * 0.587 + b * 0.114;

  return luminance > 186 ? '#000000' : '#FFFFFF';
};

// Pass in as rgb(r, g, b)
export const darkOrLightFont = (colour: string): boolean => {
  const [r, g, b] = colour.slice(4, -1).split(',').map(Number);

  const luminance = r * 0.299 + g * 0.587 + b * 0.114;

  // Returns true if light, false if dark
  // -> if true, can use light font, if false should use dark font
  return luminance > 186 ? true : false;
};

export const convertRgbToRgba = (rgb: string, opacity: number): string => {
  const [r, g, b] = rgb.slice(4, -1).split(',').map(Number);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Node-vibrant
const fac = new FastAverageColor();

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