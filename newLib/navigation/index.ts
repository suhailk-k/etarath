import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import type { Router } from 'expo-router';
import { router, withLayoutContext } from 'expo-router';

// Enterprise-level: Add bottom tab navigator support (commented for future use)
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// const { Navigator: BottomTabNavigator } = createBottomTabNavigator();
// export const BottomTabs = withLayoutContext<any, typeof BottomTabNavigator, any, any>(BottomTabNavigator);

export const MaterialTopTabComponent = createMaterialTopTabNavigator();
const { Navigator, Screen } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
export { ExpoRoot, Link, Redirect, Slot, Stack, Tabs, Unmatched } from 'expo-router';
export { ScrollViewStyleReset } from 'expo-router/html';

// Navigation helpers (enterprise: typed and documented)
export const canGoBack: Router['canGoBack'] = router.canGoBack;
export const navigate: Router['navigate'] = router.navigate;
export const push: Router['push'] = router.push;
export const goBack: Router['back'] = router.back;
export const replace: Router['replace'] = router.replace;
export const setParams: Router['setParams'] = router.setParams;

// Enterprise-level: Add default screen options and tab options
export const screenOptions: MaterialTopTabNavigationOptions = {
  animationEnabled: true,
  swipeEnabled: true,
};

export const tabBarScreenOptions: Partial<MaterialTopTabNavigationOptions> = {
  lazy: true,
  tabBarIndicatorStyle: { backgroundColor: '#1465F1', height: 3 },
  tabBarLabelStyle: { fontWeight: '600', fontSize: 14 },
  tabBarActiveTintColor: '#1465F1',
  tabBarInactiveTintColor: '#4A4A4A',
  tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 0 },
};

// Export useful hooks from expo-router
export {
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigationContainerRef,
  usePathname,
  useRouter,
  useSegments,
} from 'expo-router';

// Enterprise: Export Screen for custom tab usage
export { Screen };
