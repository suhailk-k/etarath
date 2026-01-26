import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

/**
 * DismissKeyboardView
 * -------------------
 * - Wraps children in a touchable that dismisses the keyboard when tapping outside.
 * - Pairs well with KeyboardAwareView.
 */
export function DismissKeyboardView({ children }: { children: React.ReactNode }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
