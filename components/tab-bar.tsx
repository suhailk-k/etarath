import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { ThemedView } from "@/newLib/ThemedView";
import { SPACING } from "@/theme/spacing";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./common/icon";

const TabBar = (props: BottomTabBarProps) => {
  const { theme } = useTheme();
  useSafeAreaInsets();

  const screens = props.state.routeNames;
  const index = props.state.index;
  const currentScreen = screens[index];

  type IconKey = "TabHome" | "TabOrder" | "TabProfile" | "TabProduct" | "TabWarranty";

  const ICON_MAP: Record<string, IconKey> = {
    index: "TabHome",
    orders: "TabOrder",
    profile: "TabProfile",
    products: "TabProduct",
    warranty: "TabWarranty",
  };
  const IconName = (tabName: string): IconKey => ICON_MAP[tabName] ?? "TabHome";

  return (
    <ThemedView backgroundColor="primary" style={[styles.container, { marginBottom: SPACING.screenBottom }]}>
      {screens.map((screen, i) => {
        const isSelected = screen === currentScreen;
        return (
          <Pressable
            onPress={() => {
              props.navigation.navigate(screen);
            }}
            key={i}
            style={styles.pressable}
          >
            <ThemedView
              style={[styles.iconWrapper, { borderWidth: isSelected ? 0 : moderateScale(1), borderColor: theme.background }] as StyleProp<ViewStyle>}
              backgroundColor={isSelected ? "background" : "primary"}
            >
              <Icon
                name={IconName(screen)}
                size={moderateScale(22)}
                iconFillColor={isSelected ? "primary" : "background"}
              />
            </ThemedView>
          </Pressable>
        );
      })}
    </ThemedView>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(76),
    borderRadius: moderateScale(76),
    margin: SPACING.screenPadding,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: {
    height: moderateScale(54),
    width: moderateScale(54),
    borderRadius: moderateScale(54),
    alignItems: "center",
    justifyContent: "center",
  },
});
