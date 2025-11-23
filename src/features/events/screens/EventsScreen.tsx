import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { EventCard } from "../components/EventCard";
import { UPCOMING_EVENTS, EVENT_CATEGORIES } from "../api/mock-events";
import { Event } from "../types/event";

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents =
    selectedCategory === "All"
      ? UPCOMING_EVENTS
      : UPCOMING_EVENTS.filter((event) => event.category === selectedCategory);

  const handleEventPress = (event: Event) => {
    // TODO: Open event details modal or navigate to event details
    console.log("Selected event:", event.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EVENTS & SHOWS</Text>
          <Text style={styles.headerSubtitle}>
            Discover exciting events happening at Molapo Crossing
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <MaterialIcons
              name="event"
              size={24}
              color={NEO_THEME.colors.primary}
              style={styles.statsIcon}
            />
            <View>
              <Text style={styles.statsNumber}>{UPCOMING_EVENTS.length}</Text>
              <Text style={styles.statsLabel}>UPCOMING EVENTS</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <MaterialIcons
              name="confirmation-number"
              size={24}
              color={NEO_THEME.colors.yellow}
              style={styles.statsIcon}
            />
            <View>
              <Text style={styles.statsNumber}>
                {UPCOMING_EVENTS.reduce(
                  (sum, event) => sum + event.availableTickets,
                  0
                )}
              </Text>
              <Text style={styles.statsLabel}>TICKETS AVAILABLE</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollView}>
            {EVENT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}>
                  {category.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events List */}
        <View style={styles.eventsSection}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={64} color={NEO_THEME.colors.grey} />
              <Text style={styles.emptyTitle}>NO EVENTS FOUND</Text>
              <Text style={styles.emptyMessage}>
                No events available in the {selectedCategory.toLowerCase()}{" "}
                category at the moment.
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  statsIcon: {
    marginRight: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  statsLabel: {
    fontSize: 11,
    color: NEO_THEME.colors.black,
    marginTop: 2,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryScrollView: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  activeCategoryButton: {
    backgroundColor: NEO_THEME.colors.primary,
    borderColor: NEO_THEME.colors.black,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.bold,
  },
  activeCategoryText: {
    color: NEO_THEME.colors.white,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  emptyMessage: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    lineHeight: 22,
  },
});
