import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { ClaimItem } from "@/services/api/types/target";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HistoryCardProps {
  item: ClaimItem;
  type: "order" | "claim";
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, type }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "#FF8A00";
      case "in-progress":
        return "#2196F3";
      case "completed":
      case "approved":
      case "verified":
        return "#00B96F";
      case "cancelled":
      case "rejected":
      case "deleted":
        return "#FF0F0F";
      default:
        return "#888";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // For orders: data is directly on item (orderId, orderDate)
  // For claims: data is on item for claim info (claimId, requestedDate) and orderDetails for order info
  const displayId = type === "claim" ? item.claimId : (item as any).orderId;
  const displayDate =
    type === "claim" ? item.requestedDate : (item as any).orderDate;

  return (
    <View style={styles.card}>
      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      {/* Order/Claim ID */}
      <Text style={[styles.idText, { color: theme.primary }]}>
        {type === "claim" ? "Claim" : "Order"} ID: {displayId}
      </Text>

      {/* Product Info - Placeholder, adjust based on actual data */}
      <Text style={[styles.productText, { color: theme.primary }]}>
        {item.kycDetails?.shop_name || "N/A"}
      </Text>

      {/* Location */}
      <Text style={styles.locationText}>
        {item.kycDetails?.shop_location || "N/A"}
      </Text>

      {/* Bottom Row: Customer Type and Date */}
      <View style={styles.bottomRow}>
        <View style={styles.bottomItem}>
          <Text style={styles.label}>Customer</Text>
          <Text style={[styles.value, { color: theme.primary }]}>
            {item.kycDetails?.business_type || "N/A"}
          </Text>
        </View>
        <View style={styles.bottomItem}>
          <Text style={styles.label}>Date</Text>
          <Text style={[styles.value, { color: theme.primary }]}>
            {formatDate(displayDate)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(12),
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  idText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginBottom: moderateScale(8),
  },
  productText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: moderateScale(16),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomItem: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(12),
    color: "#888",
    marginBottom: moderateScale(4),
  },
  value: {
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});

export default HistoryCard;
