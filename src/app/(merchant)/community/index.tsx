import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getShopEvents, deleteEvent } from '../../../shared/api/api';
import { format } from 'date-fns';
import { Alert } from 'react-native';

import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MerchantEventsScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: events, isLoading, error } = getShopEvents(merchantShopId || 0);
  const { mutate: deleteEventMutation } = deleteEvent();

  // Collapsible Tab Logic
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteEventMutation(id, {
                onSuccess: () => Alert.alert("Success", "Event deleted"),
                onError: (err) => Alert.alert("Error", err.message)
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <MaterialIcons name="delete-outline" size={24} color="gray" />
            </TouchableOpacity>
        </View>
        <Text style={styles.date}>{format(new Date(item.event_date), 'MMM dd, yyyy • h:mm a')}</Text>
        <Text style={styles.tickets}>
            {item.tickets_sold} / {item.total_tickets} Tickets Sold
        </Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>${item.price}</Text>
        </View>
      </View>
    </View>
  );

  const AddButton = (
    <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/events/create')}
    >
      <MaterialIcons name="add" size={24} color="white" />
      <Text style={styles.fabText}>Create Event</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
          <Text style={styles.errorText}>Error loading events: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Animated.FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={{ 
                paddingHorizontal: 16, 
                paddingBottom: 100,
                paddingTop: headerHeight + tabBarHeight + insets.top + 16 
            }}
            ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No events pending.</Text>
                <Text style={styles.emptySubtext}>Create an event to engage your customers.</Text>
            </View>
            }
        />
        <View style={styles.fabContainer}>
            {AddButton}
        </View>
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
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 100,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    marginLeft: 8,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: NEO_THEME.fonts.bold,
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
      padding: 4,
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
