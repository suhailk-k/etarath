import { Dimensions } from 'react-native';

import { moderateScale } from '../utils/responsive/scaling';

export const SPACING = {
  '4xs': moderateScale(1),
  '3xs': moderateScale(2),
  '2xs': moderateScale(4),
  xs: moderateScale(6),
  small: moderateScale(8),
  medium: moderateScale(12),
  large: moderateScale(16),
  extraLarge: moderateScale(20),
  '2xLarge': moderateScale(24),
  '3xLarge': moderateScale(32),
  '4xLarge': moderateScale(36),
  '5xLarge': moderateScale(72),
} as const;

export const CORNER_RADIUS = {
  none: 0,
  small: moderateScale(4),
  medium: moderateScale(8),
  large: moderateScale(12),
  extraLarge: moderateScale(16),
} as const;

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
