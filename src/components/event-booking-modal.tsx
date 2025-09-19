import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEventBooking } from "../api/api";

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
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
};

interface EventBookingModalProps {
  visible: boolean;
  venue: any;
  onClose: () => void;
}

const eventTypes = [
  "Wedding",
  "Conference",
  "Workshop",
  "Art Exhibition",
  "Theater Performance",
  "Corporate Meeting",
  "Product Launch",
  "Birthday Party",
  "Anniversary",
  "Cultural Event",
  "Other",
];

export default function EventBookingModal({
  visible,
  venue,
  onClose,
}: EventBookingModalProps) {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [estimatedGuests, setEstimatedGuests] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [notes, setNotes] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEventTypes, setShowEventTypes] = useState(false);

  const createBookingMutation = createEventBooking();

  const calculateEstimatedPrice = () => {
    if (!venue?.priceRange) return 0;
    // Extract first price from range like "P2,000 - P8,000"
    const match = venue.priceRange.match(/P([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ""));
    }
    return 2000; // Default
  };

  const handleBookEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert("Error", "Please enter an event name");
      return;
    }
    if (!eventType) {
      Alert.alert("Error", "Please select an event type");
      return;
    }
    if (!estimatedGuests || parseInt(estimatedGuests) <= 0) {
      Alert.alert("Error", "Please enter a valid number of guests");
      return;
    }
    if (!contactPhone.trim()) {
      Alert.alert("Error", "Please enter a contact phone number");
      return;
    }
    if (!contactEmail.trim()) {
      Alert.alert("Error", "Please enter a contact email");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        venueId: venue.id,
        eventName: eventName.trim(),
        eventType,
        eventDate: eventDate.toISOString().split("T")[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        estimatedGuests: parseInt(estimatedGuests),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        totalPrice: calculateEstimatedPrice(),
        specialRequirements: specialRequirements.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        "Booking Submitted!",
        "Your event booking request has been submitted. Our events team will contact you soon to confirm details.",
        [{ text: "OK", onPress: onClose }]
      );

      // Reset form
      setEventName("");
      setEventType("");
      setEventDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setEstimatedGuests("");
      setContactPhone("");
      setContactEmail("");
      setSpecialRequirements("");
      setNotes("");
    } catch (error) {
      Alert.alert("Error", "Failed to submit booking. Please try again.");
    }
  };

  if (!venue) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Book {venue.name}</Text>
            <Text style={styles.headerSubtitle}>{venue.type}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Event Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Event Name *</Text>
            <TextInput
              style={styles.textInput}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Enter your event name"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {/* Event Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Event Type *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowEventTypes(!showEventTypes)}>
              <Text
                style={[styles.selectText, !eventType && styles.placeholder]}>
                {eventType || "Select event type"}
              </Text>
              <MaterialIcons
                name={
                  showEventTypes ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            {showEventTypes && (
              <View style={styles.optionsContainer}>
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.optionItem}
                    onPress={() => {
                      setEventType(type);
                      setShowEventTypes(false);
                    }}>
                    <Text style={styles.optionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Event Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Event Date *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.selectText}>
                {eventDate.toLocaleDateString()}
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setEventDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Time Selection */}
          <View style={styles.timeContainer}>
            <View style={styles.timeField}>
              <Text style={styles.fieldLabel}>Start Time *</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowStartTimePicker(true)}>
                <Text style={styles.selectText}>
                  {startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <MaterialIcons
                  name="access-time"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowStartTimePicker(false);
                    if (selectedTime) setStartTime(selectedTime);
                  }}
                />
              )}
            </View>

            <View style={styles.timeField}>
              <Text style={styles.fieldLabel}>End Time *</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowEndTimePicker(true)}>
                <Text style={styles.selectText}>
                  {endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <MaterialIcons
                  name="access-time"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowEndTimePicker(false);
                    if (selectedTime) setEndTime(selectedTime);
                  }}
                />
              )}
            </View>
          </View>

          {/* Estimated Guests */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Estimated Number of Guests *</Text>
            <TextInput
              style={styles.textInput}
              value={estimatedGuests}
              onChangeText={setEstimatedGuests}
              placeholder="Enter number of guests"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
            />
            <Text style={styles.capacityHint}>
              Venue capacity: {venue.capacity}
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Contact Phone *</Text>
            <TextInput
              style={styles.textInput}
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Contact Email *</Text>
            <TextInput
              style={styles.textInput}
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Special Requirements */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Special Requirements</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              placeholder="Any special requirements or equipment needed?"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Additional Notes */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional information about your event"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Price Estimate */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Estimated Price Range</Text>
            <Text style={styles.priceText}>{venue.priceRange}</Text>
            <Text style={styles.priceNote}>
              Final pricing will be confirmed by our events team based on your
              specific requirements.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleBookEvent}
            disabled={createBookingMutation.isPending}>
            {createBookingMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialIcons name="event" size={20} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Submit Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginVertical: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  selectText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholder: {
    color: COLORS.textSecondary,
  },
  optionsContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  timeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  timeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  capacityHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  priceContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  priceNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
