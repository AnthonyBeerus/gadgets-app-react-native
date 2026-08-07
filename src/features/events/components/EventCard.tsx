import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import React from 'react';
import { Image } from 'expo-image';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onCheckIn?: () => void;
}

export const EventCard = ({ event, onPress, onCheckIn }: EventCardProps) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
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
          <MaterialIcons name="star" size={14} color={theme.colors.black} />
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
      )}

      <Image 
        source={{ uri: event.image }} 
        style={styles.eventImage} 
        contentFit="cover"
        transition={200}
      />

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
              color={theme.colors.grey}
            />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color={theme.colors.grey} />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>P</Text>
            <Text style={styles.price}>{event.price}</Text>
          </View>

          {onCheckIn && (
            <TouchableOpacity 
              style={styles.checkInButton}
              onPress={(e) => {
                e.stopPropagation();
                onCheckIn();
              }}
            >
              <MaterialIcons name="check-circle" size={16} color={theme.colors.white} />
              <Text style={styles.checkInText}>CHECK IN (+50 GEMS)</Text>
            </TouchableOpacity>
          )}

          {!onCheckIn && (
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
                      color={theme.colors.black}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function createStyles(c) {
  return {
  eventCard: {
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  featuredCard: {
    borderWidth: 1,
    borderColor: c.yellow,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: c.yellow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    zIndex: 1,
    gap: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  featuredText: {
    color: c.black,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
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
    fontWeight: '600',
    color: c.black,
    marginRight: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoryBadge: {
    backgroundColor: c.pink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  eventDescription: {
    fontSize: 14,
    color: c.grey,
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
    color: c.grey,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: c.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: c.black,
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
    color: c.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  lowAvailabilityText: {
    color: c.black,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  soldOutBadge: {
    backgroundColor: c.grey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
  },
  soldOutText: {
    color: c.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  checkInButton: {
    backgroundColor: c.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    gap: 4,
  },
  checkInText: {
    color: c.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  };
}
