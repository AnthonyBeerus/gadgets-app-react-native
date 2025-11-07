export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Color variant type for JSONB column
export type ColorVariant = {
  color_name: string;
  color_hex: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
};

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          appointment_booking: boolean | null;
          collection: boolean | null;
          created_at: string;
          delivery: boolean | null;
          id: number;
          imageUrl: string;
          name: string;
          products: number[] | null;
          slug: string;
          virtual_try_on: boolean | null;
        };
        Insert: {
          appointment_booking?: boolean | null;
          collection?: boolean | null;
          created_at?: string;
          delivery?: boolean | null;
          id?: number;
          imageUrl: string;
          name: string;
          products?: number[] | null;
          slug: string;
          virtual_try_on?: boolean | null;
        };
        Update: {
          appointment_booking?: boolean | null;
          collection?: boolean | null;
          created_at?: string;
          delivery?: boolean | null;
          id?: number;
          imageUrl?: string;
          name?: string;
          products?: number[] | null;
          slug?: string;
          virtual_try_on?: boolean | null;
        };
        Relationships: [];
      };
      order: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          slug: string;
          status: string;
          totalPrice: number;
          user: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          slug: string;
          status: string;
          totalPrice: number;
          user: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          slug?: string;
          status?: string;
          totalPrice?: number;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      order_item: {
        Row: {
          created_at: string;
          id: number;
          order: number;
          product: number;
          quantity: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          order: number;
          product: number;
          quantity: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          order?: number;
          product?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_item_order_fkey";
            columns: ["order"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_item_product_fkey";
            columns: ["product"];
            isOneToOne: false;
            referencedRelation: "product";
            referencedColumns: ["id"];
          }
        ];
      };
      product: {
        Row: {
          category: number;
          created_at: string;
          heroImage: string;
          id: number;
          imagesUrl: string[];
          maxQuantity: number;
          price: number;
          slug: string;
          title: string;
          shop_id: number | null;
          color_variants: ColorVariant[];
        };
        Insert: {
          category: number;
          created_at?: string;
          heroImage: string;
          id?: number;
          imagesUrl: string[];
          maxQuantity: number;
          price: number;
          slug: string;
          title: string;
          shop_id?: number | null;
          color_variants?: ColorVariant[];
        };
        Update: {
          category?: number;
          created_at?: string;
          heroImage?: string;
          id?: number;
          imagesUrl?: string[];
          maxQuantity?: number;
          price?: number;
          slug?: string;
          title?: string;
          shop_id?: number | null;
          color_variants?: ColorVariant[];
        };
        Relationships: [
          {
            foreignKeyName: "product_category_fkey";
            columns: ["category"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          }
        ];
      };
      product_variants: {
        Row: {
          id: number;
          product_id: number;
          color_name: string;
          color_hex: string;
          image_url: string | null;
          stock_quantity: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          color_name: string;
          color_hex: string;
          image_url?: string | null;
          stock_quantity?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          color_name?: string;
          color_hex?: string;
          image_url?: string | null;
          stock_quantity?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "product";
            referencedColumns: ["id"];
          }
        ];
      };
      service: {
        Row: {
          category_id: number;
          created_at: string;
          description: string | null;
          duration_minutes: number;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          max_advance_booking_days: number | null;
          name: string;
          price: number;
          provider_id: number;
          rating: number | null;
          slug: string;
          total_reviews: number | null;
        };
        Insert: {
          category_id: number;
          created_at?: string;
          description?: string | null;
          duration_minutes: number;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          max_advance_booking_days?: number | null;
          name: string;
          price: number;
          provider_id: number;
          rating?: number | null;
          slug: string;
          total_reviews?: number | null;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          max_advance_booking_days?: number | null;
          name?: string;
          price?: number;
          provider_id?: number;
          rating?: number | null;
          slug?: string;
          total_reviews?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "service_provider";
            referencedColumns: ["id"];
          }
        ];
      };
      service_availability: {
        Row: {
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: number;
          is_available: boolean | null;
          provider_id: number;
          service_id: number | null;
          start_time: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: number;
          is_available?: boolean | null;
          provider_id: number;
          service_id?: number | null;
          start_time: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: number;
          is_available?: boolean | null;
          provider_id?: number;
          service_id?: number | null;
          start_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_availability_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "service_provider";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_availability_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "service";
            referencedColumns: ["id"];
          }
        ];
      };
      service_booking: {
        Row: {
          booking_date: string;
          booking_time: string;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          completed_at: string | null;
          created_at: string;
          duration_minutes: number;
          id: number;
          notes: string | null;
          payment_intent_id: string | null;
          payment_status: string | null;
          provider_id: number;
          service_id: number;
          slug: string;
          status: string | null;
          total_amount: number;
          user_id: string;
        };
        Insert: {
          booking_date: string;
          booking_time: string;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          duration_minutes: number;
          id?: number;
          notes?: string | null;
          payment_intent_id?: string | null;
          payment_status?: string | null;
          provider_id: number;
          service_id: number;
          slug: string;
          status?: string | null;
          total_amount: number;
          user_id: string;
        };
        Update: {
          booking_date?: string;
          booking_time?: string;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          duration_minutes?: number;
          id?: number;
          notes?: string | null;
          payment_intent_id?: string | null;
          payment_status?: string | null;
          provider_id?: number;
          service_id?: number;
          slug?: string;
          status?: string | null;
          total_amount?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_booking_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "service_provider";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_booking_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "service";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_booking_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      service_category: {
        Row: {
          color: string;
          created_at: string;
          description: string;
          icon: string;
          id: number;
          is_active: boolean | null;
          name: string;
          slug: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          description: string;
          icon: string;
          id?: number;
          is_active?: boolean | null;
          name: string;
          slug: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: number;
          is_active?: boolean | null;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      service_provider: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          created_at: string;
          description: string | null;
          email: string;
          id: number;
          is_active: boolean | null;
          is_verified: boolean | null;
          name: string;
          phone: string | null;
          rating: number | null;
          total_reviews: number | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          description?: string | null;
          email: string;
          id?: number;
          is_active?: boolean | null;
          is_verified?: boolean | null;
          name: string;
          phone?: string | null;
          rating?: number | null;
          total_reviews?: number | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string;
          id?: number;
          is_active?: boolean | null;
          is_verified?: boolean | null;
          name?: string;
          phone?: string | null;
          rating?: number | null;
          total_reviews?: number | null;
        };
        Relationships: [];
      };
      service_review: {
        Row: {
          booking_id: number;
          comment: string | null;
          created_at: string;
          id: number;
          is_verified: boolean | null;
          provider_id: number;
          rating: number;
          service_id: number;
          user_id: string;
        };
        Insert: {
          booking_id: number;
          comment?: string | null;
          created_at?: string;
          id?: number;
          is_verified?: boolean | null;
          provider_id: number;
          rating: number;
          service_id: number;
          user_id: string;
        };
        Update: {
          booking_id?: number;
          comment?: string | null;
          created_at?: string;
          id?: number;
          is_verified?: boolean | null;
          provider_id?: number;
          rating?: number;
          service_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_review_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "service_booking";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_review_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "service_provider";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_review_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "service";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_review_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      event_venue: {
        Row: {
          id: number;
          name: string;
          type: string;
          location: string;
          description: string;
          capacity: string;
          amenities: string[];
          price_range: string;
          phone: string;
          email: string | null;
          is_available: boolean;
          created_at: string;
          image_url: string | null;
          icon: string;
          color: string;
        };
        Insert: {
          id?: number;
          name: string;
          type: string;
          location: string;
          description: string;
          capacity: string;
          amenities: string[];
          price_range: string;
          phone: string;
          email?: string | null;
          is_available?: boolean;
          created_at?: string;
          image_url?: string | null;
          icon: string;
          color: string;
        };
        Update: {
          id?: number;
          name?: string;
          type?: string;
          location?: string;
          description?: string;
          capacity?: string;
          amenities?: string[];
          price_range?: string;
          phone?: string;
          email?: string | null;
          is_available?: boolean;
          created_at?: string;
          image_url?: string | null;
          icon?: string;
          color?: string;
        };
        Relationships: [];
      };
      event_booking: {
        Row: {
          id: number;
          venue_id: number;
          user_id: string;
          event_name: string;
          event_type: string;
          event_date: string;
          start_time: string;
          end_time: string;
          estimated_guests: number;
          special_requirements: string | null;
          contact_phone: string;
          contact_email: string;
          total_price: number;
          status: string;
          created_at: string;
          notes: string | null;
        };
        Insert: {
          id?: number;
          venue_id: number;
          user_id: string;
          event_name: string;
          event_type: string;
          event_date: string;
          start_time: string;
          end_time: string;
          estimated_guests: number;
          special_requirements?: string | null;
          contact_phone: string;
          contact_email: string;
          total_price: number;
          status?: string;
          created_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: number;
          venue_id?: number;
          user_id?: string;
          event_name?: string;
          event_type?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          estimated_guests?: number;
          special_requirements?: string | null;
          contact_phone?: string;
          contact_email?: string;
          total_price?: number;
          status?: string;
          created_at?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_booking_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "event_venue";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_booking_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          id: number;
          title: string;
          description: string;
          venue_id: number | null;
          category: string;
          event_date: string;
          start_time: string;
          end_time: string;
          image_url: string | null;
          price: number;
          total_tickets: number;
          available_tickets: number;
          is_featured: boolean;
          tags: string[] | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          venue_id?: number | null;
          category: string;
          event_date: string;
          start_time: string;
          end_time: string;
          image_url?: string | null;
          price: number;
          total_tickets?: number;
          available_tickets?: number;
          is_featured?: boolean;
          tags?: string[] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          venue_id?: number | null;
          category?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          image_url?: string | null;
          price?: number;
          total_tickets?: number;
          available_tickets?: number;
          is_featured?: boolean;
          tags?: string[] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "event_venue";
            referencedColumns: ["id"];
          }
        ];
      };
      ticket_purchases: {
        Row: {
          id: number;
          event_id: number;
          user_id: string;
          quantity: number;
          total_price: number;
          purchase_date: string;
          status: string;
          payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          event_id: number;
          user_id: string;
          quantity?: number;
          total_price: number;
          purchase_date?: string;
          status?: string;
          payment_intent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          event_id?: number;
          user_id?: string;
          quantity?: number;
          total_price?: number;
          purchase_date?: string;
          status?: string;
          payment_intent_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ticket_purchases_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ticket_purchases_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string;
          created_at: string | null;
          email: string;
          expo_notification_token: string | null;
          id: string;
          stripe_customer_id: string | null;
          type: string | null;
        };
        Insert: {
          avatar_url: string;
          created_at?: string | null;
          email: string;
          expo_notification_token?: string | null;
          id: string;
          stripe_customer_id?: string | null;
          type?: string | null;
        };
        Update: {
          avatar_url?: string;
          created_at?: string | null;
          email?: string;
          expo_notification_token?: string | null;
          id?: string;
          stripe_customer_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      appointments: {
        Row: {
          appointment_date: string;
          appointment_time: string;
          created_at: string;
          customer_email: string | null;
          customer_name: string;
          customer_phone: string;
          duration_minutes: number | null;
          id: number;
          notes: string | null;
          price: number | null;
          service_type: string;
          shop_id: number;
          special_requests: string | null;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          appointment_date: string;
          appointment_time: string;
          created_at?: string;
          customer_email?: string | null;
          customer_name: string;
          customer_phone: string;
          duration_minutes?: number | null;
          id?: number;
          notes?: string | null;
          price?: number | null;
          service_type: string;
          shop_id: number;
          special_requests?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          appointment_date?: string;
          appointment_time?: string;
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string;
          customer_phone?: string;
          duration_minutes?: number | null;
          id?: number;
          notes?: string | null;
          price?: number | null;
          service_type?: string;
          shop_id?: number;
          special_requests?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      delivery_orders: {
        Row: {
          actual_delivery_time: string | null;
          collection_time: string | null;
          created_at: string;
          delivery_address: string | null;
          delivery_fee: number | null;
          delivery_notes: string | null;
          delivery_person_name: string | null;
          delivery_person_phone: string | null;
          delivery_phone: string;
          delivery_type: string;
          estimated_delivery_time: string | null;
          id: number;
          order_id: number;
          shop_id: number;
          status: string | null;
          tracking_number: string | null;
          updated_at: string;
        };
        Insert: {
          actual_delivery_time?: string | null;
          collection_time?: string | null;
          created_at?: string;
          delivery_address?: string | null;
          delivery_fee?: number | null;
          delivery_notes?: string | null;
          delivery_person_name?: string | null;
          delivery_person_phone?: string | null;
          delivery_phone: string;
          delivery_type: string;
          estimated_delivery_time?: string | null;
          id?: number;
          order_id: number;
          shop_id: number;
          status?: string | null;
          tracking_number?: string | null;
          updated_at?: string;
        };
        Update: {
          actual_delivery_time?: string | null;
          collection_time?: string | null;
          created_at?: string;
          delivery_address?: string | null;
          delivery_fee?: number | null;
          delivery_notes?: string | null;
          delivery_person_name?: string | null;
          delivery_person_phone?: string | null;
          delivery_phone?: string;
          delivery_type?: string;
          estimated_delivery_time?: string | null;
          id?: number;
          order_id?: number;
          shop_id?: number;
          status?: string | null;
          tracking_number?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "delivery_orders_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "delivery_orders_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          }
        ];
      };
      shop_reviews: {
        Row: {
          created_at: string;
          id: number;
          is_verified_purchase: boolean | null;
          order_id: number | null;
          rating: number;
          review_text: string | null;
          shop_id: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_verified_purchase?: boolean | null;
          order_id?: number | null;
          rating: number;
          review_text?: string | null;
          shop_id: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_verified_purchase?: boolean | null;
          order_id?: number | null;
          rating?: number;
          review_text?: string | null;
          shop_id?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_reviews_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_reviews_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      shops: {
        Row: {
          category_id: number;
          created_at: string;
          delivery_fee: number | null;
          description: string | null;
          estimated_delivery_time: string | null;
          has_appointment_booking: boolean | null;
          has_collection: boolean | null;
          has_delivery: boolean | null;
          has_online_ordering: boolean | null;
          has_virtual_try_on: boolean | null;
          id: number;
          image_url: string | null;
          is_featured: boolean | null;
          location: string | null;
          minimum_order_amount: number | null;
          name: string;
          opening_hours: Json | null;
          phone: string | null;
          rating: number | null;
        };
        Insert: {
          category_id: number;
          created_at?: string;
          delivery_fee?: number | null;
          description?: string | null;
          estimated_delivery_time?: string | null;
          has_appointment_booking?: boolean | null;
          has_collection?: boolean | null;
          has_delivery?: boolean | null;
          has_online_ordering?: boolean | null;
          has_virtual_try_on?: boolean | null;
          id?: number;
          image_url?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          minimum_order_amount?: number | null;
          name: string;
          opening_hours?: Json | null;
          phone?: string | null;
          rating?: number | null;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          delivery_fee?: number | null;
          description?: string | null;
          estimated_delivery_time?: string | null;
          has_appointment_booking?: boolean | null;
          has_collection?: boolean | null;
          has_delivery?: boolean | null;
          has_online_ordering?: boolean | null;
          has_virtual_try_on?: boolean | null;
          id?: number;
          image_url?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          minimum_order_amount?: number | null;
          name?: string;
          opening_hours?: Json | null;
          phone?: string | null;
          rating?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "shops_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_product_quantity: {
        Args: {
          product_id: number;
          quantity: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
