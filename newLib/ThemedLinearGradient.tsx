import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

import { GRADIENTS } from '../theme/colors';

import type { GradientKeys, GradientValue } from '../theme/colors';

/**
 * Props for ThemedLinearGradient component
 *
 * @property variant - The theme gradient variant to use (e.g., 'primary', 'secondary', etc.)
 * @property colors - Optional override for gradient colors
 */

export interface ThemedLinearGradientProps extends Omit<LinearGradientProps, 'colors'> {
  /**
   * Gradient key from theme GRADIENTS (e.g., 'gradient1', 'gradient2', etc.)
   * Defaults to 'gradient1'.
   */
  gradient?: GradientKeys;
  /**
   * Optional override for gradient colors. If provided, takes precedence over theme.
   * Must be at least two colors.
   */
  colors?: GradientValue;
}

/**
 * ThemedLinearGradient
 *
 * A reusable, enterprise-grade linear gradient component that uses only theme GRADIENTS.
 *
 * Usage:
 * <ThemedLinearGradient gradient="gradient1" style={...} {...otherProps} />
 */
export const ThemedLinearGradient: React.FC<ThemedLinearGradientProps> = ({
  gradient = 'gradient1',
  colors: overrideColors,
  style,
  ...rest
}) => {
  // Only allow gradients from GRADIENTS
  const colors = overrideColors || GRADIENTS[gradient];

  return <LinearGradient colors={colors} style={[styles.gradient, style]} {...rest} />;
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    height: '100%',
  },
});
