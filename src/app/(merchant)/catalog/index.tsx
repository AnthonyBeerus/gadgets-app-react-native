import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { useAuth } from "../../../shared/providers/auth-provider";
import { getShopProducts, deleteProduct } from "../../../shared/api/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { PopProductCard } from "../../../components/shop/PopProductCard";

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MerchantInventory() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: products, isLoading, error } = getShopProducts(merchantShopId || 0);
  const deleteProductMutation = deleteProduct();
  
  // Collapsible Tab Logic
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleDelete = (id: number) => {
    console.log('[Catalog] handleDelete called for id:', id);
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel", onPress: () => console.log('Delete cancelled') },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            console.log('[Catalog] Confirm delete id:', id);
            deleteProductMutation.mutate(id, {
                onSuccess: () => {
                    console.log('[Catalog] Delete success');
                    Alert.alert('Success', 'Product deleted');
                },
                onError: (err) => {
                    console.error('[Catalog] Delete error:', err);
                    Alert.alert('Error', 'Failed to delete: ' + err.message);
                }
            });
          }
        }
      ]
    );
  };

  // ... loading/error checks remain same (simple return Views are fine as they overlay everything)

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
        <Text style={styles.errorText}>Error loading inventory: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <PopProductCard
        item={item}
        index={index}
        onPress={() => console.log('View Product', item.id)} // Placeholder for detail view
        actionButton={
           <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete-outline" size={24} color="black" />
           </TouchableOpacity>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={products}
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
            <Text style={styles.emptyText}>No products found.</Text>
            <Text style={styles.emptySubtext}>Add some swag to your shop!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Clean white-ish bg to let cards pop
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 8,
  },
});
