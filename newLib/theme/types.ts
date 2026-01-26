import type { ThemeColors } from '@/theme/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export type SelectedTheme = 'light' | 'dark';

export type Theme = ThemeColors;

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  selectedTheme: SelectedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
