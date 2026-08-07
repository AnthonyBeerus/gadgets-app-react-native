import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../../shared/providers/auth-provider";
import { getShopProducts, deleteProduct } from "../../../shared/api/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { PopProductCard } from "../../../components/shop/PopProductCard";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNeoStyles } from "../../../shared/hooks/useNeoStyles";
import { useTheme } from "../../../shared/providers/theme-provider";

export default function MerchantInventory() {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
  const { merchantShopId } = useAuth();
  const { data: products, isLoading, error } = getShopProducts(merchantShopId || 0);
  const deleteProductMutation = deleteProduct();
  
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteProductMutation.mutate(id, {
                onSuccess: () => {
                    Alert.alert('Success', 'Product deleted');
                },
                onError: (err) => {
                    Alert.alert('Error', 'Failed to delete: ' + err.message);
                }
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
        <ActivityIndicator size="large" color={c.primary} />
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
        onPress={() => item.slug && router.push(`/product/${item.slug}`)}
        actionButton={
           <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete-outline" size={24} color={c.black} />
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
            <Text style={styles.emptySubtext}>Add your first product to make the shop visible to shoppers.</Text>
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={() => router.push('/create-product')}
            >
              <MaterialIcons name="add-box" size={20} color={c.white} />
              <Text style={styles.addProductButtonText}>Add product</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

function createStyles(c: {
  black: string;
  white: string;
  grey: string;
  border: string;
  background: string;
  primary: string;
  red: string;
}) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    center: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    deleteBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.white,
      justifyContent: "center" as const,
      alignItems: "center" as const,
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
      color: c.black,
    },
    emptySubtext: {
      fontFamily: NEO_THEME.fonts.bold,
      color: c.grey,
      padding: 8,
      textAlign: 'center' as const,
      marginBottom: 12,
    },
    addProductButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
      backgroundColor: c.primary,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    addProductButtonText: {
      color: c.white,
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
    },
  };
}
