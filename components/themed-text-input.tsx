import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { moderateScale } from '@/newLib/responsive';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  label?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  label,
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon');

  return (
    <TextInput
      style={[
        { color, backgroundColor, borderColor },
        styles.input,
        style,
      ]}
      placeholderTextColor="#999"
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    fontSize: moderateScale(16),
  },
});
