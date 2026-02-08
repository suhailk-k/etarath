import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import OrderCard from "@/components/common/order-card";
import OrderSkeleton from "@/components/common/order-skeleton";
import { SearchInput } from "@/components/common/search-input";
import { moderateScale } from "@/newLib/responsive";
import { useOrders } from "@/services/queries/orders";
import { SPACING } from "@/theme/spacing";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
} from "react-native";

import CreateOrderSheet from "@/components/orders/CreateOrderSheet";
import { useTheme } from "@/newLib/theme";
import { OrderStatus } from "@/services/api/types/order";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";

const Orders = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    error,
  } = useOrders(debouncedSearch);

  const orders = data?.pages.flatMap((page) => page.data.result) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: SPACING.screenPadding, gap: SPACING.gap }}>
        <SearchInput
          placeholderTextColor={theme.placeholder}
          placeholder="Search Order"
          value={searchTerm}
          onChangeText={setSearchTerm}
          containerStyle={{ marginBottom: 0 }}
        />
        <View style={{ flexDirection: "row", gap: SPACING.gap }}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "black",
              paddingVertical: moderateScale(10),
              borderRadius: moderateScale(8),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => bottomSheetRef.current?.present()}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: moderateScale(14),
              }}
            >
              + Add Order
            </Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "black",
              paddingVertical: moderateScale(10),
              borderRadius: moderateScale(8),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.push("/(main)/order-history")}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "600",
                fontSize: moderateScale(14),
              }}
            >
              History
            </Text>
          </Pressable>
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
          <OrderSkeleton />
          <OrderSkeleton />
        </View>
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: SPACING.screenBottom + moderateScale(100),
            paddingHorizontal: SPACING.screenPadding,
            gap: SPACING.gap,
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: SPACING.gap }} />
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(main)/order-details/${item._id}`)}
            >
              <OrderCard
                label="Order ID"
                id={item._id}
                address={`${item.kycDetails.business_address}, ${item.kycDetails.location}`}
                date={new Date(item.orderDate).toLocaleDateString()}
                name={item.userDetails.userName}
                place={item.kycDetails.location}
                status={item.status as OrderStatus}
                type="vertical"
              />
            </Pressable>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#000" />
            ) : null
          }
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
                title={searchTerm ? "No Orders Found" : "No Orders Available"}
                description={
                  searchTerm
                    ? `No orders match "${searchTerm}"`
                    : "Orders will appear here once they are created"
                }
              />
            </View>
          }
        />
      )}
      <CreateOrderSheet bottomSheetModalRef={bottomSheetRef} />
    </View>
  );
};

export default Orders;
