import { moderateScale, verticalScale } from '@/newLib/responsive';

export const FONTS = {
  regular: 'RobotoRegular',
  medium: 'RobotoMedium',
  bold: 'RobotoBold',
} as const;

export const createTypography = () => ({
  h1: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(24),
    lineHeight: verticalScale(32),
    letterSpacing: 0,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(20),
    lineHeight: verticalScale(28),
    letterSpacing: 0,
  },
  h3: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(18),
    lineHeight: verticalScale(26),
    letterSpacing: 0,
  },
  h4: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(16),
    lineHeight: verticalScale(24),
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: moderateScale(16),
    lineHeight: verticalScale(22),
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: FONTS.regular,
    fontSize: moderateScale(14),
    lineHeight: verticalScale(22),
    letterSpacing: 0.25,
  },
  button: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(16),
    lineHeight: verticalScale(22),
    letterSpacing: 0.25,
  },
  caption: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    lineHeight: verticalScale(16),
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(10),
    lineHeight: verticalScale(14),
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    lineHeight: verticalScale(20),
    letterSpacing: 0.2,
  },
});

export const TYPOGRAPHY = createTypography();

export type TypographyVariant = keyof ReturnType<typeof createTypography>;
