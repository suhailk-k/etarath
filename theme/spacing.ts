import { Device } from '@/newLib/device';
import { moderateScale } from '@/newLib/responsive';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const top = initialWindowMetrics?.insets.top ?? moderateScale(20);
const bottom = Device.isAndroid
  ? moderateScale(20)
  : (initialWindowMetrics?.insets.bottom ?? moderateScale(20));

export const SPACING = {
  space01: moderateScale(0),
  space02: moderateScale(2),
  space03: moderateScale(4),
  space04: moderateScale(8),
  space05: moderateScale(12),
  space06: moderateScale(16),
  space07: moderateScale(20),
  space08: moderateScale(24),
  space09: moderateScale(32),
  space10: moderateScale(40),
  space11: moderateScale(48),
  space12: moderateScale(64),
  header: moderateScale(56) + top,
  screenPadding: moderateScale(16),
  gap: moderateScale(8), 
  screenBottom: bottom,
  screenTop: top,
  screenWithoutPadding: Device.width - moderateScale(32),
  screenBottomWithTab: bottom + moderateScale(80),
};
