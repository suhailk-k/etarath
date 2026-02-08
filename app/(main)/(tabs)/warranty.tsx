import CreateClaimSheet from "@/components/claims/CreateClaimSheet";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import OrderCard from "@/components/common/order-card";
import { SearchInput } from "@/components/common/search-input";
import { WarrantySkeletonList } from "@/components/skeletons/warranty-skeleton";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { useClaims } from "@/services/queries/claims";
import { SPACING } from "@/theme/spacing";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

const Warranty = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
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
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useClaims(debouncedSearch);

  const claims = data?.pages.flatMap((page) => page.data.result) || [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage)
      return <View style={{ height: moderateScale(20) }} />;
    return (
      <View style={{ paddingVertical: SPACING.gap }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: SPACING.screenPadding, gap: SPACING.gap }}>
        <SearchInput
          placeholderTextColor={theme.placeholder}
          placeholder="Search Claim"
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
            onPress={() => bottomSheetModalRef.current?.present()}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: moderateScale(14),
              }}
            >
              + Add New
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
            onPress={() => router.push("/(main)/warranty-history")}
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
        <WarrantySkeletonList />
      ) : (
        <FlatList
          data={claims}
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
              onPress={() => router.push(`/claim-details/${item._id}`)}
            >
              <OrderCard
                id={item.claimId}
                label="Claim ID"
                address={
                  item.kycDetails?.business_address ||
                  item.kycDetails?.location ||
                  "No Address"
                }
                date={new Date(item.createdAt).toLocaleDateString()}
                name={
                  item.userDetails?.userName ||
                  item.vendorDetails?.userName ||
                  "Unknown User"
                }
                place={item.kycDetails?.location || ""}
                status={item.status}
                type="vertical"
              />
            </Pressable>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
                title={searchTerm ? "No Claims Found" : "No Claims Available"}
                description={
                  searchTerm
                    ? `No claims match "${searchTerm}"`
                    : "Warranty claims will appear here once they are submitted"
                }
              />
            </View>
          }
        />
      )}

      <CreateClaimSheet bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
};

export default Warranty;
