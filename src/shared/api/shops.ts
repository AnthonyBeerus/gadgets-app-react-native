import { publicSupabase, supabase } from "../lib/supabase";
import { Tables } from "../types/database.types";

export type Shop = Tables<"shops">;
export type ShopReview = Tables<"shop_reviews">;
export type Mall = Tables<"malls">;

// Mall Functions
export const getMalls = async () => {
  const { data, error } = await publicSupabase
    .from("malls")
    .select(
      `
      *,
      shops:shops(count)
    `
    )
    .order("is_featured", { ascending: false })
    .order("name");

  if (error) throw error;
  return data;
};

export const getMallById = async (mallId: number) => {
  const { data, error } = await publicSupabase
    .from("malls")
    .select("*")
    .eq("id", mallId)
    .single();

  if (error) throw error;
  return data;
};

export const getMallBySlug = async (slug: string) => {
  const { data, error } = await publicSupabase
    .from("malls")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
};

export const getFeaturedMalls = async () => {
  const { data, error } = await publicSupabase
    .from("malls")
    .select("*")
    .eq("is_featured", true)
    .order("name");

  if (error) throw error;
  return data;
};

export const getShopsByMall = async (mallId: number) => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      products:product(count)
    `
    ) as any)
    .eq("mall_id", mallId)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

// Shop Functions
export const getShops = async () => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      mall:mall_id (
        id,
        name,
        slug
      ),
      products:product(count)
    `
    ) as any)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopsByCategory = async (categoryId: number) => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      products:product(count)
    `
    ) as any)
    .eq("category_id", categoryId)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopById = async (shopId: number) => {
  console.log("getShopById called with ID:", shopId);

  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      shop_reviews (
        id,
        rating,
        review_text,
        created_at,
        user_id
      )
    `
    ) as any)
    .eq("id", shopId)
    .single();

  console.log("getShopById response:", {
    data: data?.name,
    error: error?.message,
  });

  if (error) throw error;
  return data;
};

export const getFeaturedShops = async () => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      )
    `
    ) as any)
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
};

// Review Functions
export const getShopReviews = async (shopId: number) => {
  const { data, error } = await publicSupabase
    .from("shop_reviews")
    .select(
      `
      *,
      user:user_id (
        email
      )
    `
    )
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const addShopReview = async (review: {
  shop_id: number;
  user_id: string;
  rating: number;
  review_text?: string;
}) => {
  const { data, error } = await supabase
    .from("shop_reviews")
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateShopReview = async (
  reviewId: number,
  updates: {
    rating?: number;
    review_text?: string;
  }
) => {
  const { data, error } = await supabase
    .from("shop_reviews")
    .update(updates)
    .eq("id", reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteShopReview = async (reviewId: number) => {
  const { error } = await supabase
    .from("shop_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
};

// Appointment Functions
// Delivery Order Functions
// Category Functions with Shop Features
export const getCategoriesWithShopFeatures = async () => {
  const { data, error } = await publicSupabase
    .from("category")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
};

// Search Functions
export const searchShops = async (query: string) => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      products:product(count)
    `
    ) as any)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopsWithFeature = async (
  feature:
    | "has_delivery"
    | "has_collection"
) => {
  const { data, error } = await (publicSupabase
    .from("shops")
    .select(
      `
      *,
      category:category_id (
        id,
        name,
        slug,
        "imageUrl"
      ),
      products:product(count)
    `
    ) as any)
    .eq(feature, true)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

// Get products by shop ID