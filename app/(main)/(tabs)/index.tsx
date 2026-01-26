import OrderCard from "@/components/common/order-card";
import SectionHeader from "@/components/common/section-header";
import HomeSkeleton from "@/components/home/home-skeleton";
import OverviewCard from "@/components/home/overview-card";
import { moderateScale } from "@/newLib/responsive";

import { ThemedText } from "@/newLib/ThemedText";
import { useDashboardData } from "@/services/queries/home";
import { SPACING } from "@/theme/spacing";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";

const Home = () => {

  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: "#fff" }]}>
        <HomeSkeleton />
      </View>
    );
  }

  const dashboardData = data?.data;
  const recentOrders = dashboardData?.orders?.result || [];
  const recentClaims = dashboardData?.claim?.result || [];
  const counts = dashboardData?.count;

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <ScrollView contentContainerStyle={{ paddingBottom:SPACING.screenBottom+moderateScale(100) }}>
        <SectionHeader title="Overview" />
        <View style={{ gap: SPACING.gap }}>
          <OverviewCard
            onPress={() => router.push("/(main)/(tabs)/orders")}
            type={"order"}
            total={counts?.totalAssignedOrders || 0}
            pending={counts?.totalPendingOrders || 0}
          />

          <OverviewCard 
            onPress={() => router.push("/(main)/(tabs)/products")}
            type={"product"} 
            total={counts?.stockOutProducts || 0} 
            pending={counts?.limitedStockProducts || 0} 
          />
          <OverviewCard 
            onPress={() => router.push("/(main)/(tabs)/warranty")}
            type={"warranty"}
            total={counts?.totalAssignedClaims || 0}
            pending={counts?.totalPendingClaims || 0}
          />
        </View>

        <SectionHeader onPress={() => router.push("/(main)/(tabs)/orders")} buttonName="See All" title="Recent Orders" />
        <FlatList
          data={recentOrders}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING.screenPadding,
            gap: SPACING.gap,
          }}
          ItemSeparatorComponent={() => <View style={{ width: SPACING.gap }} />}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/order-details/${item._id}`)}>
              <OrderCard
                id={item.orderId}
                address={item.kycDetails?.business_address}
                date={new Date(item.orderDate).toLocaleDateString()}
                name={item.kycDetails?.business_name}
                place={item.kycDetails?.location}
                status={item.status}
                type="horizontal"
                label="Order ID"
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ padding: SPACING.screenPadding }}>
              <ThemedText>No recent orders found.</ThemedText>
            </View>
          }
        />

        <SectionHeader onPress={() => router.push("/(main)/(tabs)/warranty")} buttonName="See All" title="Warranty Requests" />
        <FlatList
          data={recentClaims}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING.screenPadding,
            gap: SPACING.gap,
          }}
          ItemSeparatorComponent={() => <View style={{ width: SPACING.gap }} />}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/claim-details/${item._id}`)}> 
              <OrderCard
                id={item.claimId}
                address={item.kycDetails?.business_address}
                date={new Date(item.requestedDate).toLocaleDateString()}
                name={item.kycDetails?.business_name}
                place={item.kycDetails?.location}
                status={item.status}
                type="horizontal"
                label="Claim ID"
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ padding: SPACING.screenPadding }}>
              <ThemedText>No warranty requests found.</ThemedText>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1,
   },
});
