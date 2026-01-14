import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getShopChallenges } from '../../../shared/api/api';

export default function MerchantChallengesScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: challenges, isLoading, error } = getShopChallenges(merchantShopId || 0);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/challenges/create')}
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
            <Text style={styles.errorText}>Error loading challenges: {error.message}</Text>
        </View>
      ) : (
        <FlatList
            data={challenges}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No active challenges.</Text>
                <Text style={styles.emptySubtext}>Create a challenge to engage your customers!</Text>
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
      backgroundColor: '#C6F6D5', // Green-ish
  },
  statusInactive: {
      backgroundColor: '#FED7D7', // Red-ish
  },
  statusText: {
      fontSize: 12,
      fontFamily: NEO_THEME.fonts.bold,
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
