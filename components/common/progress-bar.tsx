import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import React, { FC, memo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

export type ProgressBarProps = {
  progress: number; // 0 to 100
  height?: number;
  fillColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  showLabel?: boolean;
  labelStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  height = 30, // Default height slightly larger to match image feel (looks like ~30-40px)
  fillColor = "#0FB918", // Default success green
  backgroundColor = "transparent",
  borderColor = "#000000",
  showLabel = true,
  labelStyle,
  containerStyle,
}) => {
  const { theme } = useTheme();

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        styles.container,
        {
          height: moderateScale(height),
          borderRadius: moderateScale(height / 2),
          backgroundColor,
          borderColor,
        },
        containerStyle,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: fillColor,
            borderTopLeftRadius: moderateScale(height / 2) - 1,
            borderBottomLeftRadius: moderateScale(height / 2) - 1,
            // If full, round right side too roughly
            borderTopRightRadius:
              clampedProgress >= 100 ? moderateScale(height / 2) - 1 : 0,
            borderBottomRightRadius:
              clampedProgress >= 100 ? moderateScale(height / 2) - 1 : 0,
          },
        ]}
      />
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelText,
              {
                fontSize: moderateScale(height * 0.6), // Scale font with height
              },
              labelStyle,
            ]}
          >
            {`${Math.round(clampedProgress)}%`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  labelContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  labelText: {
    fontWeight: "600",
    color: "#000000",
  },
});

export default memo(ProgressBar);
