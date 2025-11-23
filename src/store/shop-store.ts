import { create } from "zustand";
import { Tables } from "../shared/types/database.types";
import {
  getShops,
  getShopsByMall,
  getShopsByCategory,
  getShopsWithFeature,
  searchShops,
  getCategoriesWithShopFeatures,
  getMalls,
} from "../shared/api/shops";

type Shop = Tables<"shops">;
type Category = Tables<"category">;
type Mall = Tables<"malls">;

interface ShopWithCategory extends Shop {
  category: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
  };
  products?: { count: number }[];
}

interface ShopStoreState {
  // Data
  shops: ShopWithCategory[];
  allShops: ShopWithCategory[]; // Keep unfiltered copy for reference
  categories: Category[];
  malls: Mall[];

  // Filters
  selectedMall: number | null;
  selectedCategory: number | null;
  selectedFeature: string | null;
  searchQuery: string;

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  loadInitialData: () => Promise<void>;
  setShops: (shops: ShopWithCategory[]) => void;

  // Filter actions (these will trigger data fetching)
  setSelectedMall: (mallId: number | null) => Promise<void>;
  setSelectedCategory: (categoryId: number | null) => Promise<void>;
  setSelectedFeature: (feature: string | null) => Promise<void>;
  setSearchQuery: (query: string) => Promise<void>;

  // Utility actions
  resetFilters: () => Promise<void>;
  clearAllExceptMall: () => Promise<void>;
}

