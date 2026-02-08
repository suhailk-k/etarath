import { moderateScale } from "@/newLib/responsive";
import { useCustomers } from "@/services/queries/customers";
import { useCreateOrder } from "@/services/queries/orders";
import { useProductList } from "@/services/queries/product";
import { SPACING } from "@/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface CreateOrderSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const CreateOrderSheet = ({ bottomSheetModalRef }: CreateOrderSheetProps) => {
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const { mutate: createOrder, isPending } = useCreateOrder();

  // Form State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    address: "",
    location: "",
  });

  // Search States
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // Queries
  const { data: productsData } = useProductList(productSearch);
  const { data: customersData } = useCustomers(customerSearch);

  const products =
    productsData?.pages.flatMap((page) => page.data.result) || [];
  const customers = customersData?.data?.result || [];

  const handleCreate = () => {
    if (!selectedProduct) return;

    const payload: any = {
      product: [
        {
          productId: selectedProduct._id,
          warehouseId: selectedProduct.availableWarehouses?.[0]?.warehouseId, // Assuming first warehouse for now
          price: selectedProduct.price, // Added price to payload as it was in the postman request
          quantity: quantity,
        },
      ],
      userExist: !isNewCustomer,
    };

    if (isNewCustomer) {
      payload.userDetails = newCustomerDetails;
      // payload.userId might be needed or handled by backend for new users?
      // Based on curl, userId is sent for existing users.
    } else {
      if (selectedCustomer) {
        payload.userId = selectedCustomer._id;
      }
    }

    createOrder(payload, {
      onSuccess: () => {
        bottomSheetModalRef.current?.dismiss();
        // Reset form
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedCustomer(null);
        setIsNewCustomer(false);
        setNewCustomerDetails({
          userName: "",
          phoneNumber: "",
          email: "",
          address: "",
          location: "",
        });
      },
      onError: (error) => {
        console.error("Order creation failed", error);
        alert("Failed to create order");
      },
    });
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create an Order</Text>
          <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()}>
            <Ionicons name="close" size={24} color="black" />
          </Pressable>
        </View>

        {/* Product Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Product</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={products.map((p) => ({
              label: p.productDetails.productName,
              value: p._id,
            }))}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Select Product"
            searchPlaceholder="Search..."
            value={selectedProduct?._id}
            onChange={(item) => {
              const prod = products.find((p) => p._id === item.value);
              setSelectedProduct(prod);
            }}
            onChangeText={setProductSearch}
          />
        </View>

        {selectedProduct && (
          <View style={styles.productCard}>
            {/* Image would go here */}
            <View>
              <Text style={styles.productName}>
                {selectedProduct.productDetails.productName}
              </Text>
              <Text style={styles.productDetails}>
                {selectedProduct.productDetails.category}
              </Text>
            </View>
            <View style={styles.quantityContainer}>
              <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Ionicons name="remove-circle" size={24} color="black" />
              </Pressable>
              <Text style={styles.quantityText}>
                {quantity.toString().padStart(2, "0")}
              </Text>
              <Pressable onPress={() => setQuantity((q) => q + 1)}>
                <Ionicons name="add-circle" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Customer Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Customer</Text>
          {!isNewCustomer && (
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={customers.map((c) => ({ label: c.name, value: c._id }))}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Customer"
              searchPlaceholder="Search..."
              value={selectedCustomer?._id}
              onChange={(item) => {
                const cust = customers.find((c) => c._id === item.value);
                setSelectedCustomer(cust);
              }}
              onChangeText={setCustomerSearch}
            />
          )}
        </View>

        <Pressable
          style={styles.checkboxContainer}
          onPress={() => setIsNewCustomer(!isNewCustomer)}
        >
          <Ionicons
            name={isNewCustomer ? "checkbox" : "square-outline"}
            size={20}
            color="black"
          />
          <Text style={styles.checkboxLabel}>
            Customer doesn't exist in etarath
          </Text>
        </Pressable>

        {isNewCustomer && (
          <View style={styles.formContainer}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Customer Name"
              placeholderTextColor={"gray"}
              value={newCustomerDetails.userName}
              onChangeText={(t) =>
                setNewCustomerDetails({ ...newCustomerDetails, userName: t })
              }
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholderTextColor={"gray"}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={newCustomerDetails.phoneNumber}
              onChangeText={(t) =>
                setNewCustomerDetails({ ...newCustomerDetails, phoneNumber: t })
              }
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholderTextColor={"gray"}
              placeholder="Email (Optional)"
              keyboardType="email-address"
              value={newCustomerDetails.email}
              onChangeText={(t) =>
                setNewCustomerDetails({ ...newCustomerDetails, email: t })
              }
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholderTextColor={"gray"}
              placeholder="Address"
              value={newCustomerDetails.address}
              onChangeText={(t) =>
                setNewCustomerDetails({ ...newCustomerDetails, address: t })
              }
            />
            <BottomSheetTextInput
              style={styles.input}
              placeholderTextColor={"gray"}
              placeholder="Location"
              value={newCustomerDetails.location}
              onChangeText={(t) =>
                setNewCustomerDetails({ ...newCustomerDetails, location: t })
              }
            />
          </View>
        )}

        <Pressable
          style={styles.createButton}
          onPress={handleCreate}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
          )}
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SPACING.screenPadding,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.gap,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  section: {
    marginBottom: SPACING.gap,
  },
  label: {
    marginBottom: moderateScale(8),
    fontWeight: "600",
  },
  dropdown: {
    height: moderateScale(50),
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    backgroundColor: "#F9F9F9",
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: moderateScale(14),
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: SPACING.gap,
    borderRadius: moderateScale(8),
    marginBottom: SPACING.gap,
  },
  productName: {
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  productDetails: {
    fontSize: moderateScale(12),
    color: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  quantityText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    width: moderateScale(24),
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.gap,
    gap: moderateScale(8),
  },
  checkboxLabel: {
    fontSize: moderateScale(14),
  },
  formContainer: {
    gap: moderateScale(12),
    marginBottom: SPACING.gap,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(50),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(20),
    backgroundColor: "#F5F5F5",
  },
  createButton: {
    backgroundColor: "black",
    padding: moderateScale(16),
    borderRadius: moderateScale(50),
    alignItems: "center",
    marginTop: "auto",
    marginBottom: SPACING.screenBottom,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
});

export default CreateOrderSheet;
