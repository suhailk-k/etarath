import CustomerListSkeleton from '@/components/customers/customer-list-skeleton';
import { useTheme } from '@/newLib/theme';
import { ThemedText } from '@/newLib/ThemedText';
import { ThemedTextInput } from '@/newLib/ThemedTextInput';
import { useCustomers } from '@/services/queries/customers';
import { SPACING } from '@/theme/spacing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomerList() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const { data: customersData, isLoading } = useCustomers(search);
  const customers = customersData?.data || [];
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => {
    console.log(item);
    
    return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/(main)/customers/${item.customerDetails._id}`)}
    >
      <ImageBackground
        source={{ uri: item.customerDetails.imgUrl || '' }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.overlay} />
      {item.customerDetails.location&&  <View style={styles.tag}>
        <MaterialIcons name="location-on" size={14} color="white" />
          <ThemedText variant="text12M" style={{ color: '#fff' }}>
            {item.customerDetails.location }
          </ThemedText>
        </View>}
        <View style={styles.cardContent}>
          {/* <View style={styles.iconContainer}>
             <View style={styles.redIcon}>
                <MaterialIcons name="location-on" size={14} color="white" />
             </View>
          </View> */}
          <ThemedText variant="text16B" style={{ color: '#fff' }}>
            {item.customerDetails.userName}
          </ThemedText>
        </View>
      </ImageBackground>
    </Pressable>
  );}

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
             <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </Pressable>
          <ThemedText variant="title">Customers</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.searchContainer}>
          <ThemedTextInput
            placeholder="Search Customers"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <CustomerListSkeleton />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: SPACING.gap, padding: SPACING.screenPadding }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText variant="text14M">No customers found</ThemedText>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    justifyContent: 'flex-end',
    padding: SPACING.gap,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.screenPadding,
    alignItems: 'center',
  },
});
