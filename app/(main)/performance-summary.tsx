import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/common/icon";
import FilterDropdown from "@/components/performance/FilterDropdown";
import HistoryCard from "@/components/performance/HistoryCard";
import HistoryEmptyState from "@/components/performance/HistoryEmptyState";
import HistoryLoadingSkeleton from "@/components/performance/HistoryLoadingSkeleton";
import PerformanceSummarySkeleton from "@/components/skeletons/performance-summary-skeleton";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { getOrdersClaimHistory, getSalesTarget } from "@/services/api/target";
import {
  OrdersClaimHistoryData,
  TargetData,
} from "@/services/api/types/target";
import Toast from "react-native-toast-message";

const PerformanceSummary = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TargetData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // History state
  const [activeTab, setActiveTab] = useState<"order" | "claim">("order");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historyData, setHistoryData] = useState<OrdersClaimHistoryData | null>(
    null,
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTarget = async (date: Date) => {
    try {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth is 0-indexed
      const response = await getSalesTarget(year, month);
      if (response.status === 200) {
        setData(response.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Failed to fetch data",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarget(selectedDate);
    fetchHistory(selectedDate, activeTab, statusFilter, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    fetchHistory(selectedDate, activeTab, statusFilter, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, statusFilter]);

  const fetchHistory = async (
    date: Date,
    type: "order" | "claim",
    status: string,
    page: number,
  ) => {
    try {
      setHistoryLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const response = await getOrdersClaimHistory(
        page,
        10,
        status,
        type,
        year,
        month,
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

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getAchievementColor = (achieved: number, total: number) => {
    if (total === 0) return theme.primary;
    const percentage = (achieved / total) * 100;
    if (percentage >= 100) return "#00B96F"; // Success green
    if (percentage >= 50) return "#FFA000"; // Warning orange
    return "#FF0F0F"; // Error red
  };

  const achievementColor = data
    ? getAchievementColor(
        data.targetSummery.totalAchievement,
        data.targetSummery.totalTarget,
      )
    : theme.primary;
  const percentage =
    data && data.targetSummery.totalTarget > 0
      ? (data.targetSummery.totalAchievement / data.targetSummery.totalTarget) *
        100
      : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="Back" size={moderateScale(24)} color="primary" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerSubtitle, { color: theme.primary }]}>
            Performance
          </Text>
          <Text style={[styles.headerTitle, { color: theme.primary }]}>
            Summary
          </Text>
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          {/* Placeholder for calendar icon if needed, currently using header right space */}
          {/* <Icon name="Calendar" size={moderateScale(24)} color="primary" /> */}
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Icon
            name="Back"
            size={moderateScale(20)}
            color="primary"
            style={{ transform: [{ rotate: "0deg" }] }}
          />
          {/* Reusing Back icon, might need rotation if it points left strictly. Assuming it points left. */}
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: theme.primary }]}>
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Icon name="ChevronRight" size={moderateScale(20)} color="primary" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <PerformanceSummarySkeleton />
        ) : (
          <>
            {/* Gauge Card */}
            <View style={styles.card}>
              <View style={styles.gaugeContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {data?.targetSummery.totalAchievement || 0}
                  </Text>
                  <Text style={styles.statLabel}>Orders{"\n"}Completed</Text>
                </View>

                <AnimatedCircularProgress
                  size={moderateScale(160)}
                  width={moderateScale(15)}
                  fill={percentage}
                  tintColor={achievementColor}
                  backgroundColor="#F0F0F0"
                  rotation={220}
                  arcSweepAngle={280}
                  lineCap="round"
                >
                  {(fill) => (
                    <View style={styles.gaugeCenter}>
                      <Text
                        style={[styles.gaugeStatus, { color: theme.primary }]}
                      >
                        {data?.targetSummery.status || "N/A"}
                      </Text>
                      <Text style={styles.gaugeLabel}>Target Achieved</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {data?.targetSummery.totalTarget || 0}
                  </Text>
                  <Text style={styles.statLabel}>Pending{"\n"}Orders</Text>
                  {/* Note: JSON says totalTarget, but design says Pending Orders on right. 
                                         Usually 'Target' is total goal. 'Pending' might be Target - Achievement. 
                                         However, based on the design, left is 'Orders Completed' (50), right is 'Pending Orders' (12). 
                                         Let's assume typical target math or use data provided carefully.
                                         The JSON has 'totalTarget': 10 'totalAchievement': 0. 
                                         Let's stick to displaying Total Target or Pending (Target - Achieved).
                                         Design says 'Pending Orders'. I will use Target - Achieved.
                                     */}
                </View>
              </View>

              {/* Horizontal Bars */}
              <View style={styles.barsContainer}>
                <View style={styles.barGroup}>
                  <Text style={[styles.barLabel, { color: theme.primary }]}>
                    Orders
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${
                            data &&
                            data.orderResult.pending +
                              data.orderResult.completed >
                              0
                              ? (data.orderResult.completed /
                                  (data.orderResult.pending +
                                    data.orderResult.completed)) *
                                100
                              : 0
                          }%`,
                          backgroundColor: "#00B96F",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>
                    {data?.orderResult.completed}/
                    {data
                      ? data.orderResult.pending + data.orderResult.completed
                      : 0}
                  </Text>
                </View>
                <View style={styles.barGroup}>
                  <Text style={[styles.barLabel, { color: theme.primary }]}>
                    Warranty
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${
                            data &&
                            data.claimResult.pending +
                              data.claimResult.completed >
                              0
                              ? (data.claimResult.completed /
                                  (data.claimResult.pending +
                                    data.claimResult.completed)) *
                                100
                              : 0
                          }%`,
                          backgroundColor: "#FF0F0F", // Using red as per 'Warranty' typically might need attention or just coloring distinctively
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>
                    {data?.claimResult.completed}/
                    {data
                      ? data.claimResult.pending + data.claimResult.completed
                      : 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* History Section Title */}
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>
              History
            </Text>

            {/* Filter/Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "order" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("order")}
              >
                <Text
                  style={
                    activeTab === "order"
                      ? styles.activeTabText
                      : styles.inactiveTabText
                  }
                >
                  Orders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "claim" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("claim")}
              >
                <Text
                  style={
                    activeTab === "claim"
                      ? styles.activeTabText
                      : styles.inactiveTabText
                  }
                >
                  Warranty
                </Text>
              </TouchableOpacity>
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
                      <TouchableOpacity
                        style={styles.loadMoreButton}
                        onPress={() =>
                          fetchHistory(
                            selectedDate,
                            activeTab,
                            statusFilter,
                            currentPage + 1,
                          )
                        }
                        disabled={historyLoading}
                      >
                        {historyLoading ? (
                          <ActivityIndicator
                            size="small"
                            color={theme.primary}
                          />
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
                      </TouchableOpacity>
                    ) : null
                  }
                />
              ) : (
                <HistoryEmptyState type={activeTab} filter={statusFilter} />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Or theme.background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(10),
  },
  backButton: {
    padding: moderateScale(5),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: moderateScale(12),
    fontWeight: "500",
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  calendarButton: {
    padding: moderateScale(5),
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(15),
    gap: moderateScale(20),
  },
  dateText: {
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(30),
  },
  card: {
    backgroundColor: "#F9F9F9", // Light gray card background
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: moderateScale(30),
  },
  gaugeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  statItem: {
    alignItems: "center",
    width: moderateScale(60),
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontSize: moderateScale(10),
    color: "#888",
    textAlign: "center",
  },
  gaugeCenter: {
    alignItems: "center",
  },
  gaugeStatus: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
  },
  gaugeLabel: {
    fontSize: moderateScale(10),
    color: "#888",
  },
  barsContainer: {
    gap: moderateScale(15),
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  barLabel: {
    width: moderateScale(70),
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  progressBarBg: {
    flex: 1,
    height: moderateScale(6),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(3),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },
  barValue: {
    width: moderateScale(40),
    fontSize: moderateScale(12),
    color: "#666",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: moderateScale(15),
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(20),
    gap: moderateScale(10),
  },
  tabButton: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    backgroundColor: "#F0F0F0",
  },
  activeTab: {
    backgroundColor: "black",
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  inactiveTabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: moderateScale(14),
  },
  filterText: {
    color: "#666",
    fontSize: moderateScale(14),
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

export default PerformanceSummary;
