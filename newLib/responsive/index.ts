import { Dimensions, useWindowDimensions } from 'react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// Base dimensions from standard iPhone 14
export const BASE_DIMENSIONS = {
  width: 393,
  height: 852,
} as const;

/**
 * Scale a width dimension based on screen size
 * @param size - The size to scale
 * @returns Scaled size
 */
export const horizontalScale = (size: number): number =>
  (WINDOW_WIDTH / BASE_DIMENSIONS.width) * size;

/**
 * Scale a height dimension based on screen size
 * @param size - The size to scale
 * @returns Scaled size
 */
export const verticalScale = (size: number): number =>
  (WINDOW_HEIGHT / BASE_DIMENSIONS.height) * size;

/**
 * Scale a size with a factor for more moderate scaling
 * @param size - The size to scale
 * @param factor - Factor to control the scale impact (default: 0.5)
 * @returns Scaled size
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

/**
 * Custom hook for responsive dimensions that updates with window size changes
 * @returns Object with responsive scaling functions and current window dimensions
 */
export const useResponsiveScale = () => {
  const { width, height } = useWindowDimensions();

  const dynamicHorizontalScale = (size: number): number => (width / BASE_DIMENSIONS.width) * size;

  const dynamicVerticalScale = (size: number): number => (height / BASE_DIMENSIONS.height) * size;

  const dynamicModerateScale = (size: number, factor = 0.5): number =>
    size + (dynamicHorizontalScale(size) - size) * factor;

  return {
    horizontalScale: dynamicHorizontalScale,
    verticalScale: dynamicVerticalScale,
    moderateScale: dynamicModerateScale,
    windowWidth: width,
    windowHeight: height,
  };
};

// Export types for better TypeScript support
export type ScalingFunction = (size: number, factor?: number) => number;
