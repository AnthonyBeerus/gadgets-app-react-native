export function shouldUsePrototypeFeedImmediately(variant: unknown) {
  return variant === 'development' || variant === 'preview';
}
