import { Dimensions, Platform, StatusBar } from 'react-native';

/**
 * Enterprise Device utility: Provides device dimensions and status bar height.
 * Always use this for consistent device metrics across the app.
 *
 * @example
 * import { Device } from 'newLib/device';
 * console.log(Device.height); // e.g. 896
 * console.log(Device.width); // e.g. 414
 * console.log(Device.statusBarHeight); // e.g. 44
 */
export const Device: {
  isAndroid: any;
  height: number;
  width: number;
  statusBarHeight: number;
} = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
  statusBarHeight: StatusBar.currentHeight ?? 0,
  isAndroid: Platform.OS === 'android',
};
