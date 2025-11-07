import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  primary: "#9C27B0",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#8E8E93",
  lightGray: "#F2F2F7",
  border: "#E5E5EA",
  text: "#1C1C1E",
  secondaryText: "#6D6D80",
  background: "#F8F9FA",
};

// Mock data for events
const upcomingEvents = [
  {
    id: 1,
    title: "Botswana Music Festival",
    date: "2025-02-15",
    time: "18:00",
    venue: "Main Arena",
    category: "Music",
    price: 150,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    description:
      "Experience the best of Botswana's music scene with top local and international artists.",
    totalTickets: 500,
    availableTickets: 120,
    featured: true,
  },
  {
    id: 2,
    title: "Art Exhibition Opening",
    date: "2025-02-18",
    time: "17:30",
    venue: "Gallery Space",
    category: "Art",
    price: 75,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    description:
      "Discover contemporary African art from emerging and established artists.",
    totalTickets: 100,
    availableTickets: 45,
    featured: false,
  },
  {
    id: 3,
    title: "Comedy Night",
    date: "2025-02-20",
    time: "20:00",
    venue: "Entertainment Hall",
    category: "Comedy",
    price: 80,
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
    description:
      "A night of laughter with Botswana's funniest comedians and special guests.",
    totalTickets: 200,
    availableTickets: 0,
    featured: false,
  },
  {
    id: 4,
    title: "Fashion Show",
    date: "2025-02-22",
    time: "19:00",
    venue: "Central Court",
    category: "Fashion",
    price: 120,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
    description:
      "Showcasing the latest collections from top African fashion designers.",
    totalTickets: 150,
    availableTickets: 15,
    featured: false,
  },
  {
    id: 5,
    title: "Business Summit 2025",
    date: "2025-02-25",
    time: "08:00",
    venue: "Conference Center",
    category: "Business",
    price: 200,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    description:
      "Connect with industry leaders and explore business opportunities in Botswana.",
    totalTickets: 300,
    availableTickets: 180,
    featured: true,
  },
];

const categories = ["All", "Music", "Art", "Comedy", "Fashion", "Business"];

// Event Card Component
const EventCard = ({ event, onPress }: { event: any; onPress: () => void }) => {
  const availabilityPercentage =
    (event.availableTickets / event.totalTickets) * 100;
  const isAlmostSoldOut = availabilityPercentage < 20;
  const isSoldOut = event.availableTickets === 0;

  return (
    <TouchableOpacity
      style={[styles.eventCard, event.featured && styles.featuredCard]}
      onPress={onPress}>
      {event.featured && (
        <View style={styles.featuredBadge}>
          <MaterialIcons name="star" size={14} color={COLORS.white} />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}

      <Image source={{ uri: event.image }} style={styles.eventImage} />

      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={COLORS.gray}
            />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color={COLORS.gray} />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>P</Text>
            <Text style={styles.price}>{event.price}</Text>
          </View>

          <View style={styles.availabilityContainer}>
            {isSoldOut ? (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>SOLD OUT</Text>
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.availabilityText,
                    isAlmostSoldOut && styles.lowAvailabilityText,
                  ]}>
                  {event.availableTickets} left
                </Text>
                {isAlmostSoldOut && (
                  <MaterialIcons
                    name="warning"
                    size={16}
                    color={COLORS.warning}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents =
    selectedCategory === "All"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === selectedCategory);

  const handleEventPress = (event: any) => {
    // TODO: Open event details modal or navigate to event details
    console.log("Selected event:", event.title);
  };

  const handleBuyTickets = (event: any) => {
    // TODO: Open ticket purchase modal
    console.log("Buy tickets for:", event.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events & Shows</Text>
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
              color={COLORS.primary}
              style={styles.statsIcon}
            />
            <View>
              <Text style={styles.statsNumber}>{upcomingEvents.length}</Text>
              <Text style={styles.statsLabel}>Upcoming Events</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <MaterialIcons
              name="confirmation-number"
              size={24}
              color={COLORS.success}
              style={styles.statsIcon}
            />
            <View>
              <Text style={styles.statsNumber}>
                {upcomingEvents.reduce(
                  (sum, event) => sum + event.availableTickets,
                  0
                )}
              </Text>
              <Text style={styles.statsLabel}>Tickets Available</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollView}>
            {categories.map((category) => (
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
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events List */}
        <View style={styles.eventsSection}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={64} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No Events Found</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
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
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsIcon: {
    marginRight: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statsLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
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
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  activeCategoryText: {
    color: COLORS.white,
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    gap: 4,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  eventInfo: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.secondaryText,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 6,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 2,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availabilityText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  lowAvailabilityText: {
    color: COLORS.warning,
    fontWeight: "600",
  },
  soldOutBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  soldOutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
});
