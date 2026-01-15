import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getProviderServices, deleteService } from '../../../shared/api/api';
import { Alert } from 'react-native';
import { PopProductCard } from "../../../components/shop/PopProductCard";

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MerchantServicesScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: services, isLoading, error } = getProviderServices(merchantShopId || 0);
  
  // Collapsible Tab Logic
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });



  const { mutate: deleteServiceMutation } = deleteService();
  
  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteServiceMutation(id, {
                onSuccess: () => Alert.alert("Success", "Service deleted"),
                onError: (err) => Alert.alert("Error", err.message)
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
        <PopProductCard
            item={item}
            index={index}
            type="service"
            actionButton={
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <MaterialIcons name="delete-outline" size={24} color="black" />
                </TouchableOpacity>
            }
        />
    );
  };

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
            <Text style={styles.errorText}>Error loading services: {error.message}</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: 100,
            paddingTop: headerHeight + tabBarHeight + insets.top + 16 
        }}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No services listed.</Text>
                <Text style={styles.emptySubtext}>Time to offer your skills!</Text>
            </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  errorText: {
    color: NEO_THEME.colors.red,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  emptySubtext: {
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
  },
});
