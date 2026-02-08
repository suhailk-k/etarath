import { Device } from "@/newLib/device";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { SPACING } from "@/theme/spacing";
import React from "react";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { View } from "react-native";

const PerformanceSummarySkeleton = () => {
  const { theme } = useTheme();
  const width = Device.width - SPACING.screenPadding * 2;
  const cardWidth = width - moderateScale(40); // Card padding is 20*2 = 40

  return (
    <View
      style={{ paddingHorizontal: SPACING.screenPadding, gap: SPACING.gap }}
    >
      {/* Gauge Card Skeleton */}
      <View
        style={{
          backgroundColor: "#F9F9F9", // Matches original card bg
          borderRadius: moderateScale(20),
          padding: moderateScale(20),
          marginBottom: moderateScale(10),
        }}
      >
        <ContentLoader
          speed={1}
          width={cardWidth}
          height={moderateScale(300)}
          viewBox={`0 0 ${cardWidth} ${moderateScale(300)}`}
          backgroundColor={theme.backgroundSecondary || "#E1E9EE"}
          foregroundColor={theme.background || "#F2F8FC"}
        >
          {/* Gauge Circle */}
          <Circle
            cx={cardWidth / 2}
            cy={moderateScale(80)}
            r={moderateScale(70)}
          />

          {/* Stats Left */}
          <Rect x="0" y="60" rx="4" ry="4" width="60" height="20" />
          <Rect x="0" y="90" rx="4" ry="4" width="60" height="10" />

          {/* Stats Right */}
          <Rect
            x={cardWidth - 60}
            y="60"
            rx="4"
            ry="4"
            width="60"
            height="20"
          />
          <Rect
            x={cardWidth - 60}
            y="90"
            rx="4"
            ry="4"
            width="60"
            height="10"
          />

          {/* Center stats */}
          <Rect
            x={(cardWidth - 80) / 2}
            y="70"
            rx="4"
            ry="4"
            width="80"
            height="20"
          />

          {/* Bars Section */}
          {/* Orders Bar */}
          <Rect x="0" y="180" rx="4" ry="4" width="60" height="15" />
          <Rect
            x="70"
            y="185"
            rx="4"
            ry="4"
            width={cardWidth - 130}
            height="6"
          />
          <Rect
            x={cardWidth - 40}
            y="180"
            rx="4"
            ry="4"
            width="40"
            height="15"
          />

          {/* Warranty Bar */}
          <Rect x="0" y="220" rx="4" ry="4" width="60" height="15" />
          <Rect
            x="70"
            y="225"
            rx="4"
            ry="4"
            width={cardWidth - 130}
            height="6"
          />
          <Rect
            x={cardWidth - 40}
            y="220"
            rx="4"
            ry="4"
            width="40"
            height="15"
          />
        </ContentLoader>
      </View>

      {/* History Header & Tabs */}
      <ContentLoader
        speed={1}
        width={width}
        height={moderateScale(100)}
        viewBox={`0 0 ${width} ${moderateScale(100)}`}
        backgroundColor={theme.backgroundSecondary || "#E1E9EE"}
        foregroundColor={theme.background || "#F2F8FC"}
      >
        {/* Title: History */}
        <Rect x="0" y="0" rx="4" ry="4" width="100" height="24" />

        {/* Tabs */}
        <Rect x="0" y="40" rx="20" ry="20" width="100" height="40" />
        <Rect x="110" y="40" rx="20" ry="20" width="100" height="40" />

        {/* Filter Text */}
        <Rect x={width - 80} y="50" rx="4" ry="4" width="80" height="20" />
      </ContentLoader>

      {/* List items */}
      <ContentLoader
        speed={1}
        width={width}
        height={200}
        viewBox={`0 0 ${width} 200`}
        backgroundColor={theme.backgroundSecondary || "#E1E9EE"}
        foregroundColor={theme.background || "#F2F8FC"}
      >
        <Rect x="0" y="0" rx="4" ry="4" width={width} height="50" />
        <Rect x="0" y="60" rx="4" ry="4" width={width} height="50" />
        <Rect x="0" y="120" rx="4" ry="4" width={width} height="50" />
      </ContentLoader>
    </View>
  );
};

export default PerformanceSummarySkeleton;
