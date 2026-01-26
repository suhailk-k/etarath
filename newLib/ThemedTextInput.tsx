import React, { forwardRef } from 'react';

import type { TextInput as TextInputType } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';

import { TYPOGRAPHY } from '@/theme/fonts';
import { SPACING } from '@/theme/spacing';
import { moderateScale } from './responsive';
import { useTheme } from './theme/hooks/useTheme';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

import type { TextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface ThemedTextInputProps extends Omit<TextInputProps, 'ref'> {
  /**
   * Label text to display above the input
   */
  label?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;

  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
}

export const ThemedTextInput = forwardRef<TextInputType, ThemedTextInputProps>(
  ({ label, disabled, style, containerStyle, labelStyle, ...restProps }, ref) => {
    const { theme } = useTheme();

    return (
      <ThemedView style={[styles.container, containerStyle]}>
        {label && (
          <ThemedText color="white" variant="bodyText01" style={labelStyle}>
            {label}
          </ThemedText>
        )}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.textPrimary,
              borderColor: theme.border,
            },
            style,
          ]}
          placeholderTextColor={theme.textDisabled}
          editable={!disabled}
          {...restProps}
        />
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: SPACING.space04,
    width: '100%',
  },

  input: {
    ...TYPOGRAPHY.subheading01,
    lineHeight: moderateScale(16),
    height: moderateScale(50),
    borderWidth: moderateScale(1),
    borderRadius: SPACING.space04,
    paddingHorizontal: SPACING.space04,
  },
});
