import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/auth-provider";
import { generateOrderSlug } from "../utils/utils";
import { Tables, TablesInsert } from "../types/database.types";

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
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        throw new Error(
          "An error occurred while fetching data: " + error?.message
        );
      }

      return data;
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

export const createOrder = () => {
  const {
    user: { id },
  } = useAuth();

  const slug = generateOrderSlug();

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ totalPrice }: { totalPrice: number }) {
      const { data, error } = await supabase
        .from("order")
        .insert({
          totalPrice,
          slug,
          user: id,
          status: "Pending",
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

export const createOrderItem = () => {
  return useMutation({
    async mutationFn(
      insertData: {
        orderId: number;
        productId: number;
        quantity: number;
      }[]
    ) {
      const { data, error } = await supabase
        .from("order_item")
        .insert(
          insertData.map(({ orderId, quantity, productId }) => ({
            order: orderId,
            product: productId,
            quantity,
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

      return data;
    },
  });
};

// ===== SERVICE RELATED FUNCTIONS =====

export const getServiceCategories = () => {
  return useQuery({
    queryKey: ["serviceCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_category")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw new Error(
          "An error occurred while fetching service categories: " +
            error.message
        );
      }

      return data;
    },
  });
};

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
          "An error occurred while fetching venue details: " + error?.message
        );
      }

      return data;
    },
  });
};

export const createEventBooking = () => {
  const {
    user: { id },
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      venueId,
      eventName,
      eventType,
      eventDate,
      startTime,
      endTime,
      estimatedGuests,
      contactPhone,
      contactEmail,
      totalPrice,
      specialRequirements,
      notes,
    }: {
      venueId: number;
      eventName: string;
      eventType: string;
      eventDate: string;
      startTime: string;
      endTime: string;
      estimatedGuests: number;
      contactPhone: string;
      contactEmail: string;
      totalPrice: number;
      specialRequirements?: string;
      notes?: string;
    }) {
      const { data, error } = await supabase
        .from("event_booking")
        .insert({
          user_id: id,
          venue_id: venueId,
          event_name: eventName,
          event_type: eventType,
          event_date: eventDate,
          start_time: startTime,
          end_time: endTime,
          estimated_guests: estimatedGuests,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          total_price: totalPrice,
          special_requirements: specialRequirements,
          notes,
          status: "pending",
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(
          "An error occurred while creating event booking: " + error.message
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

export const getMyEventBookings = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["myEventBookings"],
    queryFn: async () => {
      const { data, error } = await supabase
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
