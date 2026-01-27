import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/auth-provider";
import { generateOrderSlug } from "../utils/utils";
import { Database, Tables, TablesInsert } from '../types/database.types';
import { apiClient } from "./client";

export const getProductsAndCategories = () => {
  return useQuery({
    queryKey: ["products", "categories"],
    queryFn: async () => {
      const [products, categories] = await Promise.all([
        supabase.from("product").select("*"),
        supabase.from("category").select("*"),
      ]);

      if (products.error || categories.error) {
        throw new Error("An error occurred while fetching data");
      }

      return { products: products.data, categories: categories.data };
    },
  });
};

export const getProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const data = await apiClient.get<Tables<'product'>>(`/api/products/${slug}`);
        return data;
      } catch (error: any) {
        throw new Error(
          "An error occurred while fetching data: " + (error?.message || error)
        );
      }
    },
  });
};

export const getCategoryAndProducts = (categorySlug: string) => {
  return useQuery({
    queryKey: ["categoryAndProducts", categorySlug],
    queryFn: async () => {
      const { data: category, error: categoryError } = await supabase
        .from("category")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (categoryError || !category) {
        throw new Error("An error occurred while fetching category data");
      }

      const { data: products, error: productsError } = await supabase
        .from("product")
        .select("*")
        .eq("category", category.id);

      if (productsError) {
        throw new Error("An error occurred while fetching products data");
      }

      return { category, products };
    },
  });
};

// Shop-related API functions
export const getShops = () => {
  return useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw new Error(
          "An error occurred while fetching shops: " + error.message
        );
      }

      return data;
    },
  });
};

export const getShop = (id: number) => {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching shop: " + error?.message
        );
      }

      return data;
    },
  });
};

export const getShopProducts = (shopId: number) => {
  return useQuery({
    queryKey: ["shopProducts", shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product")
        .select("*, category:category(name)")
        .eq("shop_id", shopId);

      if (error) {
        throw new Error(
          "An error occurred while fetching shop products: " + error.message
        );
      }

      return data || [];
    },
  });
};

export const getProductsWithShops = () => {
  return useQuery({
    queryKey: ["productsWithShops"],
    queryFn: async () => {
      // Note: Product table doesn't have shop_id column
      // Returning all products for now until schema is updated
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching products: " + error.message
        );
      }

      return data;
    },
  });
};

export const getShopsWithProductCount = () => {
  return useQuery({
    queryKey: ["shopsWithProductCount"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("*, products:product(count)")
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw new Error(
          "An error occurred while fetching shops with product count: " +
            error.message
        );
      }

      return data;
    },
  });
};

// Async version for direct usage (non-hook)
export const fetchShopsWithProductCount = async () => {
  const { data, error } = await supabase
    .from("shops")
    .select(
      `
      *, 
      category:category_id(id, name, slug),
      products:product!shop_id(count)
    `
    )
    .order("name");

  if (error) {
    throw new Error(
      "An error occurred while fetching shops with product count: " +
        error.message
    );
  }

  return data;
};

export const getMyOrders = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("user", id);

      if (error)
        throw new Error(
          "An error occurred while fetching orders: " + error.message
        );

      return data;
    },
  });
};

// Helper to generate a secure random token for QR fulfillment verification
const generateFulfillmentToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createOrder = () => {
  const {
    user: { id },
  } = useAuth();

  const slug = generateOrderSlug();
  const fulfillmentToken = generateFulfillmentToken();

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ totalPrice, paymentIntentId, paymentStatus }: { totalPrice: number; paymentIntentId?: string; paymentStatus?: string }) {
      const { data, error } = await supabase
        .from("order")
        .insert({
          totalPrice,
          slug,
          user: id,
          status: "Pending",
          payment_intent_id: paymentIntentId,
          stripe_payment_status: paymentStatus || 'pending',
          fulfillment_token: fulfillmentToken
        })
        .select("*")
        .single();

      if (error)
        throw new Error(
          "An error occurred while creating order: " + error.message
        );

      return data;
    },


    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
};

export const deleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(orderId: number) {
      const { error } = await supabase.from("order").delete().eq("id", orderId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const updateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      orderId,
      updates,
    }: {
      orderId: number;
      updates: Partial<Tables<"order">>;
    }) {
      const { data, error } = await supabase
        .from("order")
        .update(updates)
        .eq("id", orderId)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while updating order: " + error.message
        );
      }

      return data;
    },

    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ["order"] });
      // Also invalidate specific order
      if (data) {
          await queryClient.invalidateQueries({ queryKey: ["orders", data.slug] });
      }
    },
  });
};

