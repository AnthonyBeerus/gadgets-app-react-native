import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductForm, { ProductFormData } from '../components/products/ProductForm';
import { createProduct, uploadProductImage } from '../shared/api/api';
import { NEO_THEME } from '../shared/constants/neobrutalism';
import { useAuth } from '../shared/providers/auth-provider';

export default function CreateProductScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const createProductMutation = createProduct();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: ProductFormData, images: string[]) => {
    if (!merchantShopId) {
        Alert.alert("Error", "You must be a verified merchant to create products.");
        return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload images
      const imageUrls: string[] = [];
      for (const uri of images) {
        // Check if it's already a remote URL (in case of edit, but here it's create)
        if (uri.startsWith('http')) {
            imageUrls.push(uri);
        } else {
            const publicUrl = await uploadProductImage(uri);
            if (publicUrl) imageUrls.push(publicUrl);
        }
      }

      // 2. Create product
      await createProductMutation.mutateAsync({
        ...data,
        shop_id: merchantShopId,
        imagesUrl: imageUrls,
        heroImage: imageUrls[0] || null, // First image is hero
      });

      Alert.alert("Success", "Product created successfully", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
            headerShown: true,
            title: "Add Product",
            headerStyle: { backgroundColor: NEO_THEME.colors.backgroundLight },
            headerTintColor: NEO_THEME.colors.black,
        }} 
      />
      <View style={styles.content}>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    flex: 1,
  },
});
