import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'expo-router';
// import { Picker } from '@react-native-picker/picker'; // You might need to install this if not available, or use a custom one.
// Assuming @react-native-picker/picker is not installed, I will use a simple mapping or just ID input for now, 
// OR I will rely on the user to pick from a list if I can implementation a simple dropdown.
// For this MVP I will use a simple text input for category ID or try to fetch categories and show them.
// Wait, I have `getServiceCategories`. I can map them to a simple UI or use a standard Picker if available.
// Since I can't easily install packages without user permission, I'll check package.json first? 
// No, I'll just use a simple list selection or a Modal.
// Actually, `Picker` is standard in Expo? No, it's a separate package.
// I'll use a simple "Category" selection via a Modal or just a list of radio buttons if few.
// For now, I'll assume standard RN TextInput for ID or Name? No, ID is needed.
// I'll unimplemented the Picker and just use a numeric input for Category ID for now, 
// OR better, I'll fetch categories and display them as chips to select.

import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { createService, getServiceCategories } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';

const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.number().min(1, "Category is required"),
  price: z.number().min(0),
  durationMinutes: z.number().min(15),
  imageUrl: z.string().url(),
  slug: z.string().min(3),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function CreateServiceScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth(); // Using this as providerId
  const { mutate: createServiceMutation, isPending } = createService();
  const { data: categories } = getServiceCategories();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: 0,
      price: 0,
      durationMinutes: 60,
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      slug: '',
    }
  });

  const selectedCategoryId = watch('categoryId');

  const onSubmit = (data: ServiceFormData) => {
    if (!merchantShopId) {
      Alert.alert("Error", "Merchant Shop ID not found");
      return;
    }

    createServiceMutation({
      ...data,
      providerId: merchantShopId,
    }, {
      onSuccess: () => {
        Alert.alert("Success", "Service created successfully!");
        router.back();
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Service</Text>
        <TouchableOpacity onPress={() => router.back()}>
             <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="e.g. Haircut"
                value={value}
                onChangeText={(text) => {
                    onChange(text);
                    // Auto-generate slug
                    setValue('slug', text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                }}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        {/* Categories */}
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
                {categories?.map((cat: any) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryChip,
                            selectedCategoryId === cat.id && styles.categoryChipSelected
                        ]}
                        onPress={() => setValue('categoryId', cat.id)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategoryId === cat.id && styles.categoryTextSelected
                        ]}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your service..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
        </View>

        {/* Price & Duration */}
        <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Price ($)</Text>
            <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={value?.toString()}
                    onChangeText={(val) => onChange(Number(val) || 0)}
                />
                )}
            />
             {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Duration (min)</Text>
            <Controller
                control={control}
                name="durationMinutes"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="60"
                    keyboardType="numeric"
                    value={value?.toString()}
                    onChangeText={(val) => onChange(Number(val) || 0)}
                />
                )}
            />
             {errors.durationMinutes && <Text style={styles.errorText}>{errors.durationMinutes.message}</Text>}
            </View>
        </View>

        {/* Image URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.imageUrl && <Text style={styles.errorText}>{errors.imageUrl.message}</Text>}
        </View>

         {/* Slug */}
         <View style={styles.inputGroup}>
          <Text style={styles.label}>Slug</Text>
          <Controller
            control={control}
            name="slug"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="service-slug"
                value={value}
                onChangeText={onChange}
                editable={false} // Generated
              />
            )}
          />
          {errors.slug && <Text style={styles.errorText}>{errors.slug.message}</Text>}
        </View>


        <TouchableOpacity 
            style={[styles.createButton, isPending && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
        >
          <Text style={styles.createButtonText}>
            {isPending ? "Creating..." : "Create Service"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    paddingTop: 60,
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.bold,
  },
  cancelText: {
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  label: {
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.regular,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
  },
  categoryChip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: NEO_THEME.colors.grey,
      backgroundColor: 'white',
  },
  categoryChipSelected: {
      backgroundColor: NEO_THEME.colors.primary,
      borderColor: NEO_THEME.colors.black,
      borderWidth: NEO_THEME.borders.width,
  },
  categoryText: {
      fontFamily: NEO_THEME.fonts.regular,
      color: NEO_THEME.colors.black,
  },
  categoryTextSelected: {
      fontFamily: NEO_THEME.fonts.bold,
      color: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
  },
  createButton: {
    backgroundColor: NEO_THEME.colors.primary,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  disabledButton: {
      opacity: 0.7,
  },
  createButtonText: {
    color: 'white',
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 18,
  },
});
