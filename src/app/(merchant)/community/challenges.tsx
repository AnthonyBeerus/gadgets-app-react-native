import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getShopChallenges, deleteChallenge } from '../../../shared/api/api';
import { Alert } from 'react-native';

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MerchantChallengesScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: challenges, isLoading, error } = getShopChallenges(merchantShopId || 0);

  // Collapsible Tab Logic
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { mutate: deleteChallengeMutation } = deleteChallenge();

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteChallengeMutation(id, {
                onSuccess: () => Alert.alert("Success", "Challenge deleted"),
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
        <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.brand}>{item.brand_name || 'My Shop'}</Text>
        <Text style={styles.reward}>🏆 {item.reward}</Text>
        <Text style={styles.deadline}>Ends: {new Date(item.deadline).toLocaleDateString()}</Text>
        <View style={styles.statsRow}>
             <Text style={styles.participants}>👥 {item.participants_count || 0} participants</Text>
        </View>
      </View>
    </View>
  );

  const AddButton = (
    <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => router.push('/challenges/create')}
    >
        <MaterialIcons name="add" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Create</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
        <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
            <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
        </View>
    );
  }

  if (error) {
    return (
        <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
            <Text style={styles.errorText}>Error loading challenges: {error.message}</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={challenges}
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
              <Text style={styles.emptyText}>No active challenges.</Text>
              <Text style={styles.emptySubtext}>Create a challenge to engage your customers!</Text>
          </View>
        }
      />
      {/* Floating Action Button for Create (since we removed the header button) */}
      <View style={[styles.fabContainer, { bottom: 20 }]}>
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
      zIndex: 10,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Pill shape
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  floatingButtonText: {
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
    padding: 16,
  },
  headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.bold,
    flex: 1,
    marginRight: 8,
  },
  brand: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 8,
  },
  reward: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.primary,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  participants: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.grey,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  statusActive: {
    backgroundColor: '#C6F6D5',
  },
  statusInactive: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
  },
  deleteBtn: {
    padding: 4,
  },
  errorText: {
    color: 'red',
    fontFamily: NEO_THEME.fonts.bold,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300, 
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
