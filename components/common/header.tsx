import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { useDashboardData } from "@/services/queries/home";
import { SPACING } from "@/theme/spacing";
import { router } from "expo-router";
import React, { FC, memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "./icon";
import ProgressBar from "./progress-bar";

export type HeaderProps = {
  onProfilePress?: () => void;
  profileAccessibilityLabel?: string;
  testID?: string;
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

const Header: FC<HeaderProps> = ({
  onProfilePress,
  profileAccessibilityLabel = "Open profile",
  testID = "app-header",
  title,
  showBack,
  onBackPress,
}) => {
  const { theme } = useTheme();
  const { data } = useDashboardData();

  const styles = getStyles(theme);

  const handleProfilePress = useCallback(() => {
    onProfilePress?.();
  }, [onProfilePress]);

  return (
    <View style={styles.container} testID={testID}>
      {showBack ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(10),
          }}
        >
          <Pressable onPress={onBackPress} hitSlop={10}>
            <Icon
              name="Back"
              size={moderateScale(24)}
              iconStrokeColor="primary"
            />
          </Pressable>
          {title && (
            <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: "600",
                color: "black",
              }}
            >
              {title}
            </Text>
          )}
        </View>
      ) : title ? (
        <Text
          style={{
            fontSize: moderateScale(18),
            fontWeight: "600",
            color: "black",
          }}
        >
          {title}
        </Text>
      ) : (
        <Icon
          name="HeaderIcon"
          height={moderateScale(35)}
          width={moderateScale(150)}
        />
      )}
      {!title && (
        <Pressable
          onPress={() => router.navigate("/(main)/performance-summary")}
          style={{ width: 100 }}
        >
          <ProgressBar
            height={20}
            progress={data?.data?.ProgressBar?.data?.progress || 0}
          />
        </Pressable>
      )}
    </View>
  );
};

export default memo(Header);

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingTop: SPACING.screenTop,
      height: moderateScale(56) + SPACING.screenTop,
      flexDirection: "row",
      paddingHorizontal: SPACING.screenPadding,
      alignItems: "center",
      justifyContent: "space-between",
    },
    profileButton: {
      backgroundColor: theme.backgroundSecondary,
      height: moderateScale(36),
      width: moderateScale(36),
      borderRadius: moderateScale(18),
      alignItems: "center",
      justifyContent: "center",
    },
  });
