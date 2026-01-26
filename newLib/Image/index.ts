export { Image } from './Image';
export { imageCache } from './cache';
export type { ImageProps, ImageCachePolicy, ImageLoadingStrategy } from './types';

// Utility functions for image manipulation
export const imageUtils = {
  prefetchImages: async (uris: string[]) => {
    const { imageCache } = await import('./cache');
    return Promise.all(uris.map(uri => imageCache.getCachedUri(uri)));
  },

  clearCache: async () => {
    const { imageCache } = await import('./cache');
    return imageCache.clearCache();
  },

  getCacheSize: async () => {
    const { imageCache } = await import('./cache');
    return imageCache.getCacheSize();
  },
};
