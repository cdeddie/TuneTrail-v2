import { Tag }                            from '@/types/TagType';
import { RecommendationFilter }           from '@/types/RecommendationType';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

export const fetchRecommendations = async (tagObject: Tag[], recObject: RecommendationFilter | undefined, isLoggedIn: boolean, limit: number) => {

  if (tagObject.length === 0) return;

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.map(tag => tag.id)));

    const recTargets = recObject ? stringifyFilters(recObject) : '';
    const seedType = tagObject[0]?.type;

    const url = isLoggedIn
      ? `${baseUrl}/api/recommendation?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`
      : `${baseUrl}/api/public-recommendation?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: SpotifyApi.RecommendationsObject = await response.json();
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