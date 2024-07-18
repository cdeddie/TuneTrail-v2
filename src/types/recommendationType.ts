export type RecommendationFilter = {
  popularity:     number | null;
  energy:         number | null;
  happiness:      number | null;
  danceability:   number | null;
  [key: string]:  number | null;
};