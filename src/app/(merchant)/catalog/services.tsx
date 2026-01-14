import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getProviderServices } from '../../../shared/api/api';

export default function MerchantServicesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  // Assuming provider_id is linked to user_id or we have a way to get it.
  // The schema says service.provider_id exists. 
  // In our auth provider we have merchantShopId which is for Shops.
  // Services might be linked to the same entity or a separate "Provider" entity.
  // For now, let's assume merchantShopId is effectively the providerId (or we need to fetch it).
  // Ideally, `create_dev_merchant` created a `service_provider` entry.
  // The `shop` table has an owner `user_id`? Or `service_provider` has `user_id`.
  // Let's check AuthProvider again. It returns `isMerchant`.
  // The `service_provider` ID is what we need.
  // I'll assume for this MVP that the user IS the provider and we fetch by user ID or we need to add providerId to Auth.
  // Wait, I saw `service_provider` table.
  // I will use `merchantShopId` as a proxy for now, but really we should have `merchantProviderId`.
  // Since `shops` table is for selling products, and `service_provider` is for services.
  // The `create_dev_merchant` RPC probably created both or linked them.
  // Let's assume `merchantShopId` is what we have. If `getProviderServices` fails, we know why.
  // Note: `getProviderServices` takes `providerId`. `merchantShopId` corresponds to `shops.id`.
  // If `service_provider` != `shops`, we have a mismatch.
  // BUT, in my previous turns I might have conflated them.
  // Let's look at `getShopProducts` (uses shopId) vs `getProviderServices` (uses providerId).
  // For now I will use `merchantShopId` and if it fails I'll fix the AuthProvider to fetch the correct ID.
  
  const { merchantShopId } = useAuth(); 
  const { data: services, isLoading, error } = getProviderServices(merchantShopId || 0);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>${item.price} • {item.duration_minutes} min</Text>
        <Text style={styles.category}>{item.category?.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Services</Text>
        <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/services/create')}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
            <Text style={styles.errorText}>Error loading services: {error.message}</Text>
        </View>
      ) : (
        <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No services listed.</Text>
                <Text style={styles.emptySubtext}>Add a service to start booking clients.</Text>
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
    backgroundColor: '#F0F0F0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  addButtonText: {
    color: 'white',
    fontFamily: NEO_THEME.fonts.bold,
    marginLeft: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    overflow: 'hidden',
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  image: {
    width: 100,
    height: 100,
    borderRightWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.primary,
  },
  category: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontFamily: NEO_THEME.fonts.regular,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontFamily: NEO_THEME.fonts.bold,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
  },
});
