import { Tag } from '@/types/TagType';
import { RecommendationFilter } from '@/types/recommendationType';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

export const fetchRecommendations = async (tagObject: Tag[], recObject: RecommendationFilter | undefined) => {

  if (tagObject.length === 0) return;

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.map(tag => tag.id)));

    // TODO: NEED TO CHANGE THIS FOR THE NEW TYPE IN TS
    let recTargets;
    if (recObject) {
      recTargets = stringifyFilters(recObject);
    } else {
      recTargets='';
    }

    const limit = 25; // TODO implement client manipulation
    const seedType = tagObject[0]?.type;

    let url = `${baseUrl}/public-recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data
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