import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import type { ImageErrorEventData, ImageSource } from 'expo-image';

export type ImageCachePolicy = 'memory-only' | 'disk-only' | 'memory-disk' | 'none';

export type ImageLoadingStrategy = 'progressive' | 'lazy' | 'eager';

export interface ImageLoadEventData {
  source: ImageSource;
}

export interface ImageProps {
  /**
   * The radius of the blur in points, 0 means no blur effect.
   * @default 0
   */
  blurRadius?: number;

  /**
   * The style object for image.
   */
  imageStyle?: StyleProp<ImageStyle>;

  /**
   * Load priority. Higher priority loads start first.
   * @default 'normal'
   */
  priority?: 'low' | 'normal' | 'high';

  /**
   * The image source (remote URL, local file, or require() result).
   * For array sources, best fitting source is chosen based on container size and screen scale.
   * Width, height and scale properties are important for array sources.
   */
  source: ImageSource;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Color to tint template images. Applied to non-transparent pixels.
   * @default null
   */
  tintColor?: string;

  /**
   * How the image resizes to fit its container.
   * @default 'cover'
   */
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  /**
   * Allow downscaling for performance when image is larger than view
   * @default false
   */
  allowDownScaling?: boolean;

  /**
   * Custom placeholder component or image source to show while loading
   */
  placeholder?: ImageSource | React.ReactElement;

  /**
   * Custom error component or image source to show on error
   */
  fallback?: ImageSource | React.ReactElement;

  /**
   * Callback fired when the image starts loading
   */
  onLoadStart?: () => void;

  /**
   * Callback fired when the image loads successfully
   */
  onLoad?: () => void;

  /**
   * Callback fired when the image fails to load
   */
  onError?: (event: ImageErrorEventData) => void;

  /**
   * Cache policy for the image
   * @default 'memory-disk'
   */
  cachePolicy?: ImageCachePolicy;

  /**
   * Loading strategy for the image
   * @default 'progressive'
   */
  loadingStrategy?: ImageLoadingStrategy;

  /**
   * Whether to show loading indicator
   * @default true
   */
  showLoadingIndicator?: boolean;

  /**
   * Whether to use blur-up technique for progressive loading
   * @default true
   */
  useBlurUp?: boolean;

  /**
   * Accessibility label for the image
   */
  accessibilityLabel?: string;

  /**
   * Whether to prefetch the image
   * @default false
   */
  prefetch?: boolean;

  /**
   * Time in milliseconds after which to timeout the image load
   * @default 30000
   */
  timeout?: number;

  /**
   * Quality of the image (0-100)
   * Only applies to remote images
   * @default 75
   */
  quality?: number;

  /**
   * Whether to retry failed requests
   * @default true
   */
  shouldRetry?: boolean;

  /**
   * Number of retry attempts
   * @default 3
   */
  retryCount?: number;

  /**
   * Delay between retries in milliseconds
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Background color to show behind the image while loading
   * @default 'transparent'
   */
  backgroundColor?: string;

  /**
   * Custom loading overlay background color
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  loadingOverlayColor?: string;
}
