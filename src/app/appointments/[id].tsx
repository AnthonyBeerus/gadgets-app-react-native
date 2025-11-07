import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database.types";

type AppointmentWithDetails = Tables<"service_booking"> & {
  service?: Tables<"service">;
  service_provider?: Tables<"service_provider">;
};

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      const appointmentId = Array.isArray(id) ? id[0] : id;
      const { data, error } = await supabase
        .from("service_booking")
        .select(
          `
          *,
          service (*),
          service_provider (*)
        `
        )
        .eq("id", parseInt(appointmentId))
        .single();

      if (error) throw error;
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      Alert.alert("Error", "Failed to load appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: cancelAppointment },
      ]
    );
  };

  const cancelAppointment = async () => {
    try {
      setIsCancelling(true);
      const appointmentId = Array.isArray(id) ? id[0] : id;
      const { error } = await supabase
        .from("service_booking")
        .update({ status: "cancelled" })
        .eq("id", parseInt(appointmentId));

      if (error) throw error;

      Alert.alert("Success", "Appointment cancelled successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Alert.alert("Error", "Failed to cancel appointment");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "completed":
        return "#6B7280";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: "Loading..." }} />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: "Error" }} />
        <Text style={styles.errorText}>Appointment not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const canCancel =
    appointment.status === "pending" || appointment.status === "confirmed";

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Appointment Details",
        }}
      />
      <ScrollView style={styles.scrollView}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(appointment.status) },
            ]}>
            <Text style={styles.statusText}>
              {appointment.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Service Information */}
        {appointment.service && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service</Text>
            <View style={styles.card}>
              <Text style={styles.serviceName}>{appointment.service.name}</Text>
              {appointment.service.description && (
                <Text style={styles.serviceDescription}>
                  {appointment.service.description}
                </Text>
              )}
              <Text style={styles.price}>
                ${appointment.service.price.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Provider Information */}
        {appointment.service_provider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provider</Text>
            <View style={styles.card}>
              <Text style={styles.providerName}>
                {appointment.service_provider.name}
              </Text>
              {appointment.service_provider.description && (
                <Text style={styles.specialization}>
                  {appointment.service_provider.description}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(appointment.booking_date)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>
                {formatTime(appointment.booking_time)}
              </Text>
            </View>
            {appointment.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{appointment.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID:</Text>
              <Text style={styles.detailValue}>{appointment.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booked on:</Text>
              <Text style={styles.detailValue}>
                {new Date(appointment.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {canCancel && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                isCancelling && styles.cancelButtonDisabled,
              ]}
              onPress={handleCancelAppointment}
              disabled={isCancelling}>
              {isCancelling ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  statusContainer: {
    padding: 16,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    flex: 2,
    textAlign: "right",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
