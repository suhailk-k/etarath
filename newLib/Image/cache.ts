import * as FileSystem from 'expo-file-system/legacy';

import type { ImageCachePolicy } from './types';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}image-cache/`;
const MEMORY_CACHE = new Map<string, string>();
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

class ImageCacheManager {
  private static instance: ImageCacheManager;

  private constructor() {
    this.setupCacheDirectory();
  }

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  private async setupCacheDirectory(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_FOLDER, { intermediates: true });
    }
  }

  private getMemoryCache(key: string): string | undefined {
    return MEMORY_CACHE.get(key);
  }

  private setMemoryCache(key: string, value: string): void {
    MEMORY_CACHE.set(key, value);
  }

  private async getDiskCache(key: string): Promise<string | undefined> {
    const path = `${CACHE_FOLDER}${key}`;
    try {
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists && 'modificationTime' in info) {
        const age = Date.now() - info.modificationTime * 1000;
        if (age > CACHE_EXPIRY) {
          await FileSystem.deleteAsync(path);
          return undefined;
        }
        return path;
      }
    } catch (error) {
      console.warn('Error reading disk cache:', error);
    }
    return undefined;
  }

  private async setDiskCache(key: string, uri: string): Promise<string> {
    const path = `${CACHE_FOLDER}${key}`;
    try {
      await FileSystem.downloadAsync(uri, path);
      return path;
    } catch (error) {
      console.warn('Error writing disk cache:', error);
      throw error;
    }
  }

  async getCachedUri(uri: string, cachePolicy: ImageCachePolicy = 'memory-disk'): Promise<string> {
    if (uri.startsWith('file://') || uri.startsWith('data:')) return uri;

    const key = this.generateKey(uri);

    if (cachePolicy === 'memory-only' || cachePolicy === 'memory-disk') {
      const memoryCached = this.getMemoryCache(key);
      if (memoryCached) return memoryCached;
    }

    if (cachePolicy === 'disk-only' || cachePolicy === 'memory-disk') {
      const diskCached = await this.getDiskCache(key);
      if (diskCached) {
        if (cachePolicy === 'memory-disk') {
          this.setMemoryCache(key, diskCached);
        }
        return diskCached;
      }
    }

    if (cachePolicy !== 'none') {
      try {
        const cachedPath = await this.setDiskCache(key, uri);
        if (cachePolicy === 'memory-only' || cachePolicy === 'memory-disk') {
          this.setMemoryCache(key, cachedPath);
        }
        return cachedPath;
      } catch (error) {
        console.warn('Failed to cache image:', error);
        return uri;
      }
    }

    return uri;
  }

  private generateKey(uri: string): string {
    return encodeURIComponent(uri);
  }

  async clearCache(): Promise<void> {
    MEMORY_CACHE.clear();
    try {
      await FileSystem.deleteAsync(CACHE_FOLDER, { idempotent: true });
      await this.setupCacheDirectory();
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const result = await FileSystem.getInfoAsync(CACHE_FOLDER);
      if (result.exists && 'size' in result) {
        return result.size;
      }
      return 0;
    } catch (error) {
      console.warn('Error getting cache size:', error);
      return 0;
    }
  }
}

export const imageCache = ImageCacheManager.getInstance();
