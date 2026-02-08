import Button from "@/components/common/button";
import Header from "@/components/common/header";
import ImageUploader from "@/components/common/image-uploader";
import { moderateScale } from "@/newLib/responsive";
import { ClaimStatus } from "@/services/api/types/claim";
import {
  useClaimDetails,
  useDropClaim,
  usePickupClaim,
  useUpdateClaimStatus,
} from "@/services/queries/claims";
import { SPACING } from "@/theme/spacing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ClaimDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: claim, isLoading } = useClaimDetails(id as string);
  const { mutate: pickupClaim, isPending: isPickupPending } = usePickupClaim();
  const { mutate: dropClaim, isPending: isDropPending } = useDropClaim();
  const { mutate: updateClaimStatus, isPending: isUpdatePending } =
    useUpdateClaimStatus();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "" as ClaimStatus,
    checkingRemarks: "",
    balanceThreshold: "",
    officialImgs: {
      fullTyrePicture: "",
      brandName: "",
      seriaNo: "",
      dOT: "",
      pattern: "",
    },
    defectiveImgs: {
      tyreTread: "",
      defectPicture1: "",
      defectPicture2: "",
      innerlinePicture: "",
      treadDept1: "",
      treadDept2: "",
      treadDept3: "",
      treadDept4: "",
    },
    groupedClaimQuantity: [{ otd: "", rtd: "", quantity: "" }],
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (!claim) {
    return (
      <View style={styles.center}>
        <Text>Claim not found</Text>
      </View>
    );
  }

  const handlePickup = () => {
    pickupClaim(id as string, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Claim picked up successfully",
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to pickup claim",
        });
      },
    });
  };

  const handleDrop = () => {
    dropClaim(id as string, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Claim dropped successfully",
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to drop claim",
        });
      },
    });
  };

  const handleUpdate = () => {
    // Filter and convert groupedClaimQuantity entries
    const groupedClaimQuantity = updateForm.groupedClaimQuantity
      .filter((item) => item.otd && item.rtd && item.quantity)
      .map((item) => ({
        otd: Number(item.otd),
        rtd: Number(item.rtd),
        quantity: Number(item.quantity),
      }));

    const payload = {
      status: updateForm.status,
      checkingRemarks: updateForm.checkingRemarks,
      balanceThreshold: Number(updateForm.balanceThreshold),
      salesAgentAttchedOfficialImgs: updateForm.officialImgs,
      salesAgentAttchedDefectiveImgs: updateForm.defectiveImgs,
      groupedClaimQuantity:
        groupedClaimQuantity.length > 0 ? groupedClaimQuantity : undefined,
    };

    updateClaimStatus(
      { id: id as string, data: payload },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Claim updated successfully",
          });
          setIsUpdateModalVisible(false);
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message || "Failed to update claim",
          });
        },
      },
    );
  };

  const handleAddMeasurement = () => {
    setUpdateForm((prev) => ({
      ...prev,
      groupedClaimQuantity: [
        ...prev.groupedClaimQuantity,
        { otd: "", rtd: "", quantity: "" },
      ],
    }));
  };

  const handleRemoveMeasurement = (index: number) => {
    setUpdateForm((prev) => ({
      ...prev,
      groupedClaimQuantity: prev.groupedClaimQuantity.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleUpdateMeasurement = (
    index: number,
    field: "otd" | "rtd" | "quantity",
    value: string,
  ) => {
    setUpdateForm((prev) => ({
      ...prev,
      groupedClaimQuantity: prev.groupedClaimQuantity.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
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

  const getStatusColor = (status: string) => {
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
      case "in-progress":
        return "blue";
      case "rejected":
        return "red";
      default:
        return "black";
    }
  };

  const renderActionButtons = () => {
    const agentStatus = claim.agentStatus;

    if (agentStatus === "new" || !agentStatus) {
      // Assuming 'new' or null means unassigned
      return (
        <Button
          title="Pickup Claim"
          onPress={handlePickup}
          loading={isPickupPending}
          style={styles.actionButton}
        />
      );
    }

    if (agentStatus === "assigned") {
      return (
        <View style={styles.buttonGroup}>
          <Button
            title="Update Status"
            onPress={() => setIsUpdateModalVisible(true)}
            style={styles.actionButton}
          />
          <Button
            title="Drop Claim"
            onPress={handleDrop}
            loading={isDropPending}
            style={[styles.actionButton, styles.dropButton]}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          padding: SPACING.screenPadding,
          paddingBottom: 100,
        }}
      >
        <View style={styles.card}>
          <DetailRow label="Claim ID" value={claim.claimId} />
          <DetailRow
            label="Order ID"
            value={claim.orderDetails?.orderId || "N/A"}
          />
          <DetailRow
            label="Date"
            value={new Date(claim.createdAt).toLocaleDateString()}
          />
          <DetailRow
            label="Customer"
            value={claim.userDetails?.userName || "N/A"}
          />
          <DetailRow label="Reason" value={claim.reason} />
          <DetailRow label="Quantity" value={claim.claimProductQuantity} />
          <DetailRow label="Status" value={claim.status} isStatus />
          {claim.agentStatus && (
            <DetailRow label="Agent Status" value={claim.agentStatus} />
          )}
        </View>

        <View style={{ marginTop: 20 }}>{renderActionButtons()}</View>
      </ScrollView>

      <Modal
        visible={isUpdateModalVisible}
        animationType="slide"
        onRequestClose={() => setIsUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Header
            title="Update Claim"
            showBack={true}
            onBackPress={() => setIsUpdateModalVisible(false)}
          />
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.sectionTitle}>Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Status (e.g. approved, rejected)"
              value={updateForm.status}
              onChangeText={(text) =>
                setUpdateForm({ ...updateForm, status: text as ClaimStatus })
              }
            />

            <Text style={styles.sectionTitle}>Remarks</Text>
            <TextInput
              style={styles.input}
              placeholder="Checking Remarks"
              value={updateForm.checkingRemarks}
              onChangeText={(text) =>
                setUpdateForm({ ...updateForm, checkingRemarks: text })
              }
              multiline
            />

            <Text style={styles.sectionTitle}>Balance Threshold</Text>
            <TextInput
              style={styles.input}
              placeholder="Balance Threshold"
              value={updateForm.balanceThreshold}
              onChangeText={(text) =>
                setUpdateForm({ ...updateForm, balanceThreshold: text })
              }
              keyboardType="numeric"
            />

            <Text style={styles.sectionTitle}>Tread Depth Measurements</Text>
            {updateForm.groupedClaimQuantity.map((measurement, index) => (
              <View key={index} style={styles.measurementCard}>
                <View style={styles.measurementHeader}>
                  <Text style={styles.measurementTitle}>
                    Measurement {index + 1}
                  </Text>
                  {updateForm.groupedClaimQuantity.length > 1 && (
                    <Button
                      title="Remove"
                      onPress={() => handleRemoveMeasurement(index)}
                      style={styles.removeButton}
                    />
                  )}
                </View>
                <View style={styles.measurementRow}>
                  <View style={styles.measurementInput}>
                    <Text style={styles.inputLabel}>OTD (Original)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="120"
                      value={measurement.otd}
                      onChangeText={(text) =>
                        handleUpdateMeasurement(index, "otd", text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.measurementInput}>
                    <Text style={styles.inputLabel}>RTD (Remaining)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="95"
                      value={measurement.rtd}
                      onChangeText={(text) =>
                        handleUpdateMeasurement(index, "rtd", text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.measurementInput}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="25"
                      value={measurement.quantity}
                      onChangeText={(text) =>
                        handleUpdateMeasurement(index, "quantity", text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}
            <Button
              title="+ Add Measurement"
              onPress={handleAddMeasurement}
              style={styles.addButton}
            />

            <Text style={styles.sectionTitle}>Official Images</Text>
            <View style={styles.imageGrid}>
              {Object.keys(updateForm.officialImgs).map((key) => (
                <ImageUploader
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim()} // Format camelCase to Title Case
                  value={(updateForm.officialImgs as any)[key]}
                  onUpload={(url) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      officialImgs: { ...prev.officialImgs, [key]: url },
                    }))
                  }
                  containerStyle={styles.imageUploader}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Defective Images</Text>
            <View style={styles.imageGrid}>
              {Object.keys(updateForm.defectiveImgs).map((key) => (
                <ImageUploader
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  value={(updateForm.defectiveImgs as any)[key]}
                  onUpload={(url) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      defectiveImgs: { ...prev.defectiveImgs, [key]: url },
                    }))
                  }
                  containerStyle={styles.imageUploader}
                />
              ))}
            </View>

            <Button
              title="Submit Update"
              onPress={handleUpdate}
              loading={isUpdatePending}
              style={{ marginTop: 20 }}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ClaimDetails;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
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
  buttonGroup: {
    flexDirection: "column",
    gap: 10,
  },
  actionButton: {
    width: "100%",
  },
  dropButton: {
    backgroundColor: "#FF6B6B", // Reddish for drop
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageUploader: {
    width: "48%",
  },
  measurementCard: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  measurementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  measurementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  measurementRow: {
    flexDirection: "row",
    gap: 8,
  },
  measurementInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 0,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    marginTop: 8,
    marginBottom: 15,
  },
});
