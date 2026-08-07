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
    PostgrestVersion: "14.5"
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
          imageUrl: string
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
          imageUrl: string
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
          imageUrl?: string
          name?: string
          products?: number[] | null
          slug?: string
        }
        Relationships: []
      }
      challenge_qualifying_products: {
        Row: {
          challenge_id: number
          created_at: string
          product_id: number
        }
        Insert: {
          challenge_id: number
          created_at?: string
          product_id: number
        }
        Update: {
          challenge_id?: number
          created_at?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_qualifying_products_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_qualifying_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          caption: string | null
          challenge_id: number
          comment_count: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          like_count: number
          media_type: string | null
          metrics_captured_at: string | null
          platform: string
          platform_account_id: number | null
          platform_author_open_id: string | null
          platform_video_id: string | null
          post_description: string | null
          post_published_at: string | null
          public_share_url: string | null
          purchase_proof_id: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          save_count: number
          score: number
          status: string
          user_id: string
          verification_status: string
          verified_at: string | null
          view_count: number
        }
        Insert: {
          caption?: string | null
          challenge_id: number
          comment_count?: number
          consent_version?: string | null
          consented_at?: string | null
          content_url?: string | null
          created_at?: string
          final_rank?: number | null
          id?: never
          like_count?: number
          media_type?: string | null
          metrics_captured_at?: string | null
          platform?: string
          platform_account_id?: number | null
          platform_author_open_id?: string | null
          platform_video_id?: string | null
          post_description?: string | null
          post_published_at?: string | null
          public_share_url?: string | null
          purchase_proof_id?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_count?: number
          score?: number
          status?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          view_count?: number
        }
        Update: {
          caption?: string | null
          challenge_id?: number
          comment_count?: number
          consent_version?: string | null
          consented_at?: string | null
          content_url?: string | null
          created_at?: string
          final_rank?: number | null
          id?: never
          like_count?: number
          media_type?: string | null
          metrics_captured_at?: string | null
          platform?: string
          platform_account_id?: number | null
          platform_author_open_id?: string | null
          platform_video_id?: string | null
          post_description?: string | null
          post_published_at?: string | null
          public_share_url?: string | null
          purchase_proof_id?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          save_count?: number
          score?: number
          status?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "creator_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_purchase_proof_id_fkey"
            columns: ["purchase_proof_id"]
            isOneToOne: false
            referencedRelation: "purchase_proofs"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          ai_allowed: boolean | null
          brand_logo_url: string | null
          brand_name: string
          category: string | null
          consolation_voucher_value: number | null
          contest_mode: string
          created_at: string | null
          deadline: string
          description: string
          entry_fee: number | null
          id: number
          image_url: string
          is_premium: boolean | null
          manual_verification_enabled: boolean
          participants_count: number | null
          pot_currency: string
          pot_splits: Json
          pot_value: number | null
          product_id: number | null
          requirements: string[]
          reward: string
          reward_currency: string
          reward_value: number
          score_rule: string
          settled_at: string | null
          shop_id: number | null
          status: string
          title: string
          type: string
          updated_at: string | null
          voucher_valid_days: number
        }
        Insert: {
          ai_allowed?: boolean | null
          brand_logo_url?: string | null
          brand_name: string
          category?: string | null
          consolation_voucher_value?: number | null
          contest_mode?: string
          created_at?: string | null
          deadline: string
          description: string
          entry_fee?: number | null
          id?: number
          image_url: string
          is_premium?: boolean | null
          manual_verification_enabled?: boolean
          participants_count?: number | null
          pot_currency?: string
          pot_splits?: Json
          pot_value?: number | null
          product_id?: number | null
          requirements: string[]
          reward: string
          reward_currency?: string
          reward_value?: number
          score_rule?: string
          settled_at?: string | null
          shop_id?: number | null
          status?: string
          title: string
          type?: string
          updated_at?: string | null
          voucher_valid_days?: number
        }
        Update: {
          ai_allowed?: boolean | null
          brand_logo_url?: string | null
          brand_name?: string
          category?: string | null
          consolation_voucher_value?: number | null
          contest_mode?: string
          created_at?: string | null
          deadline?: string
          description?: string
          entry_fee?: number | null
          id?: number
          image_url?: string
          is_premium?: boolean | null
          manual_verification_enabled?: boolean
          participants_count?: number | null
          pot_currency?: string
          pot_splits?: Json
          pot_value?: number | null
          product_id?: number | null
          requirements?: string[]
          reward?: string
          reward_currency?: string
          reward_value?: number
          score_rule?: string
          settled_at?: string | null
          shop_id?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          voucher_valid_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
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
      creator_oauth_states: {
        Row: {
          consumed_at: string | null
          expires_at: string
          redirect_uri: string
          state: string
          user_id: string
        }
        Insert: {
          consumed_at?: string | null
          expires_at: string
          redirect_uri: string
          state: string
          user_id: string
        }
        Update: {
          consumed_at?: string | null
          expires_at?: string
          redirect_uri?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_opportunity_events: {
        Row: {
          created_at: string
          event_type: string
          id: number
          opportunity_id: number
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: number
          opportunity_id: number
          source: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: number
          opportunity_id?: number
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_opportunity_events_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_opportunity_preferences: {
        Row: {
          created_at: string
          dismissed_until: string | null
          opportunity_id: number
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dismissed_until?: string | null
          opportunity_id: number
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dismissed_until?: string | null
          opportunity_id?: number
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_opportunity_preferences_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_platform_accounts: {
        Row: {
          avatar_url: string | null
          connected_at: string
          connection_status: string
          display_name: string | null
          granted_scopes: string[]
          id: number
          platform: string
          platform_open_id: string
          profile_deep_link: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          connected_at?: string
          connection_status?: string
          display_name?: string | null
          granted_scopes?: string[]
          id?: number
          platform?: string
          platform_open_id: string
          profile_deep_link?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          connected_at?: string
          connection_status?: string
          display_name?: string | null
          granted_scopes?: string[]
          id?: number
          platform?: string
          platform_open_id?: string
          profile_deep_link?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_platform_tokens: {
        Row: {
          access_expires_at: string
          access_token: string
          account_id: number
          refresh_expires_at: string
          refresh_token: string
          updated_at: string
        }
        Insert: {
          access_expires_at: string
          access_token: string
          account_id: number
          refresh_expires_at: string
          refresh_token: string
          updated_at?: string
        }
        Update: {
          access_expires_at?: string
          access_token?: string
          account_id?: number
          refresh_expires_at?: string
          refresh_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_platform_tokens_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "creator_platform_accounts"
            referencedColumns: ["id"]
          },
        ]
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
          shop_id: number | null
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
          shop_id?: number | null
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
          shop_id?: number | null
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
            foreignKeyName: "events_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
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
      merchant_purchase_codes: {
        Row: {
          amount: number
          claimed_at: string | null
          claimed_by: string | null
          code: string
          created_at: string
          created_by: string
          currency: string
          expires_at: string
          id: number
          product_id: number
          shop_id: number
        }
        Insert: {
          amount?: number
          claimed_at?: string | null
          claimed_by?: string | null
          code: string
          created_at?: string
          created_by: string
          currency?: string
          expires_at: string
          id?: number
          product_id: number
          shop_id: number
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          claimed_by?: string | null
          code?: string
          created_at?: string
          created_by?: string
          currency?: string
          expires_at?: string
          id?: number
          product_id?: number
          shop_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "merchant_purchase_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_purchase_codes_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_purchase_codes_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          created_at: string
          description: string | null
          discovery_source: string | null
          fulfillment_token: string | null
          id: number
          opportunity_id: number | null
          payment_intent_id: string | null
          slug: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_payment_status: string | null
          totalPrice: number
          user: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discovery_source?: string | null
          fulfillment_token?: string | null
          id?: number
          opportunity_id?: number | null
          payment_intent_id?: string | null
          slug: string
          status: string
          stripe_payment_intent_id?: string | null
          stripe_payment_status?: string | null
          totalPrice: number
          user: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discovery_source?: string | null
          fulfillment_token?: string | null
          id?: number
          opportunity_id?: number | null
          payment_intent_id?: string | null
          slug?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_payment_status?: string | null
          totalPrice?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
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
          price: number
          product: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order: number
          price?: number
          product: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          price?: number
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
      product_variants: {
        Row: {
          color_hex: string
          color_name: string
          created_at: string | null
          id: number
          image_url: string | null
          is_available: boolean | null
          product_id: number
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          color_hex: string
          color_name: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          product_id: number
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          color_hex?: string
          color_name?: string
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          product_id?: number
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_proofs: {
        Row: {
          amount: number
          claimed_at: string | null
          consumed_by_submission_id: number | null
          created_at: string
          currency: string
          expires_at: string | null
          id: number
          order_id: number | null
          product_id: number
          redemption_code: string | null
          shop_id: number
          source: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          claimed_at?: string | null
          consumed_by_submission_id?: number | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: number
          order_id?: number | null
          product_id: number
          redemption_code?: string | null
          shop_id: number
          source: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          consumed_by_submission_id?: number | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: number
          order_id?: number | null
          product_id?: number
          redemption_code?: string | null
          shop_id?: number
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_proofs_consumed_by_submission_id_fkey"
            columns: ["consumed_by_submission_id"]
            isOneToOne: false
            referencedRelation: "challenge_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_proofs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_proofs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_proofs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_vouchers: {
        Row: {
          code: string
          created_at: string
          currency: string
          expires_at: string
          id: number
          placement_rank: number | null
          prize_kind: string
          redeemed_at: string | null
          redeemed_by: string | null
          shop_id: number
          submission_id: number
          user_id: string
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          expires_at: string
          id?: number
          placement_rank?: number | null
          prize_kind?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          shop_id: number
          submission_id: number
          user_id: string
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          expires_at?: string
          id?: number
          placement_rank?: number | null
          prize_kind?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          shop_id?: number
          submission_id?: number
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_vouchers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_vouchers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops_with_product_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_vouchers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "challenge_submissions"
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
          shop_id: number | null
          total_reviews: number | null
          user_id: string | null
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
          shop_id?: number | null
          total_reviews?: number | null
          user_id?: string | null
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
          shop_id?: number | null
          total_reviews?: number | null
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
          mall_id?: number | null
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
          mall_id?: number | null
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
          mall_id: number | null
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
      can_manage_challenge: {
        Args: { p_challenge_id: number }
        Returns: boolean
      }
      claim_merchant_purchase_code: {
        Args: { p_code: string }
        Returns: {
          amount: number
          claimed_at: string | null
          consumed_by_submission_id: number | null
          created_at: string
          currency: string
          expires_at: string | null
          id: number
          order_id: number | null
          product_id: number
          redemption_code: string | null
          shop_id: number
          source: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "purchase_proofs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      compute_engagement_score: {
        Args: { p_comments: number; p_likes: number; p_saves: number }
        Returns: number
      }
      create_dev_merchant: { Args: never; Returns: Json }
      create_merchant_purchase_code: {
        Args: { p_amount: number; p_expires_at: string; p_product_id: number }
        Returns: {
          amount: number
          claimed_at: string | null
          claimed_by: string | null
          code: string
          created_at: string
          created_by: string
          currency: string
          expires_at: string
          id: number
          product_id: number
          shop_id: number
        }
        SetofOptions: {
          from: "*"
          to: "merchant_purchase_codes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_merchant_shop: {
        Args: {
          enable_collection?: boolean
          enable_delivery?: boolean
          image_url?: string
          logo_url?: string
          shop_category_id?: number
          shop_description?: string
          shop_location: string
          shop_mall_id?: number
          shop_name: string
        }
        Returns: Json
      }
      decrement_product_quantity: {
        Args: { product_id: number; quantity: number }
        Returns: undefined
      }
      get_challenge_leaderboard: {
        Args: { p_challenge_id: number }
        Returns: {
          comment_count: number
          final_rank: number
          like_count: number
          metrics_captured_at: string
          public_share_url: string
          save_count: number
          score: number
          status: string
          submission_id: number
          user_id: string
          view_count: number
        }[]
      }
      get_creator_opportunity_feed: {
        Args: {
          p_cursor?: number
          p_limit?: number
          p_mall_id?: number
          p_seed?: string
        }
        Returns: {
          category_id: number
          consolation_voucher_value: number
          contest_mode: string
          deadline: string
          eligibility_consumed: boolean
          eligibility_proof_id: number
          has_collection: boolean
          has_delivery: boolean
          hero_image: string
          mall_id: number
          max_quantity: number
          merchant_id: number
          merchant_location: string
          merchant_name: string
          opportunity_description: string
          opportunity_id: number
          opportunity_title: string
          pot_currency: string
          pot_splits: Json
          pot_value: number
          preference_state: string
          price: number
          product_description: string
          product_id: number
          product_slug: string
          product_title: string
          rank_score: number
          requirements: string[]
          reward_currency: string
          reward_value: number
          score_rule: string
          settled_at: string
        }[]
      }
      get_creator_opportunity_results: {
        Args: { p_challenge_id: number }
        Returns: {
          approved_posts: number
          attributed_purchases: number
          connected_creators: number
          detail_opens: number
          eligible_purchasers: number
          impressions: number
          saves: number
          submitted_posts: number
          verified_posts: number
          vouchers_issued: number
          vouchers_redeemed: number
        }[]
      }
      get_merchant_dashboard_stats: {
        Args: { target_shop_id: number }
        Returns: {
          pending_order_count: number
          product_count: number
          todays_sales: number
        }[]
      }
      get_saved_creator_opportunities: {
        Args: never
        Returns: {
          category_id: number
          consolation_voucher_value: number
          contest_mode: string
          deadline: string
          eligibility_consumed: boolean
          eligibility_proof_id: number
          has_collection: boolean
          has_delivery: boolean
          hero_image: string
          mall_id: number
          max_quantity: number
          merchant_id: number
          merchant_location: string
          merchant_name: string
          opportunity_description: string
          opportunity_id: number
          opportunity_title: string
          pot_currency: string
          pot_splits: Json
          pot_value: number
          preference_state: string
          price: number
          product_description: string
          product_id: number
          product_slug: string
          product_title: string
          rank_score: number
          requirements: string[]
          reward_currency: string
          reward_value: number
          score_rule: string
          settled_at: string
        }[]
      }
      mark_submission_manually_verified: {
        Args: { p_submission_id: number }
        Returns: undefined
      }
      merge_creator_opportunity_preferences: {
        Args: { p_preferences: Json }
        Returns: number
      }
      record_creator_opportunity_event: {
        Args: {
          p_event_type: string
          p_opportunity_id: number
          p_source: string
        }
        Returns: undefined
      }
      redeem_reward_voucher: { Args: { p_code: string }; Returns: Json }
      refresh_submission_metrics: {
        Args: {
          p_comment_count: number
          p_like_count: number
          p_save_count: number
          p_submission_id: number
          p_view_count?: number
        }
        Returns: {
          caption: string | null
          challenge_id: number
          comment_count: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          like_count: number
          media_type: string | null
          metrics_captured_at: string | null
          platform: string
          platform_account_id: number | null
          platform_author_open_id: string | null
          platform_video_id: string | null
          post_description: string | null
          post_published_at: string | null
          public_share_url: string | null
          purchase_proof_id: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          save_count: number
          score: number
          status: string
          user_id: string
          verification_status: string
          verified_at: string | null
          view_count: number
        }
        SetofOptions: {
          from: "*"
          to: "challenge_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      restore_creator_opportunity_preference: {
        Args: { p_opportunity_id: number }
        Returns: undefined
      }
      review_creator_submission: {
        Args: {
          p_decision: string
          p_rejection_reason?: string
          p_submission_id: number
        }
        Returns: Json
      }
      set_creator_opportunity_preference: {
        Args: { p_opportunity_id: number; p_state: string }
        Returns: {
          created_at: string
          dismissed_until: string | null
          opportunity_id: number
          state: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "creator_opportunity_preferences"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      settle_competitive_challenge: {
        Args: { p_challenge_id: number }
        Returns: Json
      }
      submit_creator_opportunity: {
        Args: {
          p_challenge_id: number
          p_consent_version: string
          p_platform_account_id: number
          p_platform_author_open_id: string
          p_platform_video_id: string
          p_post_description: string
          p_post_published_at: string
          p_public_share_url: string
          p_purchase_proof_id: number
          p_verification_status: string
        }
        Returns: {
          caption: string | null
          challenge_id: number
          comment_count: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          like_count: number
          media_type: string | null
          metrics_captured_at: string | null
          platform: string
          platform_account_id: number | null
          platform_author_open_id: string | null
          platform_video_id: string | null
          post_description: string | null
          post_published_at: string | null
          public_share_url: string | null
          purchase_proof_id: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          save_count: number
          score: number
          status: string
          user_id: string
          verification_status: string
          verified_at: string | null
          view_count: number
        }
        SetofOptions: {
          from: "*"
          to: "challenge_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
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
  public: {
    Enums: {},
  },
} as const
