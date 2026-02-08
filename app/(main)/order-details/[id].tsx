import { moderateScale } from "@/newLib/responsive";
import { OrderStatus } from "@/services/api/types/order";
import {
  useOrderDetails,
  useSelfAssignOrder,
  useSelfDropOrder,
  useUpdateOrderStatus,
} from "@/services/queries/orders";
import { SPACING } from "@/theme/spacing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: order, isLoading } = useOrderDetails(id as string);

  const { mutate: selfAssign, isPending: isAssigning } = useSelfAssignOrder();
  const { mutate: selfDrop, isPending: isDropping } = useSelfDropOrder();
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrderStatus();

  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (order) {
      setPrice(order.price ? order.price.toString() : "");
      setDiscount(order.discount ? order.discount.toString() : "");
      setNote(order.note || ""); // Assuming 'note' field exists or we just keep it empty if not in type yet
    }
  }, [order]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (!order) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text>Order not found</Text>
      </View>
    );
  }

  const handlePickup = () => {
    Alert.alert(
      "Confirm Pickup",
      "Are you sure you want to pick up this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pickup",
          onPress: () => {
            selfAssign(order._id, {
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Order picked up successfully",
                });
              },
              onError: (error: any) => {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2:
                    error.response?.data?.message || "Failed to pickup order",
                });
              },
            });
          },
        },
      ],
    );
  };

  const handleDrop = () => {
    Alert.alert("Confirm Drop", "Are you sure you want to drop this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Drop",
        style: "destructive",
        onPress: () => {
          selfDrop(order._id, {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Order dropped successfully",
              });
            },
            onError: (error: any) => {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.message || "Failed to drop order",
              });
            },
          });
        },
      },
    ]);
  };

  const handleUpdate = () => {
    updateOrder(
      {
        id: order._id,
        data: {
          status: order.status, // Keeping existing status or should we allow changing it? User request didn't specify changing status in API payload example, but payload has "status": "". Assuming we might need a status picker or just send current/empty. Request payload had "status": "".
          price: Number(price),
          paymentMethod: order.paymentMethod || "", // API payload has paymentMethod
          discount: Number(discount),
          note: note,
        },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Order details updated",
          });
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data?.message || "Failed to update order",
          });
        },
      },
    );
  };

  const DetailRow = ({
    label,
    value,
    isStatus = false,
  }: {
    label: string;
    value: string | number;
    isStatus?: boolean;
  }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text
        style={[
          styles.value,
          isStatus && { color: getStatusColor(value as string) },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  const getStatusColor = (status: OrderStatus) => {
    if (!status) return "black";
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      case "approved":
        return "blue";
      default:
        return "black";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          padding: SPACING.screenPadding,
          paddingBottom: 50,
        }}
      >
        <View style={[styles.card, { marginBottom: 20 }]}>
          <DetailRow label="Order ID" value={order.orderId} />
          <DetailRow
            label="Date"
            value={new Date(order.orderDate).toLocaleDateString()}
          />
          <DetailRow
            label="Customer"
            value={order.userDetails?.userName || "N/A"}
          />
          <DetailRow
            label="Address"
            value={order.kycDetails?.location || "N/A"}
          />
          <DetailRow
            label="Product"
            value={order.productDetails?.productName || "N/A"}
          />
          <DetailRow
            label="Warehouse"
            value={order.warehouseDetails?.shop_name || "N/A"}
          />
          <DetailRow label="Quantity" value={order.quantity} />
          <DetailRow label="Sale Price" value={`${order.price} AED`} />
          <DetailRow label="Total Payable" value={`${order.totalPrice} AED`} />
          <DetailRow
            label="Payment Method"
            value={
              order.paymentStatus === "unpaid"
                ? "Cash/Card on Delivery"
                : "Paid"
            }
          />
          <DetailRow label="Status" value={order.status} isStatus />
          <DetailRow label="Agent Status" value={order.agentStatus || "N/A"} />
        </View>

        {order.agentStatus === "new" && (
          <TouchableOpacity
            style={[styles.button, styles.pickupButton]}
            onPress={handlePickup}
            disabled={isAssigning}
          >
            {isAssigning ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Pick Up Order</Text>
            )}
          </TouchableOpacity>
        )}

        {(order.agentStatus === "assigned" ||
          order.agentStatus === "dupdated") && (
          <View style={styles.actionContainer}>
            <Text style={styles.sectionTitle}>Update Order Details</Text>

            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter Price"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Discount</Text>
            <TextInput
              style={styles.input}
              value={discount}
              onChangeText={setDiscount}
              placeholder="Enter Discount"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Note</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              multiline
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Update Details</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.dropButton,
                  (isDropping || order.agentStatus === "dupdated") && {
                    opacity: 0.5,
                  },
                ]}
                onPress={handleDrop}
                disabled={isDropping || order.agentStatus === "dupdated"}
              >
                {isDropping ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Drop Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    gap: moderateScale(15),
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: moderateScale(5),
  },
  label: {
    fontSize: moderateScale(14),
    color: "#666",
    minWidth: moderateScale(100),
  },
  value: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  actionContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    gap: moderateScale(10),
    backgroundColor: "#F9F9F9",
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: moderateScale(10),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: "#333",
    marginBottom: moderateScale(2),
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    backgroundColor: "white",
    fontSize: moderateScale(14),
  },
  button: {
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(5),
  },
  pickupButton: {
    backgroundColor: "#4CAF50",
  },
  updateButton: {
    backgroundColor: "#2196F3",
    flex: 1,
  },
  dropButton: {
    backgroundColor: "#F44336",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  buttonGroup: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginTop: moderateScale(10),
  },
});
