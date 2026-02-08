import { moderateScale } from "@/newLib/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HistoryLoadingSkeletonProps {
  count?: number;
}

const HistoryLoadingSkeleton: React.FC<HistoryLoadingSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Status Badge Skeleton */}
          <View style={[styles.skeleton, styles.badge]} />

          {/* ID Skeleton */}
          <View style={[styles.skeleton, styles.id]} />

          {/* Title Skeleton */}
          <View style={[styles.skeleton, styles.title]} />

          {/* Location Skeleton */}
          <View style={[styles.skeleton, styles.location]} />

          {/* Bottom Row Skeleton */}
          <View style={styles.bottomRow}>
            <View style={[styles.skeleton, styles.bottomItem]} />
            <View style={[styles.skeleton, styles.bottomItem]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(12),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  skeleton: {
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(4),
  },
  badge: {
    width: moderateScale(80),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  id: {
    width: "60%",
    height: moderateScale(14),
    marginBottom: moderateScale(8),
  },
  title: {
    width: "80%",
    height: moderateScale(16),
    marginBottom: moderateScale(4),
  },
  location: {
    width: "50%",
    height: moderateScale(14),
    marginBottom: moderateScale(16),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(16),
  },
  bottomItem: {
    flex: 1,
    height: moderateScale(14),
  },
});

export default HistoryLoadingSkeleton;
