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
      categories: {
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
      challenges: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: number
          reward_points: number
          shop_id: number | null
          start_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: number
          reward_points: number
          shop_id?: number | null
          start_date: string
          status: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: number
          reward_points?: number
          shop_id?: number | null
          start_date?: string
          status: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          id: number
          image_url: string | null
          shop_id: number | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          shop_id?: number | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          shop_id?: number | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: number
          image_url: string | null
          location: string | null
          mall_id: number | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: number
          image_url?: string | null
          location?: string | null
          mall_id?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: number
          image_url?: string | null
          location?: string | null
          mall_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_mall_id_fkey"
            columns: ["mall_id"]
            isOneToOne: false
            referencedRelation: "malls"
            referencedColumns: ["id"]
          },
        ]
      }
      malls: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          opening_hours: string | null
          phone: string | null
          slug: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          opening_hours?: string | null
          phone?: string | null
          slug: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: string | null
          phone?: string | null
          slug?: string
        }
        Relationships: []
      }
      order: {
        Row: {
          created_at: string
          fulfillment_status: string | null
          fulfillment_token: string | null
          id: number
          status: string
          total_amount: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          fulfillment_status?: string | null
          fulfillment_token?: string | null
          id?: number
          status?: string
          total_amount?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          fulfillment_status?: string | null
          fulfillment_token?: string | null
          id?: number
          status?: string
          total_amount?: number | null
          user_id?: string
        }
        Relationships: []
      }
      order_item: {
        Row: {
          created_at: string
          id: number
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          price?: number
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          shop_id: number
          stock: number
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          shop_id: number
          stock?: number
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          shop_id?: number
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      service_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: number
          is_available: boolean | null
          service_id: number
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: number
          is_available?: boolean | null
          service_id: number
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: number
          is_available?: boolean | null
          service_id?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_booking: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          customer_name: string
          customer_notes: string | null
          duration_minutes: number
          id: number
          service_id: number
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          customer_name: string
          customer_notes?: string | null
          duration_minutes: number
          id?: number
          service_id: number
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_name?: string
          customer_notes?: string | null
          duration_minutes?: number
          id?: number
          service_id?: number
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_booking_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_provider: {
        Row: {
          bio: string | null
          created_at: string
          id: number
          name: string
          phone: string | null
          shop_id: number
          specialties: string[] | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: number
          name: string
          phone?: string | null
          shop_id: number
          specialties?: string[] | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: number
          name?: string
          phone?: string | null
          shop_id?: number
          specialties?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_provider_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_provider_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      service_review: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          rating: number
          service_id: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          rating: number
          service_id: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          rating?: number
          service_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_review_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: number
          image_url: string | null
          name: string
          price: number
          provider_id: number | null
          shop_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: number
          image_url?: string | null
          name: string
          price: number
          provider_id?: number | null
          shop_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          provider_id?: number | null
          shop_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_features: {
        Row: {
          feature_key: string
          feature_value: string
          id: number
          shop_id: number
        }
        Insert: {
          feature_key: string
          feature_value: string
          id?: number
          shop_id: number
        }
        Update: {
          feature_key?: string
          feature_value?: string
          id?: number
          shop_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_features_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_features_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          order_id: number | null
          rating: number
          shop_id: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          order_id?: number | null
          rating: number
          shop_id: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          order_id?: number | null
          rating?: number
          shop_id?: number
          user_id?: string
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
          category: string
          created_at: string
          description: string | null
          floor: number | null
          id: number
          image_url: string | null
          mall_id: number | null
          name: string
          opening_hours: string | null
          phone: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: number
          image_url?: string | null
          mall_id?: number | null
          name: string
          opening_hours?: string | null
          phone?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: number
          image_url?: string | null
          mall_id?: number | null
          name?: string
          opening_hours?: string | null
          phone?: string | null
        }
        Relationships: [
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
          event_id: number
          id: number
          quantity: number
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          quantity: number
          total_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          quantity?: number
          total_price?: number
          user_id?: string
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
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          loyalty_points: number | null
          name: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          loyalty_points?: number | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          loyalty_points?: number | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      shops_with_product_count: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          floor: number | null
          id: number | null
          image_url: string | null
          mall_id: number | null
          name: string | null
          opening_hours: string | null
          phone: string | null
          product_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_mall_id_fkey"
            columns: ["mall_id"]
            isOneToOne: false
            referencedRelation: "malls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

type SchemaName = keyof Omit<Database, "__InternalSupabase">

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: SchemaName },
  EnumName extends PublicEnumNameOrOptions extends { schema: SchemaName }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: SchemaName }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: SchemaName },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: SchemaName
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: SchemaName }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
