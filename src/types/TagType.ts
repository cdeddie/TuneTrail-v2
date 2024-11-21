import { FastAverageColor } from 'fast-average-color';
import Vibrant              from 'node-vibrant/lib/bundle.js'

const fac = new FastAverageColor();

export type Tag = {
  type:   'Artist' | 'Track';
  id:     string;
  name:   string;
  image?: string;
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

export const createTrackTag = async(track: SpotifyApi.TrackObjectFull): Promise<Tag> => {
  const imageUrl = track.album.images[0].url;
  return {
    type: 'Track',
    id: track.id,
    name: track.name,
    image: imageUrl,
    colour: await getProminentColour(imageUrl),
  }
};

export const createArtistTag = async(artist: SpotifyApi.ArtistObjectFull): Promise<Tag> => {
  const imageUrl = artist.images[0].url;
  return {
    type: 'Artist',
    id: artist.id,
    name: artist.name,
    image: imageUrl,
    colour: await getProminentColour(imageUrl),
  }
};