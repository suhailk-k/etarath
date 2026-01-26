import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Image as ExpoImage } from 'expo-image';

import { imageCache } from './cache';
import type { ImageProps } from './types';

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Enterprise-level Image component with advanced features:
 * - Caching with configurable policies
 * - Error handling and retries
 * - Loading states and placeholders
 * - Accessibility support
 * - Performance optimizations
 */
export const Image = React.memo((props: ImageProps & { children?: React.ReactNode }) => {
  const {
    blurRadius,
    contentFit = 'cover',
    children,
    imageStyle,
    priority = 'normal',
    source,
    style,
    tintColor,
    allowDownScaling = false,
    placeholder,
    fallback,
    onLoadStart,
    onLoad,
    onError,
    cachePolicy = 'memory-disk',
    showLoadingIndicator = true,
    accessibilityLabel,
    prefetch = false,
    timeout = DEFAULT_TIMEOUT,
    quality,
    shouldRetry = true,
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelay = DEFAULT_RETRY_DELAY,
    backgroundColor = 'transparent',
    loadingOverlayColor = 'rgba(0, 0, 0, 0.1)',
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  const [cachedSource, setCachedSource] = useState(source);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Handle remote image caching
  useEffect(() => {
    if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
      const setupCache = async () => {
        try {
          const cachedUri = await imageCache.getCachedUri(source.uri!, cachePolicy);
          setCachedSource({ ...source, uri: cachedUri });
        } catch (err) {
          console.warn('Image caching failed:', err);
          setCachedSource(source);
        }
      };
      setupCache();
    } else {
      setCachedSource(source);
    }
  }, [source, cachePolicy]);

  // Handle prefetching
  useEffect(() => {
    if (prefetch && 'uri' in source && typeof source.uri === 'string') {
      ExpoImage.prefetch(source.uri);
    }
  }, [prefetch, source]);

  const handleError = useCallback(
    (error: string) => {
      setError(new Error(error));
      setIsLoading(false);

      if (shouldRetry && retries < retryCount) {
        setTimeout(() => {
          setRetries((prev) => prev + 1);
          setIsLoading(true);
        }, retryDelay);
      } else {
        onError?.({ error });
      }
    },
    [shouldRetry, retries, retryCount, retryDelay, onError]
  );

  // Handle loading timeout
  useEffect(() => {
    if (isLoading && timeout) {
      timeoutRef.current = setTimeout(() => {
        handleError('Image loading timed out');
      }, timeout);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
    return undefined;
  }, [isLoading, timeout, handleError]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoad = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setError(null);
    setRetries(0);
    onLoad?.();
  }, [onLoad]);

  const imageProps = useMemo(
    () => ({
      allowDownscaling: allowDownScaling,
      blurRadius,
      priority,
      contentFit,
      source: cachedSource,
      tintColor,
      onLoadStart: handleLoadStart,
      onLoad: handleLoad,
      onError: (event: { error: string }) => handleError(event.error),
      ...(quality && { quality }),
      accessible: true,
      accessibilityLabel:
        accessibilityLabel || (typeof source === 'number' ? 'Local image' : 'Remote image'),
      accessibilityRole: 'image' as const,
    }),
    [
      allowDownScaling,
      blurRadius,
      priority,
      contentFit,
      cachedSource,
      tintColor,
      handleLoadStart,
      handleLoad,
      handleError,
      quality,
      accessibilityLabel,
      source,
    ]
  );

  const renderContent = () => {
    if (error && fallback) {
      return typeof fallback === 'object' && !React.isValidElement(fallback) ? (
        <ExpoImage source={fallback} style={imageStyle} contentFit="contain" />
      ) : (
        fallback
      );
    }

    if (isLoading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.loadingContainer,
            { backgroundColor: loadingOverlayColor },
          ]}>
          {placeholder ? (
            typeof placeholder === 'object' && !React.isValidElement(placeholder) ? (
              <ExpoImage source={placeholder} style={imageStyle} contentFit="contain" />
            ) : (
              placeholder
            )
          ) : showLoadingIndicator ? (
            <ActivityIndicator />
          ) : null}
        </View>
      );
    }

    return null;
  };

  const containerStyle = [styles.container, { backgroundColor }, style];

  if (children) {
    return (
      <View style={containerStyle}>
        <ExpoImage {...imageProps} style={[StyleSheet.absoluteFill, imageStyle]} />
        {renderContent()}
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <ExpoImage {...imageProps} style={[StyleSheet.absoluteFill, imageStyle]} />
      {renderContent()}
    </View>
  );
});

Image.displayName = 'Image';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
