export const truncateString = (input: string, limit: number) => {
  if (input.length > limit) {
    return input.substring(0, limit) + '...';
  } else {
    return input;
  }
};