import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
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
          <MaterialIcons name="star" size={14} color={NEO_THEME.colors.black} />
          <Text style={styles.featuredText}>FEATURED</Text>
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
              color={NEO_THEME.colors.grey}
            />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color={NEO_THEME.colors.grey} />
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
                    color={NEO_THEME.colors.black}
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

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  featuredCard: {
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.yellow,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: NEO_THEME.colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    zIndex: 1,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  featuredText: {
    color: NEO_THEME.colors.black,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
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
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginRight: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoryBadge: {
    backgroundColor: NEO_THEME.colors.pink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  eventDescription: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
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
    color: NEO_THEME.colors.grey,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  currency: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  price: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginLeft: 2,
    fontFamily: NEO_THEME.fonts.black,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availabilityText: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  lowAvailabilityText: {
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  soldOutBadge: {
    backgroundColor: NEO_THEME.colors.grey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  soldOutText: {
    color: NEO_THEME.colors.white,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
});
