import { getProminentColour } from "@/utils/colourStyle";

export type Tag = {
  type:   'Artist' | 'Track';
  id:     string;
  name:   string;
  image?: string;
  colour: string;
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