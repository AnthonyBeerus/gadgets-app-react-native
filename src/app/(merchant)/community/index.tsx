import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getShopEvents } from '../../../shared/api/api';
import { format } from 'date-fns';

export default function MerchantEventsScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: events, isLoading, error } = getShopEvents(merchantShopId || 0);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{format(new Date(item.date), 'MMM dd, yyyy • h:mm a')}</Text>
        <Text style={styles.tickets}>
            {item.tickets_sold} / {item.total_tickets} Tickets Sold
        </Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>${item.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Events</Text>
        <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/events/create')}
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
            <Text style={styles.errorText}>Error loading events: {error.message}</Text>
        </View>
      ) : (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No events pending.</Text>
                <Text style={styles.emptySubtext}>Create an event to engage your customers.</Text>
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
    paddingTop: 60, // Safe area equivalent
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
    width: '100%',
    height: 150,
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 8,
  },
  tickets: {
      fontSize: 14,
      fontFamily: NEO_THEME.fonts.regular,
      color: NEO_THEME.colors.black,
  },
  badge: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      backgroundColor: NEO_THEME.colors.yellow,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: NEO_THEME.borders.width,
      borderRadius: NEO_THEME.borders.radius,
  },
  badgeText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
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
