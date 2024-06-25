export const truncateString = (input: string) => {
  if (input.length > 35) {
    return input.substring(0, 35) + '...';
  } else {
    return input;
  }
};