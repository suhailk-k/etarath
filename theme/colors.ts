export const THEME_COLORS = {
  dark: {
    primary: "#000000",
    background: "#FFFFFF",
    backgroundSecondary: "#F2F2F2",
    error:"#FF0F0F",
    highlightPrimary: "#0F43FF",
    highlightSecondary: "#FF600F",
    placeholder:"#777777",
    // primaryHover: '#3E88FC',
    // primaryLight: '#235CEB',
    // secondary: '#3BB6E5',
    // background: '#000000',
    // surface: '#0A0A0A',
    // border: '#1F1F1F',
    // textPrimary: '#FFFFFF',
    // textSecondary: '#CCCCCC',
    // textDisabled: '#777777',
    // white: '#FFFFFF',
    // black: '#000000',
    // overlay: 'rgba(0, 0, 0, 0.8)',
    // primaryOverlay: 'rgba(20, 101, 241, 0.15)',
    // success: '#00B96F',
    // warning: '#FFA000',
    // error: '#D32F2F',
    // transparent: 'rgba(0, 0, 0, 0)',
    // placeholder: '#121212',
  },
  light: {
    primary: "#000000",
    background: "#FFFFFF",
    backgroundSecondary: "#F2F2F2",
    error:"#FF0F0F",
    highlightPrimary: "#0F43FF",
    highlightSecondary: "#FF600F",
    placeholder:"#777777",
    // primaryHover: '#1053C2',
    // primaryLight: '#E3F0FF',
    // secondary: '#3BB6E5',
    // background: '#FFFFFF',
    // surface: '#F7F9FC',
    // border: '#E0E0E0',
    // textPrimary: '#1A1A1A',
    // textSecondary: '#4A4A4A',
    // textDisabled: '#9E9E9E',
    // white: '#FFFFFF',
    // black: '#000000',
    // overlay: 'rgba(255, 255, 255, 0.8)',
    // primaryOverlay: 'rgba(20, 101, 241, 0.15)',
    // success: '#00B96F',
    // warning: '#FFA000',
    // error: '#D32F2F',
    // transparent: 'rgba(256, 256, 256, 0)',
    // placeholder: '#E2E2E2',
  },
} as const;

export const GRADIENTS = {
  gradient1: [
    "rgba(20, 101, 241, 0.3)",
    "rgba(0, 0, 0, 0.1)",
    "rgba(59, 182, 229, 0.3)",
  ],
  gradient2: ["#D5F1FB", "#3BB6E5"],
  gradient3: ["#1465F1", "#FFFFFF"],
  gradient4: ["#0099F7", "#EB45F0", "#FF7D00"],
  gradient5: ["#000000", "#0057C0"],
  gradient6: ["#4384F4", "#1465F1"],
  gradient7: ["#1465F1", "transparent"],
} as const;

export type GradientKeys = keyof typeof GRADIENTS;
export type GradientValue = (typeof GRADIENTS)[GradientKeys];

export type ThemeColors =
  | (typeof THEME_COLORS)["light"]
  | (typeof THEME_COLORS)["dark"];
