import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { getServiceCategories } from "../../../shared/api/api";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { CategoryCard } from "../components/CategoryCard";

const ServicesScreen = () => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = getServiceCategories();

  const handleCategoryPress = (categoryId: number, categoryName: string) => {
    router.push({
      pathname: "/services/category/[id]",
      params: {
        id: categoryId.toString(),
        categoryName: categoryName,
      },
    });
  };

  // Loading state
  if (categoriesLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load categories</Text>
      </View>
    );
  }

  const renderSmallTitle = () => (
    <Text style={styles.headerTitle}>BOOK SERVICES</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>BOOK SERVICES</Text>
      <Text style={styles.largeHeaderSubtitle}>
        Find and book appointments for beauty, health, sports, and more
      </Text>
    </View>
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      {/* Featured Banner */}
      <View style={styles.featuredBanner}>
        <Text style={styles.bannerTitle}>🎉 New Customer Special</Text>
        <Text style={styles.bannerText}>Get 20% off your first booking!</Text>
      </View>

      {/* Service Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>SERVICE CATEGORIES</Text>
        <View style={styles.categoriesGrid}>
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={{
                id: category.id.toString(),
                name: category.name,
                icon: category.icon,
                color: category.color,
                description: category.description,
              }}
              onPress={() => handleCategoryPress(category.id, category.name)}
            />
          ))}
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </AnimatedHeaderLayout>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  largeHeaderSubtitle: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
    lineHeight: 22,
  },
  featuredBanner: {
    backgroundColor: NEO_THEME.colors.yellow,
    marginHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    padding: 20,
    marginBottom: 24,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
  },
  bannerText: {
    fontSize: 14,
    color: NEO_THEME.colors.black,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bottomSpacing: {
    height: 100,
  },
  loadingText: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  errorText: {
    fontSize: 16,
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
});
