import { ThemedText } from '@/newLib/ThemedText';
import { moderateScale } from '@/newLib/responsive';
import { useTheme } from '@/newLib/theme/hooks/useTheme';
import { SPACING } from '@/theme/spacing';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
}

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const handlePress = () => {
    setContainerIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setContainerIsFocused(false);
  };

  return (
    <View style={styles.container}>
      {/* Hidden Text Input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
             // Only allow numeric input
             if (/^\d*$/.test(text) && text.length <= length) {
                 onChange(text);
             }
        }}
        onBlur={handleBlur}
        style={styles.hiddenInput}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
      />

      {/* Visual OTP Circles */}
      <Pressable onPress={handlePress} style={styles.otpContainer}>
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || '';
          const isFocused = containerIsFocused && index === value.length;
          
          return (
            <View
              key={index}
              style={[
                styles.circle,
                {
                  borderColor: isFocused ? theme.primary : theme.border,
                  backgroundColor: theme.background
                }
              ]}
            >
              <ThemedText variant="title">
                {digit}
              </ThemedText>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: SPACING.space04,
  },
  circle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
