import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { createChallenge, getShopProducts } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';

const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brandName: z.string().min(2, "Brand name required"),
  reward: z.string().min(3, "Reward description required"),
  deadline: z.date(),
  imageUrl: z.string().url(),
  requirements: z.string(),
  category: z.string().min(3),
  productId: z.number().int().positive('Select a sponsored product'),
  productIds: z.array(z.number().int().positive()).default([]),
  rewardValue: z.number().positive('Voucher value must be greater than zero'),
  contestMode: z.enum(['standard', 'competitive_pot']),
  potValue: z.number().nonnegative(),
  consolationVoucherValue: z.number().nonnegative(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

export default function CreateChallengeScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { mutate: createChallengeMutation, isPending } = createChallenge();
  const { data: products } = getShopProducts(merchantShopId ?? 0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      brandName: '',
      reward: 'P1000 pot · top 5 share',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      requirements: '',
      category: 'General',
      productId: 0,
      productIds: [],
      rewardValue: 50,
      contestMode: 'competitive_pot',
      potValue: 1000,
      consolationVoucherValue: 25,
    }
  });

  const deadline = watch('deadline');
  const contestMode = watch('contestMode');
  const productIds = watch('productIds');

  const toggleProduct = (productId: number) => {
    const next = productIds.includes(productId)
      ? productIds.filter(id => id !== productId)
      : [...productIds, productId];
    setValue('productIds', next);
    if (!watch('productId') && next[0]) setValue('productId', next[0]);
    if (watch('productId') && !next.includes(watch('productId')) && next[0]) {
      setValue('productId', next[0]);
    }
  };

  const onSubmit = (data: ChallengeFormData) => {
    if (!merchantShopId) {
      Alert.alert("Error", "Merchant Shop ID not found");
      return;
    }
    if (data.contestMode === 'competitive_pot' && data.potValue <= 0) {
      Alert.alert('Error', 'Competitive challenges need a pot value greater than zero.');
      return;
    }

    const requirementsArray = data.requirements.split('\n').filter(r => r.trim().length > 0);
    const selectedProducts = data.productIds.length > 0 ? data.productIds : [data.productId];

    createChallengeMutation({
      ...data,
      deadline: data.deadline.toISOString(),
      requirements: requirementsArray,
      shopId: merchantShopId,
      type: 'free',
      productId: data.productId || selectedProducts[0],
      productIds: selectedProducts,
      contestMode: data.contestMode,
      potValue: data.potValue,
      consolationVoucherValue: data.consolationVoucherValue,
      reward: data.contestMode === 'competitive_pot'
        ? `P${data.potValue} pot · top 5 share · P${data.consolationVoucherValue} consolation`
        : data.reward,
    }, {
      onSuccess: () => {
        Alert.alert("Success", data.contestMode === 'competitive_pot'
          ? "Competitive challenge is live."
          : "Creator opportunity activated for this product.");
        router.back();
      },
      onError: (error: Error) => {
        Alert.alert("Error", error.message);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Challenge</Text>
        <TouchableOpacity onPress={() => router.back()}>
             <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Opportunity Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="e.g. Summer Fitness Challenge"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
        </View>

         {/* Brand Name */}
         <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand / Host Name</Text>
          <Controller
            control={control}
            name="brandName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="My Brand"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.brandName && <Text style={styles.errorText}>{errors.brandName.message}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Challenge Type</Text>
          <Controller control={control} name="contestMode" render={({ field: { onChange, value } }) => (
            <View style={styles.typeContainer}>
              <TouchableOpacity style={[styles.typeChip, value === 'competitive_pot' && styles.typeChipSelected]} onPress={() => onChange('competitive_pot')}>
                <Text style={[styles.typeText, value === 'competitive_pot' && styles.typeTextSelected]}>Competitive pot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeChip, value === 'standard' && styles.typeChipSelected]} onPress={() => onChange('standard')}>
                <Text style={[styles.typeText, value === 'standard' && styles.typeTextSelected]}>Standard voucher</Text>
              </TouchableOpacity>
            </View>
          )} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Qualifying Products</Text>
          <Controller control={control} name="productId" render={({ field: { onChange, value } }) => (
            <View style={styles.productList}>{products?.map((product: any) => {
              const selected = productIds.includes(product.id) || value === product.id;
              return (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.typeChip, selected && styles.typeChipSelected]}
                  onPress={() => {
                    onChange(product.id);
                    toggleProduct(product.id);
                  }}
                >
                  <Text style={[styles.typeText, selected && styles.typeTextSelected]}>{product.title}</Text>
                </TouchableOpacity>
              );
            })}</View>
          )} />
          {errors.productId && <Text style={styles.errorText}>{errors.productId.message}</Text>}
          <Text style={styles.helperText}>Select one or more menu items / SKUs that count for entry.</Text>
        </View>

        {contestMode === 'competitive_pot' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prize Pot (BWP)</Text>
              <Controller control={control} name="potValue" render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} keyboardType="numeric" value={String(value)} onChangeText={text => onChange(Number(text) || 0)} />
              )} />
              <Text style={styles.helperText}>Top 5 share 40/25/15/10/10 of this pot as store vouchers.</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consolation Voucher (BWP)</Text>
              <Controller control={control} name="consolationVoucherValue" render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} keyboardType="numeric" value={String(value)} onChangeText={text => onChange(Number(text) || 0)} />
              )} />
              <Text style={styles.helperText}>Every approved entry that does not place still gets this.</Text>
            </View>
          </>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Voucher Value (BWP)</Text>
            <Controller control={control} name="rewardValue" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} keyboardType="numeric" value={String(value)} onChangeText={text => onChange(Number(text) || 0)} />
            )} />
            {errors.rewardValue && <Text style={styles.errorText}>{errors.rewardValue.message}</Text>}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reward Label</Text>
          <Controller
            control={control}
            name="reward"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={contestMode === 'competitive_pot' ? 'Auto-filled from pot if blank' : 'e.g. P50 off your next visit'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.reward && <Text style={styles.errorText}>{errors.reward.message}</Text>}
        </View>

        {/* Deadline */}
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateText}>{deadline.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setValue('deadline', selectedDate);
                }}
                />
            )}
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
                placeholder="Describe the challenge..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
        </View>

        {/* Requirements */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Requirements (One per line)</Text>
          <Controller
            control={control}
            name="requirements"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="1. Post a photo...&#10;2. Tag us..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
           {/* Helper text explaining generic requirements are okay */}
           <Text style={styles.helperText}>List what users need to do to complete the challenge.</Text>
        </View>

        
        {/* Image URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cover Image URL</Text>
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
           <Text style={styles.helperText}>Use a high-quality image to attract participants.</Text>
        </View>


        <TouchableOpacity 
            style={[styles.createButton, isPending && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
        >
          <Text style={styles.createButtonText}>
            {isPending ? "Creating..." : contestMode === 'competitive_pot' ? "Launch Competitive Challenge" : "Activate Creator Opportunity"}
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
  helperText: {
      fontFamily: NEO_THEME.fonts.regular,
      color: NEO_THEME.colors.grey,
      fontSize: 12,
      marginTop: 4,
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
  dateButton: {
    backgroundColor: 'white',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    alignItems: 'center',
  },
  dateText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
  },
  typeContainer: {
      flexDirection: 'row',
      gap: 8,
  },
  productList: { gap: 8 },
  typeChip: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: NEO_THEME.colors.grey,
      backgroundColor: 'white',
  },
  typeChipSelected: {
      backgroundColor: NEO_THEME.colors.primary,
      borderColor: NEO_THEME.colors.black,
      borderWidth: NEO_THEME.borders.width,
  },
  typeText: {
      fontFamily: NEO_THEME.fonts.regular,
      color: NEO_THEME.colors.black,
  },
  typeTextSelected: {
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