export const createOrderItem = () => {
  return useMutation({
    async mutationFn(
      insertData: {
        orderId: number;
        productId: number;
        quantity: number;
        price: number;
      }[]
    ) {
      const { data, error } = await supabase
        .from("order_item")
        .insert(
          insertData.map(({ orderId, quantity, productId, price }) => ({
            order: orderId,
            product: productId,
            quantity,
            price
          }))
        )
        .select("*");

      const productQuantities = insertData.reduce(
        (acc, { productId, quantity }) => {
          if (!acc[productId]) {
            acc[productId] = 0;
          }
          acc[productId] += quantity;
          return acc;
        },
        {} as Record<number, number>
      );

      await Promise.all(
        Object.entries(productQuantities).map(
          async ([productId, totalQuantity]) =>
            supabase.rpc("decrement_product_quantity", {
              product_id: Number(productId),
              quantity: totalQuantity,
            })
        )
      );

      if (error)
        throw new Error(
          "An error occurred while creating order item: " + error.message
        );

      return data;
    },
  });
};

export interface OrderWithItems {
  id: number;
  created_at: string;
  status: string;
  slug: string;
  totalPrice: number;
  fulfillment_token: string | null;
  stripe_payment_status: string | null;
  order_items: {
    id: number;
    quantity: number;
    products: {
      title: string;
      heroImage: string;
      price: number;
    } | null;
  }[];
}

export const getMyOrder = (slug: string) => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["orders", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order")
        .select("*, order_items:order_item(*, products:product(*))")
        .eq("slug", slug)
        .eq("user", id)
        .single();

      if (error || !data)
        throw new Error(
          "An error occurred while fetching data: " + error.message
        );

      return data as unknown as OrderWithItems;
    },
  });
};

// ===== SERVICE RELATED FUNCTIONS =====

// ===== SERVICE RELATED FUNCTIONS =====


export const getServicesByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["services", "category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service")
        .select(
          `
          *,
          service_provider (
            id,
            name,
            rating,
            total_reviews,
            is_verified
          )
        `
        )
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching services: " + error.message
        );
      }

      return data;
    },
  });
};

export const getAllServices = () => {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service")
        .select(
          `
          *,
          service_category (
            id,
            name,
            color,
            icon
          ),
          service_provider (
            id,
            name,
            rating,
            total_reviews,
            is_verified
          )
        `
        )
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching services: " + error.message
        );
      }

      return data;
    },
  });
};

export const getService = (slug: string) => {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service")
        .select(
          `
          *,
          service_category (
            id,
            name,
            color,
            icon
          ),
          service_provider (
            id,
            name,
            email,
            phone,
            address,
            description,
            rating,
            total_reviews,
            is_verified
          )
        `
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching service: " +
            (error?.message || "Service not found")
        );
      }

      return data;
    },
  });
};

export const getServiceAvailability = (
  providerId: number,
  serviceId?: number
) => {
  return useQuery({
    queryKey: ["serviceAvailability", providerId, serviceId],
    queryFn: async () => {
      let query = supabase
        .from("service_availability")
        .select("*")
        .eq("provider_id", providerId)
        .eq("is_available", true)
        .order("day_of_week")
        .order("start_time");

      if (serviceId) {
        query = query.or(`service_id.eq.${serviceId},service_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          "An error occurred while fetching availability: " + error.message
        );
      }

      return data;
    },
  });
};

export const getMyServiceBookings = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["serviceBookings", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_booking")
        .select(
          `
          *,
          service (
            id,
            name,
            image_url
          ),
          service_provider (
            id,
            name,
            rating,
            phone,
            address
          )
        `
        )
        .eq("user_id", id)
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching bookings: " + error.message
        );
      }

      return data;
    },
  });
};

export const getServiceBooking = (slug: string) => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["serviceBooking", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_booking")
        .select(
          `
          *,
          service (
            id,
            name,
            description,
            image_url,
            duration_minutes
          ),
          service_provider (
            id,
            name,
            email,
            phone,
            address,
            rating,
            total_reviews
          )
        `
        )
        .eq("slug", slug)
        .eq("user_id", id)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching booking: " +
            (error?.message || "Booking not found")
        );
      }

      return data;
    },
  });
};

export const createServiceBooking = () => {
  const {
    user: { id },
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(bookingData: {
      serviceId: number;
      providerId: number;
      bookingDate: string;
      bookingTime: string;
      durationMinutes: number;
      totalAmount: number;
      notes?: string;
    }) {
      // Generate a unique slug for the booking
      const slug = `booking-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const { data, error } = await supabase
        .from("service_booking")
        .insert({
          user_id: id,
          service_id: bookingData.serviceId,
          provider_id: bookingData.providerId,
          booking_date: bookingData.bookingDate,
          booking_time: bookingData.bookingTime,
          duration_minutes: bookingData.durationMinutes,
          total_amount: bookingData.totalAmount,
          notes: bookingData.notes,
          slug,
          status: "pending",
          payment_status: "pending",
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating booking: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
    },
  });
};

export const updateServiceBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      bookingId,
      updates,
    }: {
      bookingId: number;
      updates: Partial<Tables<"service_booking">>;
    }) {
      const { data, error } = await supabase
        .from("service_booking")
        .update(updates)
        .eq("id", bookingId)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while updating booking: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
      await queryClient.invalidateQueries({ queryKey: ["serviceBooking"] });
    },
  });
};

