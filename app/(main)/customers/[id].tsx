import CustomerDetailsSkeleton from "@/components/customers/customer-details-skeleton";
import FilterDropdown from "@/components/performance/FilterDropdown";
import HistoryCard from "@/components/performance/HistoryCard";
import HistoryEmptyState from "@/components/performance/HistoryEmptyState";
import HistoryLoadingSkeleton from "@/components/performance/HistoryLoadingSkeleton";
import { ThemedText } from "@/newLib/ThemedText";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { getCustomerOrderClaimHistory } from "@/services/api/customers";
import { OrdersClaimHistoryData } from "@/services/api/types/target";
import { useCustomerDetails } from "@/services/queries/customers";
import { SPACING } from "@/theme/spacing";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: customerData,
    isLoading,
    isError,
    error,
  } = useCustomerDetails(id);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"order" | "claim">("order");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historyData, setHistoryData] = useState<OrdersClaimHistoryData | null>(
    null,
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Data extraction
  const singleCustomerData = customerData?.data;
  const details = singleCustomerData?.customerDetails;

  useEffect(() => {
    if (id) {
      fetchHistory(id, activeTab, statusFilter, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeTab, statusFilter]);

  const fetchHistory = async (
    customerId: string,
    type: "order" | "claim",
    status: string,
    page: number,
  ) => {
    try {
      setHistoryLoading(true);
      const response = await getCustomerOrderClaimHistory(
        customerId,
        page,
        10,
        type,
        status,
      );
      if (response.status === 200) {
        if (page === 1) {
          setHistoryData(response.data);
        } else {
          // Append for pagination
          setHistoryData((prev) => ({
            ...response.data,
            result: [...(prev?.result || []), ...response.data.result],
          }));
        }
        setCurrentPage(page);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Failed to fetch history",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to fetch history",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <CustomerDetailsSkeleton />
      </View>
    );
  }

  if (isError || !details) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          },
        ]}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="black" />
        </Pressable>
        <ThemedText variant="text16B" style={{ marginBottom: 10 }}>
          Failed to load customer details
        </ThemedText>
        <ThemedText
          variant="text14M"
          style={{ color: "#666", textAlign: "center" }}
        >
          {isError ? error?.message || "API Error" : "No customer data found"}
        </ThemedText>
        <ThemedText
          variant="text12M"
          style={{ color: "#999", textAlign: "center", marginTop: 10 }}
        >
          ID: {id}
        </ThemedText>
      </View>
    );
  }

  const infoSection = [
    {
      label: "Member since",
      value: details.since
        ? new Date(details.since).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "N/A",
      icon: "calendar-today",
    },
    {
      label: "Location",
      value: details.location || "N/A",
      icon: "location-on",
    },
    {
      label: "Business hours",
      value: details.bussines_hours || "N/A",
      icon: "access-time",
    },
    {
      label: "Payment method",
      value: details.payment_method || "N/A",
      icon: "credit-card",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Back Button */}
          <Pressable
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color="black" />
          </Pressable>

          <ImageBackground
            source={{
              uri:
                details.shop_photo ||
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          <View
            style={[
              styles.profileSection,
              { backgroundColor: theme.background },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.redLogoCircle}>
                <Image
                  source={{
                    uri:
                      details.logo ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/78/Q_mark_red.png",
                  }}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>
            </View>
            <ThemedText
              variant="text16B"
              style={{ textAlign: "center", marginTop: 8 }}
            >
              {details.name}
            </ThemedText>
            <ThemedText
              variant="text12M"
              style={{ textAlign: "center", color: "#666" }}
            >
              {details.location || "Location"}
            </ThemedText>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconCircle}>
                  <MaterialIcons name="shopping-cart" size={20} color="#000" />
                </View>
                <View style={{ gap: 2 }}>
                  <ThemedText
                    variant="text12M"
                    style={{ color: "#666", lineHeight: 12 }}
                  >
                    Total Orders
                  </ThemedText>
                  <ThemedText variant="text16B" style={{ lineHeight: 20 }}>
                    {customerData?.data?.orderCounts || 0}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <View style={styles.statIconCircle}>
                  <MaterialIcons name="flag" size={20} color="#000" />
                </View>
                <View style={{ gap: 2 }}>
                  <ThemedText
                    variant="text12M"
                    style={{ color: "#666", lineHeight: 12 }}
                  >
                    Total Claims
                  </ThemedText>
                  <ThemedText variant="text16B" style={{ lineHeight: 20 }}>
                    {customerData?.data?.claimCounts || 0}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.background, borderColor: "#E0E0E0" },
          ]}
        >
          {infoSection.map((item, index) => (
            <View key={index}>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name={item.icon as any}
                  size={18}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <ThemedText
                  variant="text14M"
                  style={{ flex: 1, color: "#666" }}
                >
                  {item.label}
                </ThemedText>
                <ThemedText variant="text14M" style={{ fontWeight: "500" }}>
                  {item.value}
                </ThemedText>
              </View>
              {index < infoSection.length - 1 && (
                <View
                  style={[styles.separator, { backgroundColor: "#E0E0E0" }]}
                />
              )}
            </View>
          ))}
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <ThemedText variant="text16B" style={{ marginBottom: 16 }}>
            History
          </ThemedText>

          <View style={styles.controlsRow}>
            <View style={styles.tabsContainer}>
              <Pressable
                style={[styles.tab, activeTab === "order" && styles.activeTab]}
                onPress={() => setActiveTab("order")}
              >
                <ThemedText
                  variant="text14M"
                  style={{ color: activeTab === "order" ? "#fff" : "#000" }}
                >
                  Orders
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.tab, activeTab === "claim" && styles.activeTab]}
                onPress={() => setActiveTab("claim")}
              >
                <ThemedText
                  variant="text14M"
                  style={{ color: activeTab === "claim" ? "#fff" : "#000" }}
                >
                  Warranty
                </ThemedText>
              </Pressable>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <FilterDropdown
                selectedStatus={statusFilter}
                onSelectStatus={setStatusFilter}
              />
            </View>
          </View>

          {/* History List */}
          <View style={styles.listContainer}>
            {historyLoading && currentPage === 1 ? (
              <HistoryLoadingSkeleton count={3} />
            ) : historyData && historyData.result.length > 0 ? (
              <FlatList
                data={historyData.result}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <HistoryCard item={item} type={activeTab} />
                )}
                scrollEnabled={false}
                ListFooterComponent={
                  historyData.currentPage < historyData.totalPages ? (
                    <Pressable
                      style={styles.loadMoreButton}
                      onPress={() =>
                        fetchHistory(
                          id,
                          activeTab,
                          statusFilter,
                          currentPage + 1,
                        )
                      }
                      disabled={historyLoading}
                    >
                      {historyLoading ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                      ) : (
                        <Text
                          style={[
                            styles.loadMoreText,
                            { color: theme.primary },
                          ]}
                        >
                          Load More
                        </Text>
                      )}
                    </Pressable>
                  ) : null
                }
              />
            ) : (
              <HistoryEmptyState type={activeTab} filter={statusFilter} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 80,
    position: "relative",
  },
  bannerImage: {
    height: 140,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  profileSection: {
    position: "absolute",
    top: 100, // Overlap banner
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    position: "absolute",
    top: -40,
    alignItems: "center",
    justifyContent: "center",
  },
  redLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
  infoCard: {
    marginTop: 50,
    marginHorizontal: SPACING.screenPadding,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  separator: {
    height: 1,
    width: "100%",
  },
  historySection: {
    paddingHorizontal: SPACING.screenPadding,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  listContainer: {
    minHeight: 100,
  },
  loadMoreButton: {
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginTop: moderateScale(10),
  },
  loadMoreText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
