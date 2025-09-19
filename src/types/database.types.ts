export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          created_at: string;
          id: number;
          imageUrl: string;
          name: string;
          products: number[] | null;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          imageUrl: string;
          name: string;
          products?: number[] | null;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          imageUrl?: string;
          name?: string;
          products?: number[] | null;
          slug?: string;
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
