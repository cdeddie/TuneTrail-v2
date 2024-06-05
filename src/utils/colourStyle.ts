export const pickBWTextColour = (colour: string): string => {
  const [r, g, b] = colour.slice(4, -1).split(',').map(Number);

  const luminance = r * 0.299 + g * 0.587 + b * 0.114;

  return luminance > 186 ? '#000000' : '#FFFFFF';
};