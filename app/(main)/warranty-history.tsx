import OrderCard from '@/components/common/order-card'
import OrderSkeleton from '@/components/common/order-skeleton'
import { SearchInput } from '@/components/common/search-input'
import { moderateScale } from '@/newLib/responsive'
import { ThemedText } from '@/newLib/ThemedText'
import { useClaimHistory } from '@/services/queries/claims'
import { SPACING } from '@/theme/spacing'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native'

const WarrantyHistory = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useClaimHistory(debouncedSearch);

    const claims = data?.pages.flatMap((page) => page.data.result) || [];

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return <View style={{ height: moderateScale(20) }} />;
        return (
            <View style={{ paddingVertical: SPACING.gap }}>
                <ActivityIndicator size="small" color="#000" />
            </View>
        );
    };

    const getStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'pending';
            case 'delivered':
                return 'completed';
            case 'approved':
                return 'in-progress';
            case 'rejected':
                return 'cancelled';
            default:
                return 'pending';
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <Header title="Warranty History" showBack={true} onBackPress={() => router.back()} /> */}
            <View style={{ padding: SPACING.screenPadding, gap: SPACING.gap }}>
                <SearchInput
                    placeholder="Search History"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    containerStyle={{ marginBottom: 0 }}
                />
            </View>

            {isLoading ? (
                <View style={{ padding: SPACING.screenPadding, marginTop: SPACING.gap }}>
                    {[...Array(5)].map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={claims}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: SPACING.screenBottom + moderateScale(116),
                        paddingHorizontal: SPACING.screenPadding,
                        gap: SPACING.gap,
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: SPACING.gap }} />}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => router.push(`/(main)/claim-details/${item._id}`)}>
                            <OrderCard
                                id={item.claimId}
                                label="Claim ID"
                                address={item.kycDetails?.business_address || item.kycDetails?.location || "No Address"}
                                date={new Date(item.createdAt).toLocaleDateString()}
                                name={item.userDetails?.userName || item.vendorDetails?.userName || "Unknown User"}
                                place={item.kycDetails?.location || ""}
                                status={getStatus(item.status)}
                                type="vertical"
                            />
                        </Pressable>
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(50) }}>
                            <ThemedText>No warranty history found</ThemedText>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default WarrantyHistory


