import OrderCard from "@/components/common/order-card";
import OrderSkeleton from "@/components/common/order-skeleton";
import { SearchInput } from "@/components/common/search-input";
import { moderateScale } from "@/newLib/responsive";
import { ThemedText } from "@/newLib/ThemedText";
import { useOrderHistory } from "@/services/queries/orders";
import { SPACING } from "@/theme/spacing";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    View,
} from "react-native";

const OrderHistory = () => {
  const router = useRouter();
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
  } = useOrderHistory(debouncedSearch);

  const orders = data?.pages.flatMap((page) => page.data.result) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* <Header title="Order History" showBack={true} onBackPress={() => router.back()} /> */}
      <View style={{ padding: SPACING.screenPadding, gap: SPACING.gap }}>
        <SearchInput
          placeholder="Search History"
          value={searchTerm}
          onChangeText={setSearchTerm}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>
      {isLoading ? (
        <View
          style={{ padding: SPACING.screenPadding, marginTop: SPACING.gap }}
        >
          {[...Array(5)].map((_, index) => (
            <OrderSkeleton key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: SPACING.screenBottom + moderateScale(116),
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
                address={
                  item.kycDetails
                    ? `${item.kycDetails.business_address}, ${item.kycDetails.location}`
                    : "N/A"
                }
                date={new Date(item.orderDate).toLocaleDateString()}
                name={item.userDetails?.userName || "Unknown User"}
                place={item.kycDetails?.location || "N/A"}
                status={item.status as any}
                type="vertical"
                id={item.orderId}
              />
            </Pressable>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
              <ThemedText>No order history found</ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
};

export default OrderHistory;
