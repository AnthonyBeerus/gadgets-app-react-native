import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { createEvent } from '../../shared/api/api';
import { useAuth } from '../../shared/providers/auth-provider';
import DateTimePicker from '@react-native-community/datetimepicker';

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  price: z.string().transform((val) => Number(val) || 0),
  totalTickets: z.string().transform((val) => Number(val) || 0),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventScreen() {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { merchantShopId } = useAuth();
  const { mutate: createEventMutation, isPending } = createEvent();
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 
      price: 0,
      totalTickets: 100,
    }
  });

  const onSubmit = (data: EventFormData) => {
    if (!merchantShopId) {
      Alert.alert("Error", "Merchant Shop ID not found");
      return;
    }

    createEventMutation({
      ...data,
      date: date.toISOString(),
      shopId: merchantShopId,
    }, {
      onSuccess: () => {
        Alert.alert("Success", "Event created successfully!");
        router.back();
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      }
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'android') {
          setShowDatePicker(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Event</Text>
        <TouchableOpacity onPress={() => router.back()}>
             <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="e.g. Summer Sale Party"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{date.toLocaleString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode={'datetime'}
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="e.g. 123 Main St, New York"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
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
                placeholder="Describe your event..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
        </View>

        {/* Price */}
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
                    onChangeText={onChange}
                />
                )}
            />
             {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Total Tickets</Text>
            <Controller
                control={control}
                name="totalTickets"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="100"
                    keyboardType="numeric"
                    value={value?.toString()}
                    onChangeText={onChange}
                />
                )}
            />
             {errors.totalTickets && <Text style={styles.errorText}>{errors.totalTickets.message}</Text>}
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

        <TouchableOpacity 
            style={[styles.createButton, isPending && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
        >
          <Text style={styles.createButtonText}>
            {isPending ? "Creating..." : "Create Event"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function createStyles(c) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  header: {
    paddingTop: 60,
    padding: 20,
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
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
    color: c.grey,
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
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.regular,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: NEO_THEME.borders.radius,
    padding: 12,
    alignItems: 'center',
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
  },
  dateText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
  },
  
  
  errorText: {
    color: 'red',
    marginTop: 4,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
  },
  createButton: {
    backgroundColor: c.primary,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.border,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  disabledButton: {
      opacity: 0.7,
  },
  createButtonText: {
    color: c.white,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 18,
  },
  };
}
