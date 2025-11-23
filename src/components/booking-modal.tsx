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
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createServiceBooking } from "../shared/api/api";
import { useBookingStore } from "../store/booking-store";

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

const BookingModal: React.FC = () => {
  const {
    isModalVisible,
    selectedService: service,
    shopContext: shop,
    selectedDate,
    selectedTime,
    notes,
    closeBookingModal,
    setSelectedDate,
    setSelectedTime,
    setNotes,
    resetBookingForm,
    getMinDate,
    getMaxDate,
    formatDate,
    generateTimeSlots,
  } = useBookingStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const createBookingMutation = createServiceBooking();

  // Debug logging
  React.useEffect(() => {
    if (isModalVisible) {
      console.log("BookingModal - Modal opened");
      console.log("BookingModal - Service:", service);
      console.log("BookingModal - Shop:", shop);
    }
  }, [isModalVisible, service, shop]);

  const timeSlots = generateTimeSlots();

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
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
              closeBookingModal();
              resetBookingForm();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    }
  };

  if (!service) {
    console.log("BookingModal - No service data, returning null");
    return null;
  }

  console.log("BookingModal - Rendering modal with service:", service.name);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeBookingModal}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={closeBookingModal}
            style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Shop Info */}
          {shop && (
            <View style={styles.shopInfo}>
              {shop.logo_url && (
                <Image
                  source={{ uri: shop.logo_url }}
                  style={styles.shopLogo}
                  resizeMode="contain"
                />
              )}
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{shop.name}</Text>
                {shop.location && (
                  <View style={styles.shopLocationRow}>
                    <MaterialIcons
                      name="location-on"
                      size={14}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.shopLocation}>{shop.location}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>
              {service?.name || "Unknown Service"}
            </Text>
            <Text style={styles.providerName}>
              {service?.service_provider?.name || "Unknown Provider"}
            </Text>
            <View style={styles.serviceDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>
                  {service?.duration_minutes || 0} min
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons
                  name="attach-money"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>${service?.price || 0}</Text>
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
            <View style={styles.notesContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any special requests or notes..."
                placeholderTextColor={COLORS.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Booking Summary */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            {shop && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shop:</Text>
                <Text style={styles.summaryValue}>{shop.name}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{service?.name || "N/A"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Provider:</Text>
              <Text style={styles.summaryValue}>
                {service?.service_provider?.name || "N/A"}
              </Text>
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
                {service?.duration_minutes || 0} minutes
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${service?.price || 0}</Text>
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
  shopInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shopLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  shopLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  shopLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
  notesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesInput: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 20,
    minHeight: 60,
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
