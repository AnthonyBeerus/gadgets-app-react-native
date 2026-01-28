export type Json = any


export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          duration_minutes: number | null
          id: number
          notes: string | null
          price: number | null
          service_type: string
          shop_id: number | null
          special_requests: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          duration_minutes?: number | null
          id?: number
          notes?: string | null
          price?: number | null
          service_type: string
          shop_id?: number | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          duration_minutes?: number | null
          id?: number
          notes?: string | null
          price?: number | null
          service_type?: string
          shop_id?: number | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          description: string | null
          has_appointment_booking: boolean | null
          has_collection: boolean | null
          has_delivery: boolean | null
          has_virtual_try_on: boolean | null
          icon_name: string | null
          id: number
          imageUrl: string | null
          name: string
          products: number[] | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          has_appointment_booking?: boolean | null
          has_collection?: boolean | null
          has_delivery?: boolean | null
          has_virtual_try_on?: boolean | null
          icon_name?: string | null
          id?: number
          imageUrl?: string | null
          name: string
          products?: number[] | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          has_appointment_booking?: boolean | null
          has_collection?: boolean | null
          has_delivery?: boolean | null
          has_virtual_try_on?: boolean | null
          icon_name?: string | null
          id?: number
          imageUrl?: string | null
          name?: string
          products?: number[] | null
          slug?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          ai_allowed: boolean | null
          brand_logo_url: string | null
          brand_name: string
          category: string | null
          created_at: string | null
          deadline: string
          description: string
          entry_fee: number | null
          id: number
          image_url: string
          is_premium: boolean | null
          participants_count: number | null
          requirements: string[]
          reward: string
          shop_id: number | null
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          ai_allowed?: boolean | null
          brand_logo_url?: string | null
          brand_name: string
          category?: string | null
          created_at?: string | null
          deadline: string
          description: string
          entry_fee?: number | null
          id?: number
          image_url: string
          is_premium?: boolean | null
          participants_count?: number | null
          requirements: string[]
          reward: string
          shop_id?: number | null
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          ai_allowed?: boolean | null
          brand_logo_url?: string | null
          brand_name?: string
          category?: string | null
          created_at?: string | null
          deadline?: string
          description?: string
          entry_fee?: number | null
          id?: number
          image_url?: string
          is_premium?: boolean | null
          participants_count?: number | null
          requirements?: string[]
          reward?: string
          shop_id?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_orders: {
        Row: {
          actual_delivery_time: string | null
          collection_time: string | null
          created_at: string
          delivery_address: string | null
          delivery_fee: number | null
          delivery_person_name: string | null
          delivery_person_phone: string | null
          delivery_phone: string
          delivery_type: string
          estimated_delivery_time: string | null
          id: number
          order_id: number | null
          shop_id: number | null
          status: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery_time?: string | null
          collection_time?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_person_name?: string | null
          delivery_person_phone?: string | null
          delivery_phone: string
          delivery_type: string
          estimated_delivery_time?: string | null
          id?: number
          order_id?: number | null
          shop_id?: number | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery_time?: string | null
          collection_time?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_person_name?: string | null
          delivery_person_phone?: string | null
          delivery_phone?: string
          delivery_type?: string
          estimated_delivery_time?: string | null
          id?: number
          order_id?: number | null
          shop_id?: number | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: number | null
          available_tickets: number
          category: string
          created_at: string | null
          description: string
          end_time: string | null
          event_date: string
          id: number
          image_url: string
          is_featured: boolean | null
          location: string
          price: number
          shop_id: number | null
          start_time: string | null
          status: string
          time: string
          title: string
          total_tickets: number
          updated_at: string | null
        }
        Insert: {
          available_tickets: number
          category: string
          created_at?: string | null
          description: string
          end_time?: string
          event_date: string
          id?: number
          image_url: string
          is_featured?: boolean | null
          location: string
          price: number
          shop_id?: number | null
          start_time?: string
          status?: string
          time?: string
          title: string
          total_tickets: number
          updated_at?: string | null
        }
        Update: {
          attendees?: number | null
          available_tickets?: number
          category?: string
          created_at?: string | null
          description?: string
          end_time?: string
          event_date?: string
          id?: number
          image_url?: string
          is_featured?: boolean | null
          location?: string
          price?: number
          shop_id?: number | null
          start_time?: string
          status?: string
          time?: string
          title?: string
          total_tickets?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      event_venue: {
        Row: {
          email: string | null
          id: number
          is_available: boolean | null
          location: string
          name: string
          phone: string | null
          type: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          is_available?: boolean | null
          location: string
          name: string
          phone?: string | null
          type?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          is_available?: boolean | null
          location?: string
          name?: string
          phone?: string | null
          type?: string | null
        }
        Relationships: []
      }
      malls: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          hero_image: string | null
          id: number
          image_url: string | null
          is_featured: boolean | null
          is_physical: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          hero_image?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_physical?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          hero_image?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_physical?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order: {
        Row: {
          created_at: string
          description: string | null
          fulfillment_token: string | null
          id: number
          slug: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          totalPrice: number
          user: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fulfillment_token?: string | null
          id?: number
          slug: string
          status: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          totalPrice: number
          user: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fulfillment_token?: string | null
          id?: number
          slug?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          totalPrice?: number
          user?: string
        }
        Relationships: []
      }
      order_item: {
        Row: {
          created_at: string
          id: number
          order: number
          product: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order: number
          product: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          product?: number
          quantity?: number
        }
        Relationships: []
      }
      product: {
        Row: {
          brand: string | null
          category: number
          colors: string[] | null
          created_at: string
          description: string | null
          dimensions: Json | null
          heroImage: string
          id: number
          imagesUrl: string[]
          is_available: boolean | null
          is_featured: boolean | null
          maxQuantity: number
          price: number
          rating: number | null
          reviews_count: number | null
          shop_id: number | null
          sku: string | null
          slug: string
          title: string
          variants: Json | null
          weight: number | null
        }
        Insert: {
          brand?: string | null
          category: number
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          heroImage: string
          id?: number
          imagesUrl: string[]
          is_available?: boolean | null
          is_featured?: boolean | null
          maxQuantity: number
          price: number
          rating?: number | null
          reviews_count?: number | null
          shop_id?: number | null
          sku?: string | null
          slug: string
          title: string
          variants?: Json | null
          weight?: number | null
        }
        Update: {
          brand?: string | null
          category?: number
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          heroImage?: string
          id?: number
          imagesUrl?: string[]
          is_available?: boolean | null
          is_featured?: boolean | null
          maxQuantity?: number
          price?: number
          rating?: number | null
          reviews_count?: number | null
          shop_id?: number | null
          sku?: string | null
          slug?: string
          title?: string
          variants?: Json | null
          weight?: number | null
        }
        Relationships: []
      }
      service: {
        Row: {
          category_id: number
          created_at: string
          description: string
          duration_minutes: number
          id: number
          image_url: string | null
          is_active: boolean | null
          max_advance_booking_days: number | null
          name: string
          price: number
          provider_id: number | null
          rating: number | null
          slug: string
          staff_id: string | null
          total_reviews: number | null
        }
        Insert: {
          category_id: number
          created_at?: string
          description: string
          duration_minutes: number
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          name: string
          price: number
          provider_id?: number | null
          rating?: number | null
          slug: string
          staff_id?: string | null
          total_reviews?: number | null
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          name?: string
          price?: number
          provider_id?: number | null
          rating?: number | null
          slug?: string
          staff_id?: string | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      service_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: number
          is_available: boolean | null
          provider_id: number
          service_id: number | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: number
          is_available?: boolean | null
          provider_id: number
          service_id?: number | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: number
          is_available?: boolean | null
          provider_id?: number
          service_id?: number | null
          start_time?: string
        }
        Relationships: []
      }
      service_booking: {
        Row: {
          booking_date: string
          booking_time: string
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          duration_minutes: number
          id: number
          notes: string | null
          payment_status: string | null
          provider_id: number
          service_id: number
          slug: string
          status: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          duration_minutes: number
          id?: number
          notes?: string | null
          payment_status?: string | null
          provider_id: number
          service_id: number
          slug: string
          status?: string | null
          total_amount: number
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: number
          notes?: string | null
          payment_status?: string | null
          provider_id?: number
          service_id?: number
          slug?: string
          status?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      service_provider: {
        Row: {
          created_at: string
          description: string | null
          email: string
          id: number
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          phone: string | null
          rating: number | null
          shop_id: number | null
          total_reviews: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          shop_id?: number | null
          total_reviews?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          shop_id?: number | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      service_review: {
        Row: {
          booking_id: number
          comment: string | null
          created_at: string
          id: number
          is_verified: boolean | null
          provider_id: number
          rating: number
          service_id: number
          user_id: string
        }
        Insert: {
          booking_id: number
          comment?: string | null
          created_at?: string
          id?: number
          is_verified?: boolean | null
          provider_id: number
          rating: number
          service_id: number
          user_id: string
        }
        Update: {
          booking_id?: number
          comment?: string | null
          created_at?: string
          id?: number
          is_verified?: boolean | null
          provider_id?: number
          rating?: number
          service_id?: number
          user_id?: string
        }
        Relationships: []
      }
      shop_reviews: {
        Row: {
          created_at: string
          id: number
          is_verified_purchase: boolean | null
          order_id: number | null
          rating: number
          review_text: string | null
          shop_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_verified_purchase?: boolean | null
          order_id?: number | null
          rating: number
          review_text?: string | null
          shop_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_verified_purchase?: boolean | null
          order_id?: number | null
          rating?: number
          review_text?: string | null
          shop_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      service_category: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      ticket_purchases: {
        Row: {
          created_at: string
          event_id: number | null
          id: number
          payment_intent_id: string | null
          purchase_date: string
          quantity: number
          status: string | null
          total_price: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: number | null
          id?: number
          payment_intent_id?: string | null
          purchase_date: string
          quantity: number
          status?: string | null
          total_price: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: number | null
          id?: number
          payment_intent_id?: string | null
          purchase_date?: string
          quantity?: number
          status?: string | null
          total_price?: number
          user_id?: string | null
        }
        Relationships: []
      }
      shops: {
        Row: {
          category_id: number | null
          created_at: string
          delivery_fee: number | null
          description: string | null
          email: string | null
          estimated_delivery_time: string | null
          facebook_handle: string | null
          has_appointment_booking: boolean | null
          has_collection: boolean | null
          has_delivery: boolean | null
          has_online_ordering: boolean | null
          has_virtual_try_on: boolean | null
          id: number
          image_url: string | null
          instagram_handle: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          logo_url: string | null
          minimum_order_amount: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          rating: number | null
          total_reviews: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          email?: string | null
          estimated_delivery_time?: string | null
          facebook_handle?: string | null
          has_appointment_booking?: boolean | null
          has_collection?: boolean | null
          has_delivery?: boolean | null
          has_online_ordering?: boolean | null
          has_virtual_try_on?: boolean | null
          id?: number
          image_url?: string | null
          instagram_handle?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          logo_url?: string | null
          minimum_order_amount?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          email?: string | null
          estimated_delivery_time?: string | null
          facebook_handle?: string | null
          has_appointment_booking?: boolean | null
          has_collection?: boolean | null
          has_delivery?: boolean | null
          has_online_ordering?: boolean | null
          has_virtual_try_on?: boolean | null
          id?: number
          image_url?: string | null
          instagram_handle?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          logo_url?: string | null
          minimum_order_amount?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          revenue_cat_id: string | null
          role: string | null
          stripe_account_id: string | null
          stripe_customer_id: string | null
          type: string | null
        }
        Insert: {
          avatar_url: string
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          revenue_cat_id?: string | null
          role?: string | null
          stripe_account_id?: string | null
          stripe_customer_id?: string | null
          type?: string | null
        }
        Update: {
          avatar_url?: string
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          revenue_cat_id?: string | null
          role?: string | null
          stripe_account_id?: string | null
          stripe_customer_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_dev_merchant: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      decrement_product_quantity: {
        Args: {
          product_id: number
          quantity: number
        }
        Returns: undefined
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      increment_tickets_sold: {
        Args: {
          event_id: number
          quantity: number
        }
        Returns: undefined
      }
      update_shop_rating: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Radical simplification to break TS2589 recursion
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

