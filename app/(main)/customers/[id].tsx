import OrderCard from "@/components/common/order-card";
import CustomerDetailsSkeleton from "@/components/customers/customer-details-skeleton";
import { ThemedText } from "@/newLib/ThemedText";
import { useTheme } from "@/newLib/theme";
import { useCustomerDetails } from "@/services/queries/customers";
import { useOrders } from "@/services/queries/orders";
import { SPACING } from "@/theme/spacing";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomerOrders = ({ customerName }: { customerName: string }) => {
  const { data: ordersData, isLoading } = useOrders(customerName);
  const orders = ordersData?.pages.flatMap(page => page.data.result) || [];

  if (isLoading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View style={styles.ordersContainer}>
      {orders.map((order: any) => (
        <OrderCard
          key={order._id}
          status={order.status}
          id={order.orderId}
          address={order.productDetails?.productName || "Product"}
          place={order.kycDetails?.location || ""}
          name={order.userDetails?.userName || "Customer"}
          date={new Date(order.orderDate).toLocaleDateString()}
          type="vertical"
        />
      ))}
    </View>
  );
};

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("jkjkkk",id);
  
  // @ts-ignore
  const { data: customerData, isLoading } = useCustomerDetails(id);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Data extraction
  const singleCustomerData = customerData?.data; // This is SingleCustomerDetails
  const details = singleCustomerData?.customerDetails; // This is the inner CustomerDetails object (which includes kycDetails inside it for details API)
  // For List API, kycDetails is outside. For Details API (based on user JSON), it seems to be INSIDE customerDetails?
  // User JSON Step 164: "customerDetails": { ... "kycDetails": { ... } }
  // So:
  const kyc = details?.kycDetails; 
  // Note: If type definitions are strict, typescript might complain if CustomerDetails interface doesn't have kycDetails.
  // We might need to cast or update types. For now, accessing it dynamically.

  if (isLoading ) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <CustomerDetailsSkeleton />
      </View>
    );
  }

  const infoSection = [
    { label: "Member since", value: new Date(details.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: "calendar-today" },
    { label: "Location", value: details.location || kyc?.location || "N/A", icon: "location-on" },
    { label: "Business hours", value: kyc?.business_hours || "N/A", icon: "access-time" },
    { label: "Payment method", value: "Online Payment", icon: "credit-card" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{ uri: "https://via.placeholder.com/400x200" }} // Placeholder
            style={styles.bannerImage}
          >
             {/* <Pressable style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
               <MaterialIcons name="arrow-back" size={24} color="black" />
             </Pressable> */}
          </ImageBackground>

          <View style={[styles.profileSection, { backgroundColor: theme.background }]}>
             <View style={styles.logoContainer}>
                {/* Logo in Red Circle as per design */}
                <View style={styles.redLogoCircle}>
                   <Image source={{ uri: kyc?.vendor_logo || details.imgUrl || "https://via.placeholder.com/80" }} style={styles.logo} resizeMode="contain" /> 
                </View>
             </View>
             <ThemedText variant="text16B" style={{textAlign: 'center', marginTop: 8}}>{details.userName}</ThemedText>
             <ThemedText variant="text14M" style={{textAlign: 'center', color: '#666'}}>{kyc?.business_name || "Tire Trading"}</ThemedText>

             <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                   <View style={styles.statIconCircle}>
                     <MaterialIcons name="shopping-cart" size={20} color="#000" />
                   </View>
                   <View>
                     <ThemedText variant="text12M" style={{color: '#666'}}>Total Orders</ThemedText>
                     <ThemedText variant="text16B">{customerData?.data?.orderCounts || 0}</ThemedText>
                   </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                   <View style={styles.statIconCircle}>
                     <MaterialIcons name="flag" size={20} color="#000" />
                   </View>
                   <View>
                     <ThemedText variant="text12M" style={{color: '#666'}}>Total Claims</ThemedText>
                     <ThemedText variant="text16B">{customerData?.data?.claimCounts || 0}</ThemedText>
                   </View>
                </View>
             </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.background, borderColor: theme.backgroundSecondary }]}>
          {infoSection.map((item, index) => (
            <View key={index}>
              <View style={styles.infoRow}>
                <MaterialIcons name={item.icon as any} size={20} color="#666" style={{ marginRight: 10 }} />
                <ThemedText variant="text14M" style={{ flex: 1, color: '#666' }}>{item.label}</ThemedText>
                <ThemedText variant="text16B">{item.value}</ThemedText>
              </View>
              {index < infoSection.length - 1 && <View style={[styles.separator, { backgroundColor: theme.backgroundSecondary }]} />}
            </View>
          ))}
        </View>

        {/* Contact Button */}
        <Pressable 
            style={[styles.contactButton, { backgroundColor: '#000' }]}
            onPress={() => Linking.openURL(`tel:${details.phoneNumber}`)}
        >
           <ThemedText style={{ color: '#fff' }} variant="text16B">Contact</ThemedText>
        </Pressable>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 60, 
  },
  bannerImage: {
    height: 150,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  profileSection: {
    position: 'absolute',
    top: 100,
    left: SPACING.screenPadding,
    right: SPACING.screenPadding,
    borderTopLeftRadius: 20, // Only round top corners if banner is behind, or full radius if floating
    borderTopRightRadius: 20,
    // borderRadius: 20, 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    position: 'absolute',
    top: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  infoCard: {
    marginHorizontal: SPACING.screenPadding,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  contactButton: {
    marginHorizontal: SPACING.screenPadding,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ordersContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 10,
  }
});
