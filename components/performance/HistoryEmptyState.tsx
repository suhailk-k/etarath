import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HistoryEmptyStateProps {
  type: "order" | "claim";
  filter: string;
}

const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({
  type,
  filter,
}) => {
  const { theme } = useTheme();

  const getMessage = () => {
    const itemType = type === "order" ? "orders" : "warranty claims";

    if (filter === "all") {
      return {
        title: `No ${itemType} found`,
        subtitle: `You don't have any ${itemType} for this period.`,
      };
    }

    return {
      title: `No ${filter} ${itemType}`,
      subtitle: `There are no ${filter} ${itemType} for this period.`,
    };
  };

  const { title, subtitle } = getMessage();

  return (
    <View style={styles.container}>
      {/* Icon/Illustration */}
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { borderColor: theme.primary }]}>
          <Text style={[styles.iconText, { color: theme.primary }]}>
            {type === "order" ? "📦" : "🔧"}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(60),
    paddingHorizontal: moderateScale(20),
  },
  iconContainer: {
    marginBottom: moderateScale(20),
  },
  iconCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  iconText: {
    fontSize: moderateScale(36),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    marginBottom: moderateScale(8),
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#888",
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
});

export default HistoryEmptyState;
