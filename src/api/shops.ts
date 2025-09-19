import { supabase } from "../lib/supabase";
import { Tables } from "../types/database.types";

export type Shop = Tables<"shops">;
export type ShopReview = Tables<"shop_reviews">;
export type Appointment = Tables<"appointments">;
export type DeliveryOrder = Tables<"delivery_orders">;

// Shop Functions
export const getShops = async () => {
  const { data, error } = await supabase
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
    )
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopsByCategory = async (categoryId: number) => {
  const { data, error } = await supabase
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
    )
    .eq("category_id", categoryId)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopById = async (shopId: number) => {
  const { data, error } = await supabase
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
    )
    .eq("id", shopId)
    .single();

  if (error) throw error;
  return data;
};

export const getFeaturedShops = async () => {
  const { data, error } = await supabase
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
    )
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
};

// Review Functions
export const getShopReviews = async (shopId: number) => {
  const { data, error } = await supabase
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
export const getShopAppointments = async (customerId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      shop:shop_id (
        id,
        name,
        location,
        phone,
        category:category_id (
          name
        )
      )
    `
    )
    .eq("user_id", customerId)
    .order("appointment_date", { ascending: true });

  if (error) throw error;
  return data;
};

export const createAppointment = async (appointment: {
  shop_id: number;
  user_id: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  price?: number;
  customer_email?: string;
  special_requests?: string;
  duration_minutes?: number;
}) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      ...appointment,
      status: "pending",
    })
    .select(
      `
      *,
      shop:shop_id (
        id,
        name,
        location,
        phone
      )
    `
    )
    .single();

  if (error) throw error;
  return data;
};

export const updateAppointment = async (
  appointmentId: number,
  updates: {
    appointment_date?: string;
    notes?: string;
    status?: "pending" | "confirmed" | "completed" | "cancelled";
  }
) => {
  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelAppointment = async (appointmentId: number) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delivery Order Functions
export const getDeliveryOrders = async (customerId: string) => {
  const { data, error } = await supabase
    .from("delivery_orders")
    .select(
      `
      *,
      shop:shop_id (
        id,
        name,
        location,
        phone,
        category:category_id (
          name
        )
      ),
      order:order_id (
        id,
        user,
        totalPrice,
        status
      )
    `
    )
    .eq("order.user", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createDeliveryOrder = async (order: {
  order_id: number;
  shop_id: number;
  delivery_type: "delivery" | "collection";
  delivery_phone: string;
  delivery_address?: string;
  delivery_notes?: string;
  delivery_fee?: number;
  collection_time?: string;
  estimated_delivery_time?: string;
}) => {
  const { data, error } = await supabase
    .from("delivery_orders")
    .insert({
      ...order,
      status: "pending",
    })
    .select(
      `
      *,
      shop:shop_id (
        id,
        name,
        location,
        phone
      )
    `
    )
    .single();

  if (error) throw error;
  return data;
};

export const updateDeliveryOrder = async (
  orderId: number,
  updates: {
    status?:
      | "pending"
      | "confirmed"
      | "preparing"
      | "ready"
      | "delivered"
      | "collected"
      | "cancelled";
    delivery_date?: string;
    delivery_address?: string;
  }
) => {
  const { data, error } = await supabase
    .from("delivery_orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Category Functions with Shop Features
export const getCategoriesWithShopFeatures = async () => {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
};

// Search Functions
export const searchShops = async (query: string) => {
  const { data, error } = await supabase
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
    )
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

export const getShopsWithFeature = async (
  feature:
    | "has_delivery"
    | "has_collection"
    | "has_appointment_booking"
    | "has_virtual_try_on"
) => {
  const { data, error } = await supabase
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
    )
    .eq(feature, true)
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
};

// Get products by shop ID
export const getShopProducts = async (shopId: number) => {
  // Temporary mock data until we set up the proper database structure
  const mockProducts = [
    {
      id: 1,
      title: "Premium Product 1",
      slug: "premium-product-1",
      heroImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      imagesUrl: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      ],
      price: 999.99,
      maxQuantity: 10,
      category: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Quality Item 2",
      slug: "quality-item-2",
      heroImage:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      imagesUrl: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      ],
      price: 599.99,
      maxQuantity: 15,
      category: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Best Seller 3",
      slug: "best-seller-3",
      heroImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      imagesUrl: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      ],
      price: 299.99,
      maxQuantity: 25,
      category: 1,
      created_at: new Date().toISOString(),
    },
  ];

  // Return different products based on shop ID to simulate variety
  const shopIndex = shopId % 3;
  return mockProducts.slice(shopIndex, shopIndex + 2);

  /* Real implementation - will be enabled once database structure is ready
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      title,
      slug,
      heroImage,
      imagesUrl,
      price,
      maxQuantity,
      category,
      created_at
    `)
    .eq("shop_id", shopId)
    .order("title");

  if (error) throw error;
  return data || [];
  */
};
