import { Device } from "@/newLib/device";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { SPACING } from "@/theme/spacing";
import React from "react";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { View } from "react-native";

const ProfileSkeleton = () => {
  const { theme } = useTheme();
  const width = Device.width - SPACING.screenPadding * 2;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: SPACING.screenTop,
      }}
    >
      <View style={{ padding: SPACING.screenPadding }}>
        {/* Profile Card Skeleton */}
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.backgroundSecondary,
            borderRadius: moderateScale(12),
            padding: moderateScale(16),
            marginBottom: moderateScale(24),
          }}
        >
          <ContentLoader
            speed={1}
            width={width - moderateScale(32)} // Adjust for card padding
            height={moderateScale(60)}
            viewBox={`0 0 ${width - moderateScale(32)} ${moderateScale(60)}`}
            backgroundColor={theme.backgroundSecondary}
            foregroundColor={theme.background}
          >
            {/* Avatar */}
            <Circle cx="30" cy="30" r="30" />

            {/* Name */}
            <Rect x="72" y="5" rx="4" ry="4" width="120" height="16" />

            {/* Location */}
            <Rect x="72" y="28" rx="4" ry="4" width="80" height="12" />

            {/* Phone */}
            <Rect x="72" y="46" rx="4" ry="4" width="100" height="12" />

            {/* Edit Icon */}
            <Rect
              x={width - moderateScale(32 + 20)}
              y="20"
              rx="4"
              ry="4"
              width="20"
              height="20"
            />
          </ContentLoader>
        </View>

        {/* Menu Items Skeleton */}
        <View style={{ marginTop: moderateScale(8) }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: moderateScale(16),
                }}
              >
                <ContentLoader
                  speed={1}
                  width={width}
                  height={moderateScale(24)}
                  viewBox={`0 0 ${width} ${moderateScale(24)}`}
                  backgroundColor={theme.backgroundSecondary}
                  foregroundColor={theme.background}
                >
                  {/* Icon */}
                  <Rect x="0" y="0" rx="4" ry="4" width="24" height="24" />

                  {/* Label */}
                  <Rect x="36" y="4" rx="4" ry="4" width="150" height="16" />

                  {/* Chevron */}
                  <Rect
                    x={width - 20}
                    y="2"
                    rx="4"
                    ry="4"
                    width="20"
                    height="20"
                  />
                </ContentLoader>
              </View>
              {item < 5 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.backgroundSecondary,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProfileSkeleton;
