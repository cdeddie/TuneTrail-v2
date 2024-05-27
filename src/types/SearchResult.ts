export type Tag = {
  type: 'Artist' | 'Track';
  id: string;
  name: string;
  image: string;
};

export const createTag = (item: any): Tag => {
  // Only artists have genres
  if ('genres' in item) {
    return {
      type: 'Artist',
      id: item.id || '',
      name: item.name || '',
      image: item.images?.[2]?.url || '',
    };
  } else {
    return {
      type: 'Track',
      id: item.id,
      name: item.name,
      image: item.album.images[1]?.url || '',
    };
  }
};