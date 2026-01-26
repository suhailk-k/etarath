
import { useTheme } from '@/newLib/theme';
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const {theme} = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
    </Stack>
  );
}