export const cancelServiceBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      bookingId,
      cancellationReason,
    }: {
      bookingId: number;
      cancellationReason?: string;
    }) {
      const { data, error } = await supabase
        .from("service_booking")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason,
        })
        .eq("id", bookingId)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while cancelling booking: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
      await queryClient.invalidateQueries({ queryKey: ["serviceBooking"] });
    },
  });
};

export const createServiceReview = () => {
  const {
    user: { id },
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      bookingId,
      serviceId,
      providerId,
      rating,
      comment,
    }: {
      bookingId: number;
      serviceId: number;
      providerId: number;
      rating: number;
      comment?: string;
    }) {
      const { data, error } = await supabase
        .from("service_review")
        .insert({
          booking_id: bookingId,
          user_id: id,
          service_id: serviceId,
          provider_id: providerId,
          rating,
          comment,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating review: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["serviceBookings"] });
    },
  });
};

// ===== EVENT VENUE RELATED FUNCTIONS =====

export const getEventVenues = () => {
  return useQuery({
    queryKey: ["eventVenues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_venue")
        .select("*")
        .eq("is_available", true)
        .order("name");

      if (error) {
        throw new Error(
          "An error occurred while fetching event venues: " + error.message
        );
      }

      return data;
    },
  });
};

export const getEventVenue = (venueId: number) => {
  return useQuery({
    queryKey: ["eventVenue", venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_venue")
        .select("*")
        .eq("id", venueId)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching event venue: " +
            (error?.message || "Venue not found")
        );
      }

      return data;
    },
  });
};

export const getShopEvents = (shopId: number) => {
  return useQuery({
    queryKey: ["shopEvents", shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("shop_id", shopId)
        .order("event_date", { ascending: true });

      if (error) {
        throw new Error(
          "An error occurred while fetching shop events: " + error.message
        );
      }

      return data || [];
    },
    enabled: !!shopId,
  });
};

export const createEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(eventData: {
      title: string;
      description: string;
      date: string;
      location: string;
      imageUrl: string;
      shopId: number;
      price?: number;
      totalTickets?: number;
    }) {
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: eventData.title,
          description: eventData.description,
          event_date: eventData.date.split('T')[0], // YYYY-MM-DD
          start_time: new Date(eventData.date).toLocaleTimeString('en-GB', { hour12: false }), // HH:MM:SS
          end_time: new Date(new Date(eventData.date).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour12: false }), // +2 hours
          location: eventData.location,
          image_url: eventData.imageUrl,
          shop_id: eventData.shopId,
          price: eventData.price || 0,
          total_tickets: eventData.totalTickets || 0,
          category: 'Culture', // Valid values: Music, Comedy, Art, Business, Culture, Film
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating event: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["shopEvents"] });
    },
  });
};

export const deleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      console.log('[API] Deleting event id:', id);
      const { error, count, data } = await supabase
        .from("events")
        .delete({ count: 'exact' })
        .eq("id", id)
        .select('*');

      if (error) {
        throw new Error("Failed to delete event: " + error.message);
      }

      if (count === 0) {
        throw new Error("Failed to delete event: Item not found or permission denied");
      }
      
      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["shopEvents"] });
    },
  });
};
// End of Event functions

