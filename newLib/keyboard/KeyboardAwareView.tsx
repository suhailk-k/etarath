import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

/**
 * KeyboardAwareView
 * -----------------
 * - Uses react-native-keyboard-controller for buttery-smooth animations.
 * - Cross-platform default behaviors (padding for iOS, height for Android).
 * - Accepts keyboardVerticalOffset for cases with headers/safe areas.
 * - Keeps styling consistent across the app.
 */
type Props = {
  children: React.ReactNode;
  style?: object;
  behavior?: 'height' | 'position' | 'padding' | undefined;
  keyboardVerticalOffset?: number;
};

export function KeyboardAwareView({
  children,
  style,
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
  keyboardVerticalOffset = 0,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
