import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { createChallenge } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';

const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brandName: z.string().min(2, "Brand name required"),
  reward: z.string().min(3, "Reward description required"),
  deadline: z.date(),
  imageUrl: z.string().url(),
  requirements: z.string(), // We'll split this later
  category: z.string().min(3),
  type: z.enum(['free', 'paid', 'subscriber']),
  entryFee: z.number().optional(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

export default function CreateChallengeScreen() {
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { mutate: createChallengeMutation, isPending } = createChallenge();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      brandName: '', // Could pre-fill with shop name if available
      reward: '',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      requirements: '',
      category: 'General',
      type: 'free',
      entryFee: 0,
    }
  });

  const deadline = watch('deadline');
  const type = watch('type');

  const onSubmit = (data: ChallengeFormData) => {
    if (!merchantShopId) {
      Alert.alert("Error", "Merchant Shop ID not found");
      return;
    }

    // Convert requirements text to array (newline separated)
    const requirementsArray = data.requirements.split('\n').filter(r => r.trim().length > 0);

    createChallengeMutation({
      ...data,
      deadline: data.deadline.toISOString(),
      requirements: requirementsArray,
      shopId: merchantShopId,
    }, {
      onSuccess: () => {
        Alert.alert("Success", "Challenge created successfully!");
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
          <Text style={styles.label}>Challenge Title</Text>
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

        {/* Reward */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prize / Reward</Text>
          <Controller
            control={control}
            name="reward"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="e.g. $100 Gift Card"
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

        
         {/* Type & Fee */}
         <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeContainer}>
                    {['free', 'paid'].map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[
                                styles.typeChip,
                                type === t && styles.typeChipSelected
                            ]}
                            onPress={() => setValue('type', t as any)}
                        >
                            <Text style={[
                                styles.typeText,
                                type === t && styles.typeTextSelected
                            ]}>
                                {t.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {type === 'paid' && (
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Entry Fee ($)</Text>
                    <Controller
                        control={control}
                        name="entryFee"
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
                </View>
            )}
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
            {isPending ? "Creating..." : "Launch Challenge"}
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
