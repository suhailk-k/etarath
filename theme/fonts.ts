import { moderateScale } from '@/newLib/responsive';

export const FONT_FAMILIES = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
};

export const createTypography = () => ({

  title: {
    fontWeight: '600',
    fontSize: moderateScale(20),
    // lineHeight: moderateScale(25),
    // letterSpacing: moderateScale(0),
  },
  smallButtonText: {
    fontWeight: '600',
    fontSize: moderateScale(12),
  },
  subTitle: {
    fontWeight: '400',
    fontSize: moderateScale(16),
  },
  description: {
    fontWeight: '400',
    fontSize: moderateScale(14),
  },
  text16B: {
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  text16R: {
    fontWeight: '400',
    fontSize: moderateScale(16),
  },
  text14M: {
    fontWeight: '500',
    fontSize: moderateScale(14),
  },
  text15B: {
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  text12M: {
    fontWeight: '500',
    fontSize: moderateScale(12),
  },
  
});

export const TYPOGRAPHY = createTypography();

export type TypographyVariant = keyof ReturnType<typeof createTypography>;
