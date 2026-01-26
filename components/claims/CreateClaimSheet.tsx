import { moderateScale } from '@/newLib/responsive';
import { useCreateClaim } from '@/services/queries/claims';
import { useCustomers } from '@/services/queries/customers';
import { useOrders } from '@/services/queries/orders';
import { useProductList } from '@/services/queries/product';
import { SPACING } from '@/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';


interface CreateClaimSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}



const CreateClaimSheet = ({ bottomSheetModalRef }: CreateClaimSheetProps) => {
  const snapPoints = useMemo(() => ['85%', '95%'], []);
  const { mutate: createClaim, isPending } = useCreateClaim();
  
  // Search States
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Form State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [orderQuantity, setOrderQuantity] = useState(1);
  
  const [orderDate, setOrderDate] = useState(new Date());
  const [openOrderDate, setOpenOrderDate] = useState(false);
  
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [openDeliveryDate, setOpenDeliveryDate] = useState(false);

  const [note, setNote] = useState('');
  
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    address: ''
  });


  // Queries
  const { data: productsData } = useProductList(productSearch);
  const { data: customersData } = useCustomers(customerSearch);
  const { data: ordersData } = useOrders(orderSearch);

  const products = productsData?.pages.flatMap(page => page.data.result) || [];
  const customers = customersData?.data || [];
  const orders = ordersData?.pages.flatMap(page => page.data.result) || [];

  const handleCreate = () => {
    if (!selectedProduct || !selectedOrder) {
        alert("Please select Order and Product");
        return;
    }
    
    // Construct payload strictly matching the Curl request format
    const payload: any = {
      userExist: !isNewCustomer,
      orderExist: true,
      claimProductQuantity: claimQuantity,
      orderId: selectedOrder._id, // Assuming _id is the orderId
      orderDetails: {
        stockId: selectedProduct._id, // Mapping Product ID to Stock ID
        quantity: orderQuantity,
        orderDate: orderDate.toISOString().split('T')[0],
        deliveryDate: deliveryDate.toISOString().split('T')[0],
        note: note
      }
    };

    if (isNewCustomer) {
      payload.userDetails = newCustomerDetails;
      payload.userId = "64f1a2c9b7e4a12d3c9e4567"; // Dummy ID if needed or backend handles
      // Note: In the curl example for userExist: true, userId is sent.
      // For new user, we send userDetails. 
    } else {
      if (selectedCustomer) {
        payload.userId = selectedCustomer._id;
        payload.userDetails = { // Curl example sends userDetails even when userExist is true? 
          // "userDetails": { "userName": "Rahul Sharma", ... } in the curl example when userExist is true.
          // Wait, the curl example has userExist: true, userId: "...", AND userDetails is populated!
          // So I should populate userDetails from selectedCustomer?
           userName: selectedCustomer.userName,
           phoneNumber: selectedCustomer.phoneNumber,
           email: selectedCustomer.email,
           address: selectedCustomer.address || "" // address might define in customer object
        };
      }
    }

    createClaim(payload, {
      onSuccess: () => {
        bottomSheetModalRef.current?.dismiss();
        // Reset form
        setSelectedProduct(null);
        setSelectedOrder(null);
        setSelectedCustomer(null);
        setClaimQuantity(1);
        setOrderQuantity(1);
        setOrderDate(new Date());
        setDeliveryDate(new Date());
        setNote('');
        setIsNewCustomer(false);
        setNewCustomerDetails({ userName: '', phoneNumber: '', email: '', address: '' });
      },
      onError: (error) => {
        console.error("Claim creation failed", error);
        alert("Failed to create claim"); 
      }
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
    []
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
            <Text style={styles.title}>Create Warranty Claim</Text>
            <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()}>
                <Ionicons name="close" size={24} color="black" />
            </Pressable>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        
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
                    data={customers.map(c => ({ label: c.userName, value: c._id }))}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Customer"
                    searchPlaceholder="Search..."
                    value={selectedCustomer?._id}
                    onChange={item => {
                        const cust = customers.find(c => c._id === item.value);
                        setSelectedCustomer(cust);
                    }}
                    onChangeText={setCustomerSearch}
                />
            )}
        </View>

        <Pressable style={styles.checkboxContainer} onPress={() => setIsNewCustomer(!isNewCustomer)}>
            <Ionicons name={isNewCustomer ? "checkbox" : "square-outline"} size={20} color="black" />
            <Text style={styles.checkboxLabel}>Customer doesn't exist in etarath</Text>
        </Pressable>

        {isNewCustomer && (
            <View style={styles.formContainer}>
                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    value={newCustomerDetails.userName}
                    onChangeText={(t) => setNewCustomerDetails({...newCustomerDetails, userName: t})}
                />
                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    keyboardType="phone-pad"
                    value={newCustomerDetails.phoneNumber}
                    onChangeText={(t) => setNewCustomerDetails({...newCustomerDetails, phoneNumber: t})}
                />
                <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Email (Optional)"
                    keyboardType="email-address"
                    value={newCustomerDetails.email}
                    onChangeText={(t) => setNewCustomerDetails({...newCustomerDetails, email: t})}
                />
                 <BottomSheetTextInput
                    style={styles.input}
                    placeholder="Address"
                    value={newCustomerDetails.address}
                    onChangeText={(t) => setNewCustomerDetails({...newCustomerDetails, address: t})}
                />
            </View>
        )}

        {/* Order Selection */}
        <View style={styles.section}>
            <Text style={styles.label}>Select Order</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={orders.map(o => ({ label: o.orderId, value: o._id }))} // Assuming orders have orderId field
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Select Order"
                searchPlaceholder="Search..."
                value={selectedOrder?._id}
                onChange={item => {
                    const ord = orders.find(o => o._id === item.value);
                    setSelectedOrder(ord);
                }}
                onChangeText={setOrderSearch}
            />
        </View>

        {/* Product Selection */}
        <View style={styles.section}>
            <Text style={styles.label}>Select Product (Stock)</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={products.map(p => ({ label: p.productDetails.productName, value: p._id }))}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Product"
                searchPlaceholder="Search..."
                value={selectedProduct?._id}
                onChange={item => {
                    const prod = products.find(p => p._id === item.value);
                    setSelectedProduct(prod);
                }}
                onChangeText={setProductSearch}
            />
        </View>

        {selectedProduct && (
             <View style={styles.section}>
                <Text style={styles.label}>Quantities</Text>
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                         <Text style={styles.subLabel}>Claim Qty</Text>
                         <View style={styles.quantityContainer}>
                            <Pressable onPress={() => setClaimQuantity(q => Math.max(1, q - 1))}>
                                <Ionicons name="remove-circle" size={24} color="black" />
                            </Pressable>
                            <Text style={styles.quantityText}>{claimQuantity.toString().padStart(2, '0')}</Text>
                            <Pressable onPress={() => setClaimQuantity(q => q + 1)}>
                                <Ionicons name="add-circle" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.halfInput}>
                         <Text style={styles.subLabel}>Order Qty</Text>
                         <View style={styles.quantityContainer}>
                            <Pressable onPress={() => setOrderQuantity(q => Math.max(1, q - 1))}>
                                <Ionicons name="remove-circle" size={24} color="black" />
                            </Pressable>
                            <Text style={styles.quantityText}>{orderQuantity.toString().padStart(2, '0')}</Text>
                            <Pressable onPress={() => setOrderQuantity(q => q + 1)}>
                                <Ionicons name="add-circle" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        )}

        <View style={styles.section}>
             <Text style={styles.label}>Details</Text>
             <View style={styles.row}>
                 
                 <Pressable style={[styles.input, styles.halfInput, styles.dateInput]} onPress={() => setOpenOrderDate(true)}>
                    <Text style={styles.dateText}>{orderDate.toISOString().split('T')[0]}</Text>
                 </Pressable>
                 <DatePicker
                    modal
                    open={openOrderDate}
                    date={orderDate}
                    mode="date"
                    onConfirm={(date: Date) => {
                      setOpenOrderDate(false)
                      setOrderDate(date)
                    }}
                    onCancel={() => {
                      setOpenOrderDate(false)
                    }}
                  />

                 <Pressable style={[styles.input, styles.halfInput, styles.dateInput]} onPress={() => setOpenDeliveryDate(true)}>
                    <Text style={styles.dateText}>{deliveryDate.toISOString().split('T')[0]}</Text>
                 </Pressable>
                  <DatePicker
                    modal
                    open={openDeliveryDate}
                    date={deliveryDate}
                    mode="date"
                    onConfirm={(date: Date) => {
                      setOpenDeliveryDate(false)
                      setDeliveryDate(date)
                    }}
                    onCancel={() => {
                      setOpenDeliveryDate(false)
                    }}
                  />
             </View>
             <BottomSheetTextInput
                style={[styles.input, { marginTop: moderateScale(10) }]}
                placeholder="Note"
                value={note}
                onChangeText={setNote}
             />
        </View>

        <Pressable style={styles.createButton} onPress={handleCreate} disabled={isPending}>
            {isPending ? <ActivityIndicator color="white" /> : <Text style={styles.createButtonText}>Create Claim</Text>}
        </Pressable>
        
        </BottomSheetScrollView>

      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SPACING.screenPadding,
  },
  scrollContent: {
    paddingBottom: moderateScale(50),
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.gap,
  },
  title: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
  },
  section: {
      marginBottom: SPACING.gap,
  },
  label: {
      marginBottom: moderateScale(8),
      fontWeight: '600',
  },
  subLabel: {
      fontSize: moderateScale(12),
      marginBottom: moderateScale(4),
      color: 'gray'
  },
  dropdown: {
      height: moderateScale(50),
      borderColor: '#E0E0E0',
      borderWidth: 1,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(8),
      backgroundColor: '#F9F9F9',
  },
  placeholderStyle: {
      fontSize: moderateScale(14),
      color: 'gray',
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
  checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
      borderColor: '#E0E0E0',
      borderRadius: moderateScale(50),
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(20),
      backgroundColor: '#F5F5F5',
  },
  row: {
      flexDirection: 'row',
      gap: moderateScale(12),
  },
  halfInput: {
      flex: 1,
  },
  quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: moderateScale(50),
      padding: moderateScale(8),
      backgroundColor: '#F9F9F9',
      justifyContent: 'center',
  },
  quantityText: {
      fontSize: moderateScale(14),
      fontWeight: '600',
      width: moderateScale(24),
      textAlign: 'center',
  },
  createButton: {
      backgroundColor: 'black',
      padding: moderateScale(16),
      borderRadius: moderateScale(50),
      alignItems: 'center',
      marginTop: moderateScale(20),
      marginBottom: SPACING.screenBottom,
  },
  createButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: moderateScale(16),
  },
  dateInput: {
      justifyContent: 'center',
  },
  dateText: {
      fontSize: moderateScale(14),
      color: 'black',
  }
});

export default CreateClaimSheet;
