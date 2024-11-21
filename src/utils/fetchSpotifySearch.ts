const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

// searchCategory must be either 'artists' or 'tracks' (not case sensitive)
export const fetchSearch = async(query: string, searchCategory: string, isLoggedIn: boolean) => {
  if (query.trim().length === 0) {
    return;
  }

  console.log(searchCategory);

  try {
    const sanitizedQuery = encodeURIComponent(query.toLowerCase());
    // TODO: Handle user login (future). Also value needs to be between Songs and Artists
    let url;
    if (isLoggedIn) {
      url = `${baseUrl}/api/search?query=${sanitizedQuery}&type=${searchCategory.toLowerCase().slice(0, -1)}`;
    } else {
      url = `${baseUrl}/api/public-search?query=${sanitizedQuery}&type=${searchCategory.toLowerCase().slice(0, -1)}`;
    }
    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: SpotifyApi.TrackSearchResponse | SpotifyApi.ArtistSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

