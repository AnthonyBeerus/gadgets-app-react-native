import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createServiceBooking } from "../../shared/api/api";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useNeoStyles } from "../../shared/hooks/useNeoStyles";
import { useTheme } from "../../shared/providers/theme-provider";

import { StaticHeader } from "../../shared/components/layout/StaticHeader";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const BookingModalScreen = () => {
  const insets = useSafeAreaInsets();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    serviceId: string;
    serviceName: string;
    price: string;
    duration: string;
    providerId: string;
    providerName: string;
  }>();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");

  const createBookingMutation = createServiceBooking();

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        serviceId: Number(params.serviceId),
        providerId: Number(params.providerId),
        bookingDate: selectedDate.toISOString().split("T")[0],
        bookingTime: selectedTime,
        durationMinutes: Number(params.duration),
        totalAmount: Number(params.price),
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        "Booking Confirmed!",
        `Your appointment for ${params.serviceName} has been booked for ${formatDate(
          selectedDate
        )} at ${selectedTime}.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "There was an error creating your booking. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="BOOK SERVICE" onBackPress={() => router.back()} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingTop: insets.top + 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{params.serviceName}</Text>
          <Text style={styles.providerName}>{params.providerName}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialIcons name="schedule" size={18} color={theme.colors.grey} />
              <Text style={styles.detailText}>{params.duration} min</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>${params.price}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT DATE</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="calendar-today" size={24} color={theme.colors.black} />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT TIME SLOT</Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADDITIONAL NOTES (OPTIONAL)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requests or notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingButtonContainer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedTime || createBookingMutation.isPending) && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={!selectedTime || createBookingMutation.isPending}
        >
          {createBookingMutation.isPending ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.bookButtonText}>CONFIRM BOOKING</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingModalScreen;

function createStyles(c: {
  backgroundLight: string;
  white: string;
  border: string;
  black: string;
  grey: string;
  yellow: string;
  primary: string;
}) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  serviceInfo: {
    backgroundColor: c.white,
    padding: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase" as const,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: c.grey,
    fontWeight: "700" as const,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  detailItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  detailText: {
    fontSize: 14,
    color: c.grey,
    marginLeft: 6,
    fontWeight: "700" as const,
    fontFamily: NEO_THEME.fonts.bold,
  },
  priceBadge: {
    backgroundColor: c.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: c.white,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.bold,
    marginLeft: 12,
  },
  timeSlotsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  timeSlot: {
    backgroundColor: c.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  timeSlotSelected: {
    backgroundColor: c.primary,
    borderColor: c.border,
    shadowOffset: { width: 0, height: 2 },
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  timeSlotTextSelected: {
    color: c.white,
  },
  notesInput: {
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    fontSize: 14,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
    minHeight: 100,
  },
  bottomSpacing: {
    height: 100,
  },
  bookingButtonContainer: {
    padding: 20,
    backgroundColor: c.white,
    borderTopWidth: 1,
    borderTopColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  bookButton: {
    backgroundColor: c.primary,
    borderRadius: NEO_THEME.borders.radius,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  bookButtonDisabled: {
    backgroundColor: c.grey,
    opacity: 0.5,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: c.white,
    fontFamily: NEO_THEME.fonts.black,
  },
  };
}
