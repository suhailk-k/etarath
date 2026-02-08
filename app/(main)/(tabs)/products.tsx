import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import { SearchInput } from "@/components/common/search-input";
import ProductCard from "@/components/product/product-card";
import ProductSkeleton from "@/components/product/product-skeleton";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { useProductList } from "@/services/queries/product";
import { SPACING } from "@/theme/spacing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

const Products = () => {
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    error,
  } = useProductList(debouncedSearch);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const products = data?.pages.flatMap((page) => page.data?.result || []) || [];

  // Error state
  if (error && !isRefetching && !isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: SPACING.screenPadding, paddingBottom: 0 }}>
          <SearchInput
            placeholder="Search Product"
            value={searchTerm}
            placeholderTextColor={theme.placeholder}
            onChangeText={setSearchTerm}
          />
        </View>
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
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={{ padding: SPACING.screenPadding, gap: SPACING.gap }}>
        <SearchInput
          placeholder="Search Product"
          value={searchTerm}
          placeholderTextColor={theme.placeholder}
          onChangeText={setSearchTerm}
          containerStyle={{ marginBottom: SPACING.gap }}
        />
        <ProductSkeleton />
        <ProductSkeleton />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: SPACING.screenPadding, paddingBottom: 0 }}>
        <SearchInput
          placeholder="Search Product"
          value={searchTerm}
          placeholderTextColor={theme.placeholder}
          onChangeText={setSearchTerm}
        />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard item={item} />}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: SPACING.screenPadding,
          paddingBottom: SPACING.screenBottom + moderateScale(116),
          paddingHorizontal: SPACING.screenPadding,
          gap: SPACING.gap,
        }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING.gap }} />}
        onEndReached={() => {
          // Basic fetch more trigger
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: 10, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#000" />
            </View>
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
              title={searchTerm ? "No Products Found" : "No Products Available"}
              description={
                searchTerm
                  ? `No products match "${searchTerm}"`
                  : "Products will appear here once they are added"
              }
            />
          </View>
        }
      />
    </View>
  );
};

export default Products;
