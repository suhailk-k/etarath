import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME_COLORS } from '@/theme/colors';
import type { SelectedTheme, Theme, ThemeContextType, ThemeMode } from '../types';

const THEME_KEY = 'app_theme_mode';

export const ThemeContext = createContext<ThemeContextType>({
  theme: THEME_COLORS.light,
  mode: 'light',
  selectedTheme: 'light',
  setMode: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  // Load saved theme on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_KEY);
        if (savedMode) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadSavedTheme();
  }, []);

  const theme = useMemo<Theme>(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light;
    }
    return mode === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light;
  }, [mode, systemColorScheme]);

  const selectedTheme = useMemo<SelectedTheme>(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode === 'dark' ? 'dark' : 'light';
  }, [mode, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  // Save theme preference whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(THEME_KEY, mode);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    };
    saveTheme();
  }, [mode]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      selectedTheme,
      setMode,
      toggleTheme,
    }),
    [theme, mode, selectedTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
