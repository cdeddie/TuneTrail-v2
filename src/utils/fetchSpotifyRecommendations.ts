import { Tag }                            from '@/types/TagType';
import { RecommendationFilter }           from '@/types/RecommendationType';
import { SpotifyRecommendationResponse }  from '@/types/SpotifyRecommendationResponse';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;
const CACHE_KEY = "fetchRecommendationsCache";

export const fetchRecommendations = async (tagObject: Tag[], recObject: RecommendationFilter | undefined, isLoggedIn: boolean, limit: number) => {

  if (tagObject.length === 0) return;

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.map(tag => tag.id)));

    const recTargets = recObject ? stringifyFilters(recObject) : '';
    const seedType = tagObject[0]?.type;

    const url = isLoggedIn
      ? `${baseUrl}/api/recommendation?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`
      : `${baseUrl}/api/public-recommendation?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    // Local storage temporary caching (only one query at a time - used for saving data when logging in and refreshing)
    const cacheKey = `limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;
    const cachedEntry = localStorage.getItem(CACHE_KEY);
    if (cachedEntry) {
      const { key: storedKey, data: storedData } = JSON.parse(cachedEntry);

      // Compare the stored key with the current request's cacheKey
      if (storedKey === cacheKey) {
        return storedData as SpotifyRecommendationResponse;
      }
    }

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: SpotifyRecommendationResponse = await response.json();
    
    const cacheValue = JSON.stringify({ key: cacheKey, data });
    localStorage.setItem(CACHE_KEY, cacheValue);

    return data;
  } catch (error) {
    console.error('Error fetching recommendations', error);
  }
};

const stringifyFilters = (filters: RecommendationFilter): string => {
  return Object.entries(filters)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `target_${key}=${value}`)
    .join(',');
}