// Services
export const getServiceCategories = () => {
  return useQuery({
    queryKey: ["serviceCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_category")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw new Error(
          "An error occurred while fetching service categories: " + error.message
        );
      }

      return data || [];
    },
  });
};

export const getProviderServices = (providerId: number) => {
  return useQuery({
    queryKey: ["providerServices", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service")
        .select(`
            *,
            category:service_category(name)
        `)
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching provider services: " + error.message
        );
      }

      return data || [];
    },
    enabled: !!providerId,
  });
};

export const createService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(serviceData: {
      name: string;
      description: string;
      categoryId: number;
      providerId: number;
      price: number;
      durationMinutes: number;
      imageUrl: string;
      slug: string;
    }) {
      const { data, error } = await supabase
        .from("service")
        .insert({
          name: serviceData.name,
          description: serviceData.description,
          category_id: serviceData.categoryId,
          provider_id: serviceData.providerId,
          price: serviceData.price,
          duration_minutes: serviceData.durationMinutes,
          image_url: serviceData.imageUrl,
          slug: serviceData.slug,
          is_active: true,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating service: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["providerServices"] });
    },
  });
};

export const deleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      console.log('[API] Deleting service id:', id);
      const { error, count, data } = await supabase
        .from("service")
        .delete({ count: 'exact' })
        .eq("id", id)
        .select('*');

      if (error) {
        throw new Error("Failed to delete service: " + error.message);
      }

      if (count === 0) {
        throw new Error("Failed to delete service: Item not found or permission denied");
      }
      
      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["providerServices"] });
    },
  });
};

export const createEventBooking = () => {
  const {
    user: { id },
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(bookingData: { eventId: number; tickets: number; totalPrice: number }) {
      const { data, error } = await supabase
        .from("ticket_purchases")
        .insert({
          event_id: bookingData.eventId,
          user_id: id,
          quantity: bookingData.tickets,
          status: "confirmed",
          purchase_date: new Date().toISOString(),
          total_price: bookingData.totalPrice,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while booking tickets: " + error.message
        );
      }

      // Update tickets sold
      await supabase.rpc("increment_tickets_sold", {
        event_id: bookingData.eventId,
        quantity: bookingData.tickets,
      });

      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Challenges
export const getShopChallenges = (shopId: number) => {
  return useQuery({
    queryKey: ["shopChallenges", shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching shop challenges: " + error.message
        );
      }

      return data || [];
    },
    enabled: !!shopId,
  });
};

export const createChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(challengeData: {
      title: string;
      description: string;
      brandName: string;
      reward: string;
      deadline: string;
      imageUrl: string;
      requirements: string[];
      category: string;
      type: 'free' | 'paid' | 'subscriber';
      entryFee?: number;
      shopId: number;
    }) {
      const { data, error } = await supabase
        .from("challenges")
        .insert({
          title: challengeData.title,
          description: challengeData.description,
          brand_name: challengeData.brandName,
          reward: challengeData.reward,
          deadline: challengeData.deadline,
          image_url: challengeData.imageUrl,
          requirements: challengeData.requirements,
          category: challengeData.category,
          type: challengeData.type,
          entry_fee: challengeData.entryFee,
          shop_id: challengeData.shopId,
          status: 'active',
          participants_count: 0
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating challenge: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["shopChallenges"] });
      // ongoing_challenges might be another key
    },
  });
};

export const deleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      console.log('[API] Deleting challenge id:', id);
      const { error, count, data } = await supabase
        .from("challenges")
        .delete({ count: 'exact' })
        .eq("id", id)
        .select('*');

      if (error) {
        throw new Error("Failed to delete challenge: " + error.message);
      }

      if (count === 0) {
        throw new Error("Failed to delete challenge: Item not found or permission denied");
      }
      
      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["shopChallenges"] });
    },
  });
};



export const getMyEventBookings = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["myEventBookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        // @ts-ignore - event_booking table may not exist in current schema
        .from("event_booking")
        .select(
          `
          *,
          event_venue (
            name,
            type,
            location
          )
        `
        )
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching your event bookings: " +
            error.message
        );
      }

      return data;
    },
  });
};

export const updateEventBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      bookingId,
      status,
    }: {
      bookingId: number;
      status: string;
    }) {
      const { data, error } = await supabase
        // @ts-ignore - event_booking table may not exist in current schema
        .from("event_booking")
        .update({ status })
        .eq("id", bookingId)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while updating booking status: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["eventBookings"] });
      await queryClient.invalidateQueries({ queryKey: ["myEventBookings"] });
    },
  });
};

