import Icon from '@/components/common/icon';
import { moderateScale } from '@/newLib/responsive';
import { useTheme } from '@/newLib/theme';
import { ThemedView } from '@/newLib/ThemedView';
import { SPACING } from '@/theme/spacing';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';

interface SearchInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export const SearchInput = ({ containerStyle, style, ...props }: SearchInputProps) => {
  const { theme } = useTheme();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          borderColor: theme.border,
          backgroundColor: theme.background,
        },
        containerStyle,
      ]}
    >
      <Icon name="Search" size={moderateScale(20)} color="textPrimary" />
      <TextInput
        style={[
          styles.input,
          {
            color: theme.textPrimary,
          },
          style,
        ]}
        placeholderTextColor={theme.textDisabled}
        {...props}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(30), // Pill shape
    paddingHorizontal: SPACING.space04,
    height: moderateScale(48),
    gap: SPACING.space02,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular', // Assuming Inter font, or use theme typography
    fontSize: moderateScale(14),
  },
});
