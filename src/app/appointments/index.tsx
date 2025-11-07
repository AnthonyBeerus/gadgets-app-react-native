import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../providers/auth-provider";
import { getShopAppointments } from "../../api/shops";
import { format } from "date-fns";

const COLORS = {
  primary: "#9C27B0",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  border: "#E5E5E7",
  success: "#1BC464",
  warning: "#FFA500",
  error: "#FF6B6B",
};

const STATUS_COLORS = {
  pending: COLORS.warning,
  confirmed: COLORS.success,
  completed: COLORS.text,
  cancelled: COLORS.error,
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [session?.user?.id]);

  const loadAppointments = async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getShopAppointments(session.user.id);
      setAppointments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAppointment = ({ item }: { item: any }) => {
    const appointmentDate = new Date(item.appointment_date);
    const statusColor =
      STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || COLORS.text;

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => router.push(`/appointments/${item.id}`)}
        activeOpacity={0.7}>
        <View style={styles.appointmentHeader}>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{item.shop?.name || "Shop"}</Text>
            <Text style={styles.serviceType}>{item.service_type}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailText}>
              {format(appointmentDate, "MMM dd, yyyy")}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons
              name="schedule"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailText}>{item.appointment_time}</Text>
          </View>

          {item.duration_minutes && (
            <View style={styles.detailRow}>
              <MaterialIcons
                name="hourglass-empty"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.detailText}>{item.duration_minutes} min</Text>
            </View>
          )}
        </View>

        {item.price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.priceValue}>${item.price}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="event-busy" size={64} color={COLORS.border} />
      <Text style={styles.emptyTitle}>No Appointments</Text>
      <Text style={styles.emptyText}>
        You haven't booked any appointments yet
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/(shop)/services")}>
        <Text style={styles.browseButtonText}>Browse Services</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen options={{ title: "My Appointments" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen options={{ title: "My Appointments" }} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error Loading Appointments</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "My Appointments",
          headerShown: true,
          headerLargeTitle: true,
        }}
      />

      <FlatList
        data={appointments || []}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
  },
  appointmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
