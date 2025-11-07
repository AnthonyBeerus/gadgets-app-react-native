import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createServiceBooking } from "../../../api/api";
import { Tables } from "../../../types/database.types";

const COLORS = {
  primary: "#1BC464",
  secondary: "#FF6B6B",
  tertiary: "#4ECDC4",
  quaternary: "#45B7D1",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  border: "#E5E5E7",
};

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    price: number;
    duration_minutes: number;
    service_provider: {
      id: number;
      name: string;
    };
  } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  service,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");

  const createBookingMutation = createServiceBooking();

  // Generate available time slots (9 AM to 5 PM, every 30 minutes)
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
    if (!service || !selectedTime) {
      Alert.alert("Error", "Please select a date and time");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        serviceId: service.id,
        providerId: service.service_provider.id,
        bookingDate: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD format
        bookingTime: selectedTime,
        durationMinutes: service.duration_minutes,
        totalAmount: service.price,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        "Booking Confirmed!",
        `Your appointment for ${service.name} has been booked for ${formatDate(
          selectedDate
        )} at ${selectedTime}.`,
        [
          {
            text: "OK",
            onPress: () => {
              onClose();
              // Reset form
              setSelectedTime(null);
              setNotes("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days advance booking
    return maxDate;
  };

  if (!service) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.providerName}>
              {service.service_provider.name}
            </Text>
            <View style={styles.serviceDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>
                  {service.duration_minutes} min
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons
                  name="attach-money"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>${service.price}</Text>
              </View>
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.dateButtonText}>
                {formatDate(selectedDate)}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}>
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected,
                    ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any special requests or notes..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Booking Summary */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{service.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {formatDate(selectedDate)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>
                {selectedTime || "Not selected"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>
                {service.duration_minutes} minutes
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${service.price}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              !selectedTime && styles.bookButtonDisabled,
            ]}
            onPress={handleBooking}
            disabled={!selectedTime || createBookingMutation.isPending}>
            {createBookingMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.bookButtonText}>
                Book Appointment - ${service.price}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={getMinDate()}
            maximumDate={getMaxDate()}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  serviceInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    marginLeft: 12,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  timeSlotTextSelected: {
    color: COLORS.white,
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});

export default BookingModal;
