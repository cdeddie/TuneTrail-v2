import { Tag }                  from '@/types/TagType';
import { RecommendationFilter } from '@/types/RecommendationType';

const baseUrl = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL;

export const fetchRecommendations = async (tagObject: Tag[], recObject: RecommendationFilter | undefined): Promise<{ data: any; warning: boolean; } | undefined> => {

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

    let url = `${baseUrl}/api/recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    const warning = response.headers.get('X-Rate-Limit-Warning') === 'True';

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    return { data, warning };
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