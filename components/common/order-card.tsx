import { Device } from "@/newLib/device";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { ThemedText } from "@/newLib/ThemedText";
import { ThemedView } from "@/newLib/ThemedView";
import { ClaimStatus } from "@/services/api/types/claim";
import { OrderStatus } from "@/services/api/types/order";
import { SPACING } from "@/theme/spacing";
import React from "react";
import { StyleSheet, View } from "react-native";

const OrderCard = (props: {
  status?: OrderStatus|ClaimStatus
  type?: "horizontal" | "vertical";
    name?: string;
    date?: string;
    place?: string;
    address?: string;
    id?: string;
    label?: string;
}) => {
  const { status, type,
    name,
    date,
    place,
    address,
    id,
    label ='Order ID'
   } = props;
  const { theme } = useTheme();

  const statusColor = () => {
    switch (status) {
      case "pending":
        return "highlightSecondary";
      case "in-progress":
        return "highlightSecondary";
      case "delivered":
        return "highlightPrimary";
      case "cancelled":
        return "highlightSecondary";
      case "verified":
        return "highlightSecondary";
      case "approved":
        return "highlightSecondary";
      case "rejected":
        return "highlightSecondary";
      case "completed":
        return "highlightSecondary";
      default:
        return "highlightSecondary";
    }
  };
  const statusText = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "verified":
        return "Verified";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  return (
    <View
      style={{
        borderWidth: moderateScale(1),
        borderColor: theme.primary,
        borderRadius: moderateScale(10),
        padding: SPACING.screenPadding,
        gap: moderateScale(10),
        width: type === "horizontal" ? Device.width * 0.8 : "100%",
      }}
    >
      <ThemedView
        style={{
          height: moderateScale(25),
          width: moderateScale(100),
          alignItems: "center",
          justifyContent: "center",
          borderRadius: moderateScale(12.5),
        }}
        backgroundColor={statusColor()}
      >
        <ThemedText color={"background"} variant="smallButtonText">
          {statusText()}
        </ThemedText>
      </ThemedView>
      <ThemedText variant="text14M">{label}: {id || '1733293438730'}</ThemedText>
      <ThemedText variant="text16B">{
address}</ThemedText>
      <ThemedText variant="text16R">{place}</ThemedText>

      <View
        style={{
          flexDirection: "row",
        height: moderateScale(40),

        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText variant="text14M" style={{ flex: 1 }}>
            Customer
          </ThemedText>
          <ThemedText variant="text15B" style={{ flex: 1 }}>
{name}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText variant="text14M" style={{ flex: 1 }}>
            Date
          </ThemedText>
          <ThemedText variant="text15B" style={{ flex: 1 }}>
      {date}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({});