// ===== EVENTS AND TICKET SALES FUNCTIONS =====

export const getEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          event_venue (
            id,
            name,
            location,
            type
          )
        `
        )
        .eq("status", "active")
        .order("event_date", { ascending: true });

      if (error) {
        throw new Error(
          "An error occurred while fetching events: " + error.message
        );
      }

      return data;
    },
  });
};

export const getEventsByCategory = (category?: string) => {
  return useQuery({
    queryKey: ["events", "category", category],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(
          `
          *,
          event_venue (
            id,
            name,
            location,
            type
          )
        `
        )
        .eq("status", "active")
        .order("event_date", { ascending: true });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          "An error occurred while fetching events: " + error.message
        );
      }

      return data;
    },
  });
};

export const getEvent = (eventId: number) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          event_venue (
            id,
            name,
            location,
            type,
            phone,
            email
          )
        `
        )
        .eq("id", eventId)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching event: " + error?.message
        );
      }

      return data;
    },
  });
};

export const purchaseTickets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      quantity,
      totalPrice,
    }: {
      eventId: number;
      quantity: number;
      totalPrice: number;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User must be authenticated to purchase tickets");
      }

      // Check if enough tickets are available
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("available_tickets, status")
        .eq("id", eventId)
        .single();

      if (eventError) {
        throw new Error(
          "Failed to check event availability: " + eventError.message
        );
      }

      if (event.status !== "active") {
        throw new Error("Event is not available for ticket purchase");
      }

      if (event.available_tickets < quantity) {
        throw new Error("Not enough tickets available");
      }

      // Create ticket purchase
      const { data, error } = await supabase
        .from("ticket_purchases")
        .insert({
          event_id: eventId,
          user_id: user.id,
          quantity,
          total_price: totalPrice,
          status: "confirmed",
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while purchasing tickets: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },
  });
};

export const getMyTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myTickets", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User must be authenticated");
      }

      const { data, error } = await supabase
        .from("ticket_purchases")
        .select(
          `
          *,
          events (
            id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            image_url,
            category,
            event_venue (
              name,
              location
            )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(
          "An error occurred while fetching your tickets: " + error.message
        );
      }

      return data;
    },
    enabled: !!user,
  });
};

export const cancelTicketPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ purchaseId }: { purchaseId: number }) => {
      const { data, error } = await supabase
        .from("ticket_purchases")
        .update({ status: "cancelled" })
        .eq("id", purchaseId)
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while cancelling ticket purchase: " + error.message
        );
      }

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },
  });
};

// ===== PRODUCT MANAGEMENT FUNCTIONS =====

export const createProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(productData: any) {
      // Generate a slug from title
      const slug = productData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      
      const uniqueSlug = `${slug}-${Date.now()}`;

      const { data, error } = await supabase
        .from("product")
        .insert({
          ...productData,
          slug: uniqueSlug,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error("Failed to create product: " + error.message);
      }

      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
    },
  });
};

export const updateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, updates }: { id: number; updates: any }) {
      const { data, error } = await supabase
        .from("product")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        throw new Error("Failed to update product: " + error.message);
      }

      return data;
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
      await queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};

export const deleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      console.log('[API] Deleting product id:', id);
      const { error, count, data } = await supabase
        .from("product")
        .delete({ count: 'exact' }) // Request count
        .eq("id", id)
        .select('*'); // Select to see what was deleted

      console.log('[API] Delete result - error:', error);
      console.log('[API] Delete result - count:', count);
      console.log('[API] Delete result - data:', data);

      if (error) {
        throw new Error("Failed to delete product: " + error.message);
      }

      if (count === 0) {
        throw new Error("Failed to delete product: Item not found or permission denied (RLS)");
      }
    },
    async onSuccess(data, variables) {
      console.log('[API] Delete mutation success for id:', variables);
      await queryClient.invalidateQueries({ queryKey: ["shopProducts"] });
    },
  });
};

export const uploadProductImage = async (uri: string) => {
  try {
    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const formData = new FormData();
    
    // @ts-ignore - React Native FormData expects specific object structure
    formData.append('file', {
      uri,
      name: filename,
      type: 'image/jpeg',
    });

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, formData, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error: any) {
    throw new Error('Image upload failed: ' + error.message);
  }
};
