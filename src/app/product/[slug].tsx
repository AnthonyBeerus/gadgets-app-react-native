import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useCartStore } from "../../store/cart-store";
import { getProduct } from "../../api/api";
import { ActivityIndicator } from "react-native";
import TryOnModal from "../../features/virtual-try-on/components/TryOnModal";

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const toast = useToast();

  const { data: product, error, isLoading } = getProduct(slug);

  const { items, addItem, incrementItem, decrementItem } = useCartStore();

  const cartItem = items.find((item) => item.id === product?.id);

  const initialQuantity = cartItem ? cartItem.quantity : 0;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!product) return <Redirect href="/404" />;

  const increaseQuantity = () => {
    if (quantity < product.maxQuantity) {
      setQuantity((prev) => prev + 1);
      incrementItem(product.id);
    } else {
      toast.show("Cannot add more than maximum quantity", {
        type: "warning",
        placement: "top",
        duration: 1500,
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      decrementItem(product.id);
    }
  };

  const addToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      heroImage: product.heroImage,
      price: product.price,
      quantity,
      maxQuantity: product.maxQuantity,
    });
    toast.show("Added to cart", {
      type: "success",
      placement: "top",
      duration: 1500,
    });
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  // Check if product is clothing (category 2) for virtual try-on
  const isClothing = product.category === 2;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.title }} />

      <Image source={{ uri: product.heroImage }} style={styles.heroImage} />

      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.title}>Title: {product.title}</Text>
        <Text style={styles.slug}>Slug: {product.slug}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Unit Price: ${product.price.toFixed(2)}
          </Text>
          <Text style={styles.price}>Total Price: ${totalPrice}</Text>
        </View>

        {/* Virtual Try-On Button for Clothing Items */}
        {isClothing && (
          <TouchableOpacity
            style={styles.tryOnButton}
            onPress={() => setTryOnModalVisible(true)}>
            <Ionicons name="glasses-outline" size={24} color="#fff" />
            <Text style={styles.tryOnButtonText}>Virtual Try-On</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={product.imagesUrl}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesContainer}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}
            disabled={quantity >= product.maxQuantity}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { opacity: quantity === 0 ? 0.5 : 1 },
            ]}
            onPress={addToCart}
            disabled={quantity === 0}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Virtual Try-On Modal */}
      <TryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        shopProducts={[product]}
      />
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  slug: {
    fontSize: 18,
    color: "#555",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  price: {
    fontWeight: "bold",
    color: "#000",
  },
  tryOnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tryOnButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
  },
});
