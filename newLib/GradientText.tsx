import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'packages/theme/hooks/useTheme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

import { GRADIENTS, THEME_COLORS } from '@/theme/colors';

// Helper to get variant gradients from theme
const getVariantGradients = (themeMode: 'light' | 'dark') => {
  const themeColors = THEME_COLORS[themeMode];
  // Handle secondary color for both light and dark
  const secondary = (themeColors as any).secondary || (themeColors as any).secondaryColor;
  return {
    primary: [themeColors.primary, themeColors.primaryHover, themeColors.primaryLight],
    secondary: [secondary, themeColors.primary],
    success: [themeColors.success, themeColors.primary],
    warning: [themeColors.warning, themeColors.primary],
    error: [themeColors.error, themeColors.primary],
    enterprise: GRADIENTS.gradient4,
  };
};


import type { ThemedTextProps } from './ThemedText';

type GradientColorsProp = string[] | keyof typeof GRADIENTS;

interface GradientTextProps extends ThemedTextProps {
  gradientColors?: GradientColorsProp;
}

export const GradientText: React.FC<GradientTextProps> = (props) => {
  const { gradientColors, style, variant = 'textGradient', children, ...themedTextProps } = props;
  const { mode } = useTheme();
  const themeMode = mode === 'dark' ? 'dark' : 'light';
  const VARIANT_GRADIENTS = getVariantGradients(themeMode);
  let colors: string[];
  if (typeof gradientColors === 'string') {
    colors = [...(GRADIENTS[gradientColors] ?? VARIANT_GRADIENTS[variant as keyof typeof VARIANT_GRADIENTS] ?? VARIANT_GRADIENTS.primary)];
  } else if (Array.isArray(gradientColors)) {
    colors = [...gradientColors];
  } else {
    colors = [...(VARIANT_GRADIENTS[variant as keyof typeof VARIANT_GRADIENTS] ?? VARIANT_GRADIENTS.primary)];
  }
  const gradientColorsArr = colors.length === 1 ? [colors[0], colors[0]] : colors;

  return (
    <MaskedView
      maskElement={
        <ThemedText style={[styles.text, style]} variant={variant} {...themedTextProps}>
          {children}
        </ThemedText>
      }>
      <LinearGradient
        colors={gradientColorsArr as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <ThemedText
          style={[styles.text, { opacity: 0 }, style]}
          variant={variant}
          {...themedTextProps}>
          {children}
        </ThemedText>
      </LinearGradient>
    </MaskedView>
  );
};
const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    letterSpacing: 0.1,
    includeFontPadding: false,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
});

export default GradientText;
