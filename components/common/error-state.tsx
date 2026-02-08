import { moderateScale } from "@/newLib/responsive";
import { ThemedText } from "@/newLib/ThemedText";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ErrorType = "network" | "api" | "timeout" | "unknown";

interface ErrorStateProps {
  error?: Error | null;
  errorType?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  errorType = "unknown",
  title,
  message,
  onRetry,
  retryLabel = "Try Again",
}) => {
  // Get user-friendly error message based on error type
  const getErrorContent = () => {
    if (title && message) {
      return { title, message };
    }

    switch (errorType) {
      case "network":
        return {
          title: "Connection Error",
          message:
            "Unable to connect to the server. Please check your internet connection and try again.",
          emoji: "📡",
        };
      case "api":
        return {
          title: "Something Went Wrong",
          message:
            error?.message ||
            "An error occurred while fetching data. Please try again.",
          emoji: "⚠️",
        };
      case "timeout":
        return {
          title: "Request Timeout",
          message: "The request took too long to complete. Please try again.",
          emoji: "⏱️",
        };
      case "unknown":
      default:
        return {
          title: "Unexpected Error",
          message:
            error?.message || "An unexpected error occurred. Please try again.",
          emoji: "❌",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{errorContent.emoji}</Text>
      </View>

      <ThemedText style={styles.title}>{errorContent.title}</ThemedText>

      <ThemedText style={styles.message}>{errorContent.message}</ThemedText>

      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryLabel}</Text>
        </Pressable>
      )}

      {__DEV__ && error && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Debug: {error.toString()}</Text>
        </View>
      )}
    </View>
  );
};

export default ErrorState;

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
  message: {
    fontSize: moderateScale(14),
    color: "#666",
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(24),
  },
  retryButton: {
    backgroundColor: "#000",
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(8),
    minWidth: moderateScale(140),
    alignItems: "center",
  },
  retryText: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  debugContainer: {
    marginTop: moderateScale(24),
    padding: moderateScale(12),
    backgroundColor: "#f5f5f5",
    borderRadius: moderateScale(8),
    maxWidth: "100%",
  },
  debugText: {
    fontSize: moderateScale(11),
    color: "#666",
    fontFamily: "monospace",
  },
});
