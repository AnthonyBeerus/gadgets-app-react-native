import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NEO_THEME } from "../shared/constants/neobrutalism";
import { useNeoStyles } from '../shared/hooks/useNeoStyles';
import { useTheme } from '../shared/providers/theme-provider';

const { height } = Dimensions.get("window");

interface Mall {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  image_url: string;
  is_physical: boolean;
  is_featured: boolean;
}

interface MallSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  malls: Mall[];
  selectedMallId: number | null;
  onSelectMall: (mallId: number | null) => void;
}

export default function MallSelectorModal({
  visible,
  onClose,
  malls,
  selectedMallId,
  onSelectMall,
}: MallSelectorModalProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const handleSelectMall = (mallId: number | null) => {
    onSelectMall(mallId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SELECT LOCATION</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* All Locations Option */}
            <TouchableOpacity
              style={[
                styles.mallCard,
                selectedMallId === null && styles.selectedMallCard,
              ]}
              onPress={() => handleSelectMall(null)}
              activeOpacity={0.7}>
              <View style={styles.mallCardLeft}>
                <View
                  style={[
                    styles.mallIconContainer,
                    selectedMallId === null && styles.selectedMallIcon,
                  ]}>
                  <Ionicons
                    name="apps"
                    size={32}
                    color={selectedMallId === null ? theme.colors.white : theme.colors.primary}
                  />
                </View>
                <View style={styles.mallInfo}>
                  <Text style={styles.mallName}>ALL LOCATIONS</Text>
                  <Text style={styles.mallLocation}>BROWSE ALL SHOPS</Text>
                  <Text style={styles.mallDescription}>
                    View shops from all malls and marketplaces
                  </Text>
                </View>
              </View>
              {selectedMallId === null && (
                <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
              )}
            </TouchableOpacity>

            {/* Individual Mall Cards */}
            {malls.map((mall) => (
              <TouchableOpacity
                key={mall.id}
                style={[
                  styles.mallCard,
                  selectedMallId === mall.id && styles.selectedMallCard,
                ]}
                onPress={() => handleSelectMall(mall.id)}
                activeOpacity={0.7}>
                <View style={styles.mallCardLeft}>
                  <View
                    style={[
                      styles.mallIconContainer,
                      selectedMallId === mall.id && styles.selectedMallIcon,
                    ]}>
                    {mall.image_url ? (
                      <Image
                        source={{ uri: mall.image_url }}
                        style={styles.mallImage}
                      />
                    ) : (
                      <Ionicons
                        name={mall.is_physical ? "storefront" : "globe"}
                        size={32}
                        color={selectedMallId === mall.id ? theme.colors.white : theme.colors.primary}
                      />
                    )}
                  </View>
                  <View style={styles.mallInfo}>
                    <View style={styles.mallNameRow}>
                      <Text style={styles.mallName}>{mall.name}</Text>
                      {mall.is_featured && (
                        <View style={styles.featuredBadge}>
                          <Ionicons name="star" size={12} color={theme.colors.black} />
                          <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.locationRow}>
                      <Ionicons
                        name={mall.is_physical ? "location" : "globe"}
                        size={14}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.mallLocation}>{mall.location}</Text>
                    </View>
                    {mall.description && (
                      <Text style={styles.mallDescription} numberOfLines={2}>
                        {mall.description}
                      </Text>
                    )}
                  </View>
                </View>
                {selectedMallId === mall.id && (
                  <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


function createStyles(c) {
  return {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: c.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: height * 0.85,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: c.border,
  },
  handleBar: {
    width: 60,
    height: 6,
    backgroundColor: c.black,
    borderRadius: 0,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: c.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  mallCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: c.backgroundLight,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 4,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  selectedMallCard: {
    backgroundColor: c.yellow,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  mallCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mallIconContainer: {
    width: 64,
    height: 64,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: c.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedMallIcon: {
    backgroundColor: c.primary,
  },
  mallImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mallInfo: {
    flex: 1,
  },
  mallNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  mallName: {
    fontSize: 18,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.yellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  mallLocation: {
    fontSize: 14,
    color: c.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: "uppercase",
  },
  mallDescription: {
    fontSize: 13,
    color: c.grey,
    lineHeight: 18,
    marginTop: 4,
  },
  };
}