export const useShopStore = create<ShopStoreState>((set, get) => ({
  // Initial state
  shops: [],
  allShops: [],
  categories: [],
  malls: [],
  selectedMall: 1, // Default to Molapo Crossing
  selectedCategory: null,
  selectedFeature: null,
  searchQuery: "",
  loading: false,
  error: null,

  // Load initial data (categories, malls, and shops for default mall)
  loadInitialData: async () => {
    try {
      set({ loading: true, error: null });

      const [categoriesData, mallsData] = await Promise.all([
        getCategoriesWithShopFeatures(),
        getMalls(),
      ]);

      // Load shops for default mall (Molapo Crossing)
      const shopsData = await getShopsByMall(1);

      set({
        categories: categoriesData,
        malls: mallsData || [],
        shops: shopsData as ShopWithCategory[],
        allShops: shopsData as ShopWithCategory[],
        loading: false,
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
      set({ error: "Failed to load shops data", loading: false });
    }
  },

  // Manually set shops (for advanced use cases)
  setShops: (shops) => set({ shops }),

  // Set selected mall and fetch its shops
  setSelectedMall: async (mallId) => {
    // CRITICAL: Clear shops synchronously BEFORE any async operations
    // This prevents race conditions where old mall data appears briefly
    set({
      selectedMall: mallId,
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
      loading: true,
      error: null,
      shops: [], // Clear immediately - this is synchronous
      allShops: [], // Also clear the reference copy
    });

    try {
      let shopsData;
      if (mallId) {
        shopsData = await getShopsByMall(mallId);
      } else {
        shopsData = await getShops();
      }

      // Only update if the mall hasn't changed while we were fetching
      const currentState = get();
      if (currentState.selectedMall === mallId) {
        set({
          shops: shopsData as ShopWithCategory[],
          allShops: shopsData as ShopWithCategory[],
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error filtering by mall:", error);
      set({
        error: "Failed to filter shops by mall",
        loading: false,
        shops: [],
        allShops: [],
      });
    }
  },

  // Set selected category and fetch matching shops
  setSelectedCategory: async (categoryId) => {
    const state = get();

    // Clear conflicting filters and shops immediately
    set({
      selectedCategory: categoryId,
      selectedFeature: null,
      searchQuery: "",
      loading: true,
      error: null,
      shops: [], // Clear immediately
    });

    try {
      let shopsData;

      if (categoryId) {
        shopsData = await getShopsByCategory(categoryId);
        // Apply mall filter if one is selected
        if (state.selectedMall) {
          shopsData = (shopsData as any[]).filter(
            (shop) => shop.mall_id === state.selectedMall
          );
        }
      } else {
        // If category is cleared, reload with current mall filter
        if (state.selectedMall) {
          shopsData = await getShopsByMall(state.selectedMall);
        } else {
          shopsData = await getShops();
        }
      }

      // Only update if category hasn't changed while fetching
      const currentState = get();
      if (currentState.selectedCategory === categoryId) {
        set({ shops: shopsData as ShopWithCategory[], loading: false });
      }
    } catch (error) {
      console.error("Error filtering by category:", error);
      set({
        error: "Failed to filter shops by category",
        loading: false,
        shops: [],
      });
    }
  },

  // Set selected feature and fetch matching shops
  setSelectedFeature: async (feature) => {
    const state = get();

    // Clear conflicting filters and shops immediately
    set({
      selectedFeature: feature,
      selectedCategory: null,
      searchQuery: "",
      loading: true,
      error: null,
      shops: [], // Clear immediately
    });

    try {
      let shopsData;

      if (feature) {
        shopsData = await getShopsWithFeature(feature as any);
        // Apply mall filter if one is selected
        if (state.selectedMall) {
          shopsData = (shopsData as any[]).filter(
            (shop) => shop.mall_id === state.selectedMall
          );
        }
      } else {
        // If feature is cleared, reload with current mall filter
        if (state.selectedMall) {
          shopsData = await getShopsByMall(state.selectedMall);
        } else {
          shopsData = await getShops();
        }
      }

      // Only update if feature hasn't changed while fetching
      const currentState = get();
      if (currentState.selectedFeature === feature) {
        set({ shops: shopsData as ShopWithCategory[], loading: false });
      }
    } catch (error) {
      console.error("Error filtering by feature:", error);
      set({
        error: "Failed to filter shops by feature",
        loading: false,
        shops: [],
      });
    }
  },

  // Set search query and fetch matching shops
  setSearchQuery: async (query) => {
    const state = get();

    set({ searchQuery: query, loading: true, error: null, shops: [] }); // Clear immediately

    try {
      if (query.trim()) {
        const shopsData = await searchShops(query);
        // Apply mall filter if one is selected
        let filteredShops = shopsData;
        if (state.selectedMall) {
          filteredShops = (shopsData as any[]).filter(
            (shop) => shop.mall_id === state.selectedMall
          );
        }

        // Only update if query hasn't changed while fetching
        const currentState = get();
        if (currentState.searchQuery === query) {
          set({ shops: filteredShops as ShopWithCategory[], loading: false });
        }
      } else {
        // If search is cleared, reload with current mall filter
        if (state.selectedMall) {
          const shopsData = await getShopsByMall(state.selectedMall);
          set({ shops: shopsData as ShopWithCategory[], loading: false });
        } else {
          const shopsData = await getShops();
          set({ shops: shopsData as ShopWithCategory[], loading: false });
        }
      }
    } catch (error) {
      console.error("Error searching shops:", error);
      set({ error: "Failed to search shops", loading: false, shops: [] });
    }
  },

  // Reset all filters to default (Molapo Crossing)
  resetFilters: async () => {
    set({
      selectedMall: 1,
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
      loading: true,
      error: null,
      shops: [], // Clear immediately
    });

    try {
      const shopsData = await getShopsByMall(1);
      set({ shops: shopsData as ShopWithCategory[], loading: false });
    } catch (error) {
      console.error("Error resetting filters:", error);
      set({ error: "Failed to reset filters", loading: false, shops: [] });
    }
  },

  // Clear all filters except mall
  clearAllExceptMall: async () => {
    const state = get();

    set({
      selectedCategory: null,
      selectedFeature: null,
      searchQuery: "",
      loading: true,
      error: null,
    });

    try {
      let shopsData;
      if (state.selectedMall) {
        shopsData = await getShopsByMall(state.selectedMall);
      } else {
        shopsData = await getShops();
      }
      set({ shops: shopsData as ShopWithCategory[], loading: false });
    } catch (error) {
      console.error("Error clearing filters:", error);
      set({ error: "Failed to clear filters", loading: false });
    }
  },
}));
