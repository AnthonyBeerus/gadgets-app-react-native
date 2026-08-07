import React from 'react';
import { View, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductForm, { ProductFormData } from '../components/products/ProductForm';
import { createProduct, uploadProductImage } from '../shared/api/api';
import { useAuth } from '../shared/providers/auth-provider';
import { useTheme } from '../shared/providers/theme-provider';
import { useNeoStyles } from '../shared/hooks/useNeoStyles';

export default function CreateProductScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { theme } = useTheme();
  const styles = useNeoStyles(createStyles);
  const createProductMutation = createProduct();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: ProductFormData, images: string[]) => {
    if (!merchantShopId) {
        Alert.alert("Error", "You must be a verified merchant to create products.");
        return;
    }

    if (images.length === 0) {
      Alert.alert("Image required", "Add at least one product image before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const uri of images) {
        if (uri.startsWith('http')) {
            imageUrls.push(uri);
        } else {
            const publicUrl = await uploadProductImage(uri);
            if (publicUrl) imageUrls.push(publicUrl);
        }
      }

      await createProductMutation.mutateAsync({
        ...data,
        shop_id: merchantShopId,
        imagesUrl: imageUrls,
        heroImage: imageUrls[0],
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
            headerStyle: { backgroundColor: theme.colors.backgroundLight },
            headerTintColor: theme.colors.black,
        }} 
      />
      <View style={styles.content}>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(c: { backgroundLight: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.backgroundLight,
    },
    content: {
      flex: 1,
    },
  };
}
