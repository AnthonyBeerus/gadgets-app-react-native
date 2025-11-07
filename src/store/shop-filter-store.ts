import { create } from "zustand";

interface ShopFilterState {
  selectedMall: number | null;
  selectedCategory: number | null;
  selectedFeature: string | null;
  searchQuery: string;

  // Actions
  setSelectedMall: (mallId: number | null) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setSelectedFeature: (feature: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  clearAllExceptMall: () => void;
}

export const useShopFilterStore = create<ShopFilterState>((set) => ({
  // Initial state
  selectedMall: 1, // Default to Molapo Crossing
  selectedCategory: null,
  selectedFeature: null,
  searchQuery: "",

  // Actions
  setSelectedMall: (mallId) =>
    set({
      selectedMall: mallId,
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
    }),

  setSelectedCategory: (categoryId) =>
    set({
      selectedCategory: categoryId,
      selectedFeature: null,
      searchQuery: "",
    }),

  setSelectedFeature: (feature) =>
    set({
      selectedFeature: feature,
      selectedCategory: null,
      searchQuery: "",
    }),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  resetFilters: () =>
    set({
      selectedMall: 1,
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
    }),

  clearAllExceptMall: () =>
    set((state) => ({
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
      selectedMall: state.selectedMall,
    })),
}));
