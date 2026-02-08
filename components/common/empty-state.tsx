import { moderateScale } from "@/newLib/responsive";
import { ThemedText } from "@/newLib/ThemedText";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type EmptyStateType = "no-data" | "no-results" | "no-connection";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "no-data",
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case "no-results":
        return {
          title: "No Results Found",
          description: "Try adjusting your search or filters",
          emoji: "🔍",
        };
      case "no-connection":
        return {
          title: "No Connection",
          description: "Please check your internet connection and try again",
          emoji: "📡",
        };
      case "no-data":
      default:
        return {
          title: "No Data Available",
          description: "There is nothing to display at the moment",
          emoji: "📭",
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <Text style={styles.emoji}>{defaultContent.emoji}</Text>}
      </View>

      <ThemedText style={styles.title}>{displayTitle}</ThemedText>

      {displayDescription && (
        <ThemedText style={styles.description}>{displayDescription}</ThemedText>
      )}

      {actionLabel && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(48),
  },
  iconContainer: {
    marginBottom: moderateScale(16),
  },
  emoji: {
    fontSize: moderateScale(64),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: moderateScale(8),
  },
  description: {
    fontSize: moderateScale(14),
    color: "#666",
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(24),
  },
  actionButton: {
    backgroundColor: "#000",
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(8),
  },
  actionText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
