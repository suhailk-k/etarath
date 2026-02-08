import Icon from "@/components/common/icon";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface FilterDropdownProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Approved", value: "approved" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Deleted", value: "deleted" },
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const selectedLabel =
    STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || "All";

  const handleSelect = (value: string) => {
    onSelectStatus(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.trigger}
      >
        <Text style={styles.triggerText}>Filter {selectedLabel}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { color: theme.primary }]}>
                Filter by Status
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Icon name="Back" size={moderateScale(20)} color="primary" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    selectedStatus === option.value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedStatus === option.value && {
                        color: theme.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedStatus === option.value && (
                    <Text style={[styles.checkmark, { color: theme.primary }]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  triggerText: {
    color: "#666",
    fontSize: moderateScale(14),
  },
  arrow: {
    color: "#666",
    fontSize: moderateScale(10),
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    width: "80%",
    maxHeight: "60%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  optionsList: {
    maxHeight: moderateScale(300),
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedOption: {
    backgroundColor: "#F9F9F9",
  },
  optionText: {
    fontSize: moderateScale(14),
    color: "#333",
  },
  checkmark: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
});

export default FilterDropdown;
