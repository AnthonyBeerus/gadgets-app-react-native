
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
        Relationships: [
          {
            foreignKeyName: "appointments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
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
      delivery_orders: {
        Row: {
          actual_delivery_time: string | null
          collection_time: string | null
          created_at: string
          delivery_address: string | null
          delivery_fee: number | null
          delivery_notes: string | null
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
          delivery_notes?: string | null
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
          delivery_notes?: string | null
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
        Relationships: [
          {
            foreignKeyName: "delivery_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      event_venue: {
        Row: {
          amenities: string[] | null
          capacity: string
          color: string | null
          created_at: string
          description: string
          email: string | null
          icon: string | null
          id: number
          image_url: string | null
          is_available: boolean | null
          location: string
          name: string
          phone: string | null
          price_range: string | null
          type: string
        }
        Insert: {
          amenities?: string[] | null
          capacity: string
          color?: string | null
          created_at?: string
          description: string
          email?: string | null
          icon?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          location: string
          name: string
          phone?: string | null
          price_range?: string | null
          type: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: string
          color?: string | null
          created_at?: string
          description?: string
          email?: string | null
          icon?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          location?: string
          name?: string
          phone?: string | null
          price_range?: string | null
          type?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          available_tickets: number
          category: string
          created_at: string
          description: string
          end_time: string
          event_date: string
          id: number
          image_url: string | null
          is_featured: boolean | null
          price: number
          start_time: string
          status: string | null
          tags: string[] | null
          title: string
          total_tickets: number
          updated_at: string
          venue_id: number | null
        }
        Insert: {
          available_tickets?: number
          category: string
          created_at?: string
          description: string
          end_time: string
          event_date: string
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          price: number
          start_time: string
          status?: string | null
          tags?: string[] | null
          title: string
          total_tickets?: number
          updated_at?: string
          venue_id?: number | null
        }
        Update: {
          available_tickets?: number
          category?: string
          created_at?: string
          description?: string
          end_time?: string
          event_date?: string
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          price?: number
          start_time?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          total_tickets?: number
          updated_at?: string
          venue_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "event_venue"
            referencedColumns: ["id"]
          },
        ]
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
          id: number
          slug: string
          status: string
          totalPrice: number
          user: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          slug: string
          status: string
          totalPrice: number
          user: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          slug?: string
          status?: string
          totalPrice?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "order_item_order_fkey"
            columns: ["order"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          brand: string | null
          category: number
          color_variants: Json | null
          created_at: string
          description: string | null
          dimensions: Json | null
          heroImage: string
          id: number
          imagesUrl: string[]
          is_available: boolean | null
          maxQuantity: number
          price: number
          shop_id: number | null
          sku: string | null
          slug: string
          title: string
          weight: number | null
        }
        Insert: {
          brand?: string | null
          category: number
          color_variants?: Json | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          heroImage: string
          id?: number
          imagesUrl: string[]
          is_available?: boolean | null
          maxQuantity: number
          price: number
          shop_id?: number | null
          sku?: string | null
          slug: string
          title: string
          weight?: number | null
        }
        Update: {
          brand?: string | null
          category?: number
          color_variants?: Json | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          heroImage?: string
          id?: number
          imagesUrl?: string[]
          is_available?: boolean | null
          maxQuantity?: number
          price?: number
          shop_id?: number | null
          sku?: string | null
          slug?: string
          title?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      service: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          duration_minutes: number
          id: number
          image_url: string | null
          is_active: boolean | null
          max_advance_booking_days: number | null
          name: string
          price: number
          provider_id: number
          rating: number | null
          slug: string
          total_reviews: number | null
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          name: string
          price: number
          provider_id: number
          rating?: number | null
          slug: string
          total_reviews?: number | null
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          name?: string
          price?: number
          provider_id?: number
          rating?: number | null
          slug?: string
          total_reviews?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "service_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      service_booking: {
        Row: {
          booking_date: string
          booking_time: string
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: number
          notes: string | null
          payment_intent_id: string | null
          payment_status: string
          provider_id: number
          service_id: number
          slug: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          id?: number
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string
          provider_id: number
          service_id: number
          slug: string
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: number
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string
          provider_id?: number
          service_id?: number
          slug?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_booking_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_booking_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_booking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_category: {
        Row: {
          color: string
          created_at: string
          description: string
          icon: string
          id: number
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          color: string
          created_at?: string
          description: string
          icon: string
          id?: number
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      service_provider: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          description: string | null
          email: string
          id: number
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          phone: string | null
          rating: number | null
          total_reviews: number | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
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
        Relationships: [
          {
            foreignKeyName: "service_review_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "service_booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_review_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_review_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_review_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "shop_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
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
          mall_id: number | null
          minimum_order_amount: number | null
          name: string
          opening_hours: Json | null
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
          mall_id?: number | null
          minimum_order_amount?: number | null
          name: string
          opening_hours?: Json | null
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
          mall_id?: number | null
          minimum_order_amount?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shops_mall_id_fkey"
            columns: ["mall_id"]
            isOneToOne: false
            referencedRelation: "malls"
            referencedColumns: ["id"]
          },
        ]
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
          purchase_date?: string
          quantity?: number
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
        Relationships: [
          {
            foreignKeyName: "ticket_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string
          created_at: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          type: string | null
        }
        Insert: {
          avatar_url: string
          created_at?: string | null
          email: string
          id: string
          stripe_customer_id?: string | null
          type?: string | null
        }
        Update: {
          avatar_url?: string
          created_at?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      shops_with_product_count: {
        Row: {
          category_id: number | null
          created_at: string | null
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
          id: number | null
          image_url: string | null
          instagram_handle: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          logo_url: string | null
          minimum_order_amount: number | null
          name: string | null
          opening_hours: Json | null
          phone: string | null
          product_count: number | null
          rating: number | null
          total_reviews: number | null
          updated_at: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      decrement_product_quantity: {
        Args: { product_id: number; quantity: number }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
