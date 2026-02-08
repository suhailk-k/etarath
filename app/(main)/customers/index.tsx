import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import { SearchInput } from "@/components/common/search-input";
import CustomerListSkeleton from "@/components/customers/customer-list-skeleton";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { ThemedText } from "@/newLib/ThemedText";
import { useCustomers } from "@/services/queries/customers";
import { SPACING } from "@/theme/spacing";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomerList() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: customersData,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useCustomers(debouncedSearch);
  const customers = customersData?.data?.result || [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          item?._id && router.push(`/(main)/customers/${item.userId}`)
        }
      >
        <ImageBackground
          source={{ uri: item?.shop_photo || "" }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay} />

          {/* Al Dhaid tag in top-left */}
          <View style={styles.locationTag}>
            <MaterialIcons name="done" size={12} color="white" />
            <ThemedText variant="text12M" style={{ color: "#fff" }}>
              {item?.location || ""}
            </ThemedText>
          </View>

          {/* Location badge at bottom */}
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item?.logo || "" }}
              style={styles.locationBadge}
            />
            <ThemedText variant="text16B" style={{ color: "#fff" }}>
              {item?.name || ""}
            </ThemedText>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.header,
          { paddingTop: insets.top, backgroundColor: theme.background },
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </Pressable>
          <ThemedText variant="title">Customers</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.searchContainer}>
          <SearchInput
            placeholderTextColor={theme.placeholder}
            placeholder="Search Customers"
            value={searchTerm}
            onChangeText={setSearchTerm}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      </View>

      {/* Error State */}
      {error && !isRefetching && !isLoading ? (
        <ErrorState
          error={error as Error}
          errorType={
            error?.message?.includes("network") ||
            error?.message?.includes("fetch")
              ? "network"
              : "api"
          }
          onRetry={refetch}
        />
      ) : isLoading ? (
        <View
          style={{ padding: SPACING.screenPadding, marginTop: SPACING.gap }}
        >
          <CustomerListSkeleton />
        </View>
      ) : (
        <FlatList
          data={customers}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item?._id || index}`}
          renderItem={renderItem}
          contentContainerStyle={{
            gap: SPACING.gap,
            padding: SPACING.screenPadding,
            paddingBottom: SPACING.screenBottom,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000"
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: moderateScale(50),
              }}
            >
              <EmptyState
                type={searchTerm ? "no-results" : "no-data"}
                title={
                  searchTerm ? "No Customers Found" : "No Customers Available"
                }
                description={
                  searchTerm
                    ? `No customers match "${searchTerm}"`
                    : "Customers will appear here once they are added"
                }
              />
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: SPACING.gap,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.gap,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: SPACING.screenPadding,
  },
  card: {
    height: 180,
    borderRadius: 12,
    marginBottom: SPACING.gap,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
    padding: SPACING.gap,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: SPACING.screenPadding,
    alignItems: "center",
  },
});
