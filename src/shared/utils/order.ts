export const formatOrderId = (slug: string) => {
  if (!slug) return '';
  const parts = slug.split('-');
  // Expecting format: order-RANDOM-TIMESTAMP
  // Return #RANDOM
  if (parts.length >= 2) {
    return `#${parts[1]}`;
  }
  return '#' + slug;
};
