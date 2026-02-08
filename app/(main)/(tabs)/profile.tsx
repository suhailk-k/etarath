import Icon from "@/components/common/icon";

import ErrorState from "@/components/common/error-state";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import UpdateProfileSheet from "@/components/profile/update-profile-sheet";
import { moderateScale } from "@/newLib/responsive";
import { useDashboardData } from "@/services/queries/home";
import { useUserProfile } from "@/services/queries/user";
import { useUser } from "@/store/userStore";
import { SPACING } from "@/theme/spacing";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { data: homeData } = useDashboardData();

  const router = useRouter();
  const { data, isLoading, error } = useUserProfile();
  const user = useUser();
  // const { logout } = useAuthActions()

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          // await logout()
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    isLogout = false,
  }: {
    icon: any;
    label: string;
    onPress: () => void;
    isLogout?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon
          name={icon}
          size={moderateScale(24)}
          color={isLogout ? undefined : "primary"}
        />
        <Text style={[styles.menuLabel, isLogout && { color: "black" }]}>
          {label}
        </Text>
      </View>
      <Icon name="ChevronRight" size={moderateScale(20)} color="primary" />
    </TouchableOpacity>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: SPACING.screenTop,
        }}
      >
        <ErrorState
          error={error as Error}
          errorType={
            error?.message?.includes("network") ||
            error?.message?.includes("fetch")
              ? "network"
              : "api"
          }
        />
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: SPACING.screenTop,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SPACING.screenPadding }}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {/* <Icon name="Profile" size={moderateScale(40)} color="black" />
                            <View style={styles.editIconBadge}>
                                <Icon name="Edit" size={moderateScale(12)} color="white" />
                            </View> */}
              <Image
                contentFit="cover"
                source={{ uri: user?.imgUrl }}
                style={{
                  height: moderateScale(60),
                  width: moderateScale(60),
                  borderRadius: moderateScale(30),
                }}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.userName || "User Name"}
              </Text>
              <Text style={styles.profileLocation}>{user?.location || ""}</Text>
              <Text style={styles.profilePhone}>{user?.phoneNumber || ""}</Text>
            </View>
            <TouchableOpacity
              style={styles.cardEditButton}
              onPress={handlePresentModalPress}
            >
              <Icon name="Edit" size={moderateScale(20)} color="primary" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="Chart"
            label="Performance Summary"
            onPress={() => router.push("/(main)/performance-summary")}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="Users"
            label="Customers"
            onPress={() => router.push("/(main)/customers")}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="Phone"
            label="Contact Admin"
            onPress={() => {
              Linking.openURL(`tel:${homeData?.contact?.phoneNumber}`);
            }}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="Info"
            label="About Etarath"
            onPress={() => {
              Linking.openURL(homeData?.contact?.webUrl);
            }}
          />
          <View style={styles.divider} />
          <MenuItem icon="Logout" label="Logout" onPress={handleLogout} />
          <View style={styles.divider} />
        </View>
      </ScrollView>

      <UpdateProfileSheet ref={bottomSheetRef} user={user} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileCard: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(24),
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    backgroundColor: "#F5F5F5",
    borderRadius: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: moderateScale(12),
    gap: moderateScale(2),
  },
  profileName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "black",
  },
  profileLocation: {
    fontSize: moderateScale(12),
    color: "#666",
  },
  profilePhone: {
    fontSize: moderateScale(12),
    color: "#4A90E2",
    fontWeight: "500",
  },
  cardEditButton: {
    padding: moderateScale(4),
  },
  menuContainer: {
    marginTop: moderateScale(8),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(16),
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  menuLabel: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "black",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
});
