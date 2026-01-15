import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { NeoButton } from '../../shared/components/ui/neo-button';

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  category: z.string().optional().default("1"), // Default to ID 1 or make dynamic
  maxQuantity: z.preprocess((val) => Number(val), z.number().int().min(0).default(999)),
  sku: z.string().optional(),
  brand: z.string().optional(),
  is_available: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

type ProductFormProps = {
  initialValues?: Partial<ProductFormData & { heroImage?: string; imagesUrl?: string[] }>;
  onSubmit: (data: ProductFormData, images: string[]) => Promise<void>;
  isSubmitting?: boolean;
};

export default function ProductForm({ initialValues, onSubmit, isSubmitting }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialValues?.imagesUrl || (initialValues?.heroImage ? [initialValues.heroImage] : []));
  
  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      price: initialValues?.price || 0,
      maxQuantity: initialValues?.maxQuantity || 999,
      sku: initialValues?.sku || '',
      brand: initialValues?.brand || '',
      is_available: initialValues?.is_available ?? true,
      category: initialValues?.category || "1",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data, images);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Product Details</Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Vintage Camera"
            />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={String(value)}
              placeholder="0.00"
              keyboardType="numeric"
            />
            {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}
          </View>
        )}
      />

       <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Product description..."
              multiline
              numberOfLines={4}
            />
          </View>
        )}
      />

      <View style={styles.row}>
         <Controller
          control={control}
          name="maxQuantity"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={[styles.inputGroup, styles.half]}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={String(value)}
                keyboardType="numeric"
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="sku"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={[styles.inputGroup, styles.half]}>
              <Text style={styles.label}>SKU (Optional)</Text>
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="is_available"
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchRow}>
            <Text style={styles.label}>Available for Sale</Text>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: NEO_THEME.colors.primary }}
            />
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Images</Text>
      <View style={styles.imagesContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeImageBtn}>
              <MaterialIcons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <MaterialIcons name="add-photo-alternate" size={32} color={NEO_THEME.colors.grey} />
          <Text style={styles.addImageText}>Add Image</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <NeoButton 
            onPress={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Saving...' : 'Save Product'}
        </NeoButton>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    color: NEO_THEME.colors.black,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: NEO_THEME.colors.black,
  },
  input: {
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: NEO_THEME.colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: NEO_THEME.colors.error || 'red',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageBtn: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  addImageText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: NEO_THEME.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'black',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
