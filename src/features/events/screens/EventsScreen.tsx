import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { EventCard } from "../components/EventCard";
import { EVENT_CATEGORIES } from "../api/mock-events";
import { fetchEvents } from "../api/events";
import { Event } from "../types/event";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { addGems } from "../../gems/api/gems";
import { useGemStore } from "../../gems/store/gem-store";
import { HeaderRightGroup } from "../../../shared/components/ui/header-right-group";

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState<number | null>(null);
  const { fetchBalance } = useGemStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  const handleEventPress = (event: Event) => {
    // TODO: Open event details modal or navigate to event details
    console.log("Selected event:", event.title);
  };

  const handleCheckIn = async (event: Event) => {
    if (checkingIn) return;

    Alert.alert(
      "Check In",
      `Check in to "${event.title}" and earn 50 Gems?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Check In",
          onPress: async () => {
            try {
              setCheckingIn(event.id);
              await addGems(50, `Checked in to event: ${event.title}`, { eventId: event.id });
              await fetchBalance();
              Alert.alert("Success!", "You earned 50 Gems for checking in!");
            } catch (error) {
              console.error("Check-in error:", error);
              Alert.alert("Error", "Failed to check in. Please try again.");
            } finally {
              setCheckingIn(null);
            }
          },
        },
      ]
    );
  };

  const renderSmallTitle = () => (
    <Text style={styles.smallHeaderTitle}>EVENTS & SHOWS</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>EVENTS & SHOWS</Text>
      <Text style={styles.largeHeaderSubtitle}>
        Discover exciting events happening at Molapo Crossing
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <MaterialIcons
            name="event"
            size={24}
            color={NEO_THEME.colors.primary}
            style={styles.statsIcon}
          />
          <View>
            <Text style={styles.statsNumber}>{events.length}</Text>
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
              {events.reduce(
                (sum, event) => sum + event.availableTickets,
                0
              )}
            </Text>
            <Text style={styles.statsLabel}>TICKETS AVAILABLE</Text>
          </View>
        </View>
      </View>

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
    </View>
  );

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
      onCheckIn={() => handleCheckIn(item)}
    />
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
      smallHeaderRight={<HeaderRightGroup />}
      largeHeaderRight={<HeaderRightGroup />}
    >
      <View style={styles.content}>
        {loading ? (
             <View style={styles.emptyContainer}>
               <Text style={styles.emptyMessage}>Loading events...</Text>
             </View>
           ) : (
            <FlashList<Event>
              data={filteredEvents}
              renderItem={renderEventItem}
              // @ts-ignore: estimatedItemSize missing in FlashListProps type def
              estimatedItemSize={300}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="event-busy" size={64} color={NEO_THEME.colors.grey} />
                  <Text style={styles.emptyTitle}>NO EVENTS FOUND</Text>
                  <Text style={styles.emptyMessage}>
                    {error ? error : `No events available in the ${selectedCategory.toLowerCase()} category at the moment.`}
                  </Text>
                </View>
              }
              contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 20 }}
            />
           )}
      </View>
      
      {checkingIn && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }]}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.white} />
        </View>
      )}
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderSubtitle: {
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
