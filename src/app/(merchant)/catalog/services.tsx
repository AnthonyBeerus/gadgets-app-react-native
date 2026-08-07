import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getProviderServices, deleteService } from '../../../shared/api/api';
import { PopProductCard } from "../../../components/shop/PopProductCard";

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MerchantServicesScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const { merchantProviderId } = useAuth();
  const { data: services, isLoading, error } = getProviderServices(merchantProviderId || 0);
  
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
                    <MaterialIcons name="delete-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            }
        />
    );
  };

  if (isLoading) {
    return (
        <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
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

function createStyles(c: { background: string; white: string; border: string; red: string; grey: string; text: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    deleteBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.white,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 1,
      borderColor: c.border,
    },
    errorText: {
      color: c.red,
      fontWeight: 'bold' as const,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center' as const,
    },
    emptyText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 24,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
      color: c.text,
    },
    emptySubtext: {
      fontFamily: NEO_THEME.fonts.bold,
      color: c.grey,
      textAlign: 'center' as const,
    },
  };
}
