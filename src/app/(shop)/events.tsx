import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

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
  purple: "#8B5CF6",
  orange: "#F59E0B",
  success: "#34C759",
};

// Sample upcoming events at Molapo Crossing Mall
const upcomingEvents = [
  {
    id: 1,
    title: "Botswana Music Festival",
    description: "Annual celebration featuring local and international artists",
    venue: "Molapo Piazza",
    date: "2025-10-15",
    time: "18:00",
    category: "Music",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 150,
    availableTickets: 450,
    totalTickets: 500,
    featured: true,
    tags: ["Live Music", "Festival", "Local Artists"],
  },
  {
    id: 2,
    title: "Comedy Night with Tebogo Lethabo",
    description: "Stand-up comedy featuring Botswana's top comedians",
    venue: "Theater",
    date: "2025-09-25",
    time: "20:00",
    category: "Comedy",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 80,
    availableTickets: 120,
    totalTickets: 150,
    featured: false,
    tags: ["Comedy", "Stand-up", "Entertainment"],
  },
  {
    id: 3,
    title: "Contemporary Art Exhibition Opening",
    description: "Showcase of contemporary African art by emerging artists",
    venue: "Art Gallery",
    date: "2025-09-30",
    time: "17:00",
    category: "Art",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 50,
    availableTickets: 75,
    totalTickets: 80,
    featured: true,
    tags: ["Art", "Exhibition", "Culture"],
  },
  {
    id: 4,
    title: "Business Summit 2025",
    description: "Annual business conference featuring industry leaders",
    venue: "Conference Room",
    date: "2025-10-05",
    time: "09:00",
    category: "Business",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 250,
    availableTickets: 45,
    totalTickets: 60,
    featured: false,
    tags: ["Business", "Conference", "Networking"],
  },
  {
    id: 5,
    title: "Traditional Dance Performance",
    description: "Cultural performance celebrating Botswana heritage",
    venue: "Molapo Piazza",
    date: "2025-10-20",
    time: "16:00",
    category: "Culture",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 60,
    availableTickets: 200,
    totalTickets: 300,
    featured: false,
    tags: ["Culture", "Dance", "Traditional"],
  },
  {
    id: 6,
    title: "Movie Premiere: African Stories",
    description: "Exclusive premiere of the latest African cinema",
    venue: "Theater",
    date: "2025-10-12",
    time: "19:30",
    category: "Film",
    image: require("../../../assets/images/hero.png"),
    ticketPrice: 70,
    availableTickets: 100,
    totalTickets: 120,
    featured: true,
    tags: ["Film", "Premiere", "Cinema"],
  },
];

const categories = [
  { name: "All", icon: "event", color: COLORS.primary },
  { name: "Music", icon: "music-note", color: COLORS.purple },
  { name: "Comedy", icon: "theater-comedy", color: COLORS.secondary },
  { name: "Art", icon: "palette", color: COLORS.tertiary },
  { name: "Business", icon: "business", color: COLORS.quaternary },
  { name: "Culture", icon: "groups", color: COLORS.orange },
  { name: "Film", icon: "movie", color: "#DC2626" },
];

const EventCard = ({
  event,
  onBuyTickets,
}: {
  event: any;
  onBuyTickets: () => void;
}) => {
  const availabilityPercentage =
    (event.availableTickets / event.totalTickets) * 100;
  const isAlmostSoldOut = availabilityPercentage < 20;
  const isSoldOut = event.availableTickets === 0;

  return (
    <View style={[styles.eventCard, event.featured && styles.featuredCard]}>
      {event.featured && (
        <View style={styles.featuredBadge}>
          <MaterialIcons name="star" size={14} color={COLORS.white} />
        </View>
      )}

      <Image source={event.image} style={styles.eventImage} />

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="place"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString("en-GB")} • {event.time}
            </Text>
          </View>
        </View>

        <View style={styles.ticketInfo}>
          <View>
            <Text style={styles.ticketPrice}>P{event.ticketPrice}</Text>
            {isAlmostSoldOut && !isSoldOut && (
              <Text style={styles.urgencyText}>
                Only {event.availableTickets} left!
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.buyButton,
              isSoldOut && styles.soldOutButton,
              isAlmostSoldOut && !isSoldOut && styles.almostSoldOutButton,
            ]}
            onPress={onBuyTickets}
            disabled={isSoldOut}>
            {isSoldOut ? (
              <Text style={styles.soldOutText}>Sold Out</Text>
            ) : (
              <>
                <MaterialIcons
                  name="confirmation-number"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={styles.buyButtonText}>Buy</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: any) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.categoryFilter}
    contentContainerStyle={styles.categoryFilterContent}>
    {categories.map((category: any, index: number) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.categoryButton,
          selectedCategory === category.name && styles.activeCategoryButton,
        ]}
        onPress={() => onSelectCategory(category.name)}>
        <Text
          style={[
            styles.categoryButtonText,
            selectedCategory === category.name && styles.activeCategoryText,
          ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const filteredEvents =
    selectedCategory === "All"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === selectedCategory);

  const featuredEvents = upcomingEvents.filter((event) => event.featured);
  const totalEvents = upcomingEvents.length;
  const totalAvailableTickets = upcomingEvents.reduce(
    (sum, event) => sum + event.availableTickets,
    0
  );

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
            {totalEvents} events • {totalAvailableTickets} tickets available
          </Text>
        </View>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Events Section */}
        <View style={styles.eventsSection}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBuyTickets={() => handleBuyTickets(event)}
            />
          ))}
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
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  headerIcon: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
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
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statsTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  venuesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  venueCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  venueImageContainer: {
    position: "relative",
    height: 160,
  },
  venueImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 8,
  },
  venueContent: {
    padding: 20,
  },
  venueHeader: {
    marginBottom: 8,
  },
  venueName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  venueType: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  venueLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  venueDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  venueDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  contactSection: {
    margin: 20,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: COLORS.quaternary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  // Event-specific styles
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.secondary,
    padding: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  eventImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: "500",
  },
  ticketInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  urgencyText: {
    fontSize: 11,
    color: COLORS.orange,
    fontWeight: "600",
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  soldOutButton: {
    backgroundColor: COLORS.textSecondary,
  },
  soldOutText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  almostSoldOutButton: {
    backgroundColor: COLORS.orange,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 13,
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
});
