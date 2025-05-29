export const formatStatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};
