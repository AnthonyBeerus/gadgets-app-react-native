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
      challenge_submissions: {
        Row: {
          asset_meta: Json
          asset_paths: string[]
          caption: string | null
          challenge_id: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          media_type: string | null
          merchant_note: string | null
          platform: string | null
          public_share_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_count: number
          status: string
          submitted_at: string | null
          thumbnail_path: string | null
          user_id: string
        }
        Insert: {
          asset_meta?: Json
          asset_paths?: string[]
          caption?: string | null
          challenge_id: number
          consent_version?: string | null
          consented_at?: string | null
          content_url?: string | null
          created_at?: string
          final_rank?: number | null
          id?: never
          media_type?: string | null
          merchant_note?: string | null
          platform?: string | null
          public_share_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_count?: number
          status?: string
          submitted_at?: string | null
          thumbnail_path?: string | null
          user_id: string
        }
        Update: {
          asset_meta?: Json
          asset_paths?: string[]
          caption?: string | null
          challenge_id?: number
          consent_version?: string | null
          consented_at?: string | null
          content_url?: string | null
          created_at?: string
          final_rank?: number | null
          id?: never
          media_type?: string | null
          merchant_note?: string | null
          platform?: string | null
          public_share_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_count?: number
          status?: string
          submitted_at?: string | null
          thumbnail_path?: string | null
          user_id?: string
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
            foreignKeyName: "challenge_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          ai_allowed: boolean | null
          brand_asset_paths: string[]
          brand_logo_url: string | null
          brand_name: string
          campaign_goal: string | null
          category: string | null
          closed_at: string | null
          content_format: string
          created_at: string | null
          deadline: string
          deliverable_count: number
          description: string
          donts: string[]
          dos: string[]
          id: number
          image_url: string
          participants_count: number | null
          pot_currency: string
          pot_splits: Json
          pot_value: number | null
          published_at: string | null
          requirements: string[]
          review_sla_days: number
          revisions_allowed: number
          reward: string
          reward_currency: string
          reward_value: number
          settled_at: string | null
          shop_id: number | null
          status: string
          talking_points: string[]
          title: string
          updated_at: string | null
          usage_rights: string
          video_max_seconds: number | null
          video_min_seconds: number | null
          voucher_valid_days: number
        }
        Insert: {
          ai_allowed?: boolean | null
          brand_asset_paths?: string[]
          brand_logo_url?: string | null
          brand_name: string
          campaign_goal?: string | null
          category?: string | null
          closed_at?: string | null
          content_format?: string
          created_at?: string | null
          deadline: string
          deliverable_count?: number
          description: string
          donts?: string[]
          dos?: string[]
          id?: number
          image_url: string
          participants_count?: number | null
          pot_currency?: string
          pot_splits?: Json
          pot_value?: number | null
          published_at?: string | null
          requirements: string[]
          review_sla_days?: number
          revisions_allowed?: number
          reward: string
          reward_currency?: string
          reward_value?: number
          settled_at?: string | null
          shop_id?: number | null
          status?: string
          talking_points?: string[]
          title: string
          updated_at?: string | null
          usage_rights?: string
          video_max_seconds?: number | null
          video_min_seconds?: number | null
          voucher_valid_days?: number
        }
        Update: {
          ai_allowed?: boolean | null
          brand_asset_paths?: string[]
          brand_logo_url?: string | null
          brand_name?: string
          campaign_goal?: string | null
          category?: string | null
          closed_at?: string | null
          content_format?: string
          created_at?: string | null
          deadline?: string
          deliverable_count?: number
          description?: string
          donts?: string[]
          dos?: string[]
          id?: number
          image_url?: string
          participants_count?: number | null
          pot_currency?: string
          pot_splits?: Json
          pot_value?: number | null
          published_at?: string | null
          requirements?: string[]
          review_sla_days?: number
          revisions_allowed?: number
          reward?: string
          reward_currency?: string
          reward_value?: number
          settled_at?: string | null
          shop_id?: number | null
          status?: string
          talking_points?: string[]
          title?: string
          updated_at?: string | null
          usage_rights?: string
          video_max_seconds?: number | null
          video_min_seconds?: number | null
          voucher_valid_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "creator_opportunity_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          {
            foreignKeyName: "creator_opportunity_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "reward_vouchers_redeemed_by_fkey"
            columns: ["redeemed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_vouchers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_vouchers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "challenge_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_vouchers_user_id_fkey"
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
            foreignKeyName: "shop_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
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
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          clerk_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          stripe_account_id: string | null
          stripe_customer_id: string | null
          type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string
          stripe_account_id?: string | null
          stripe_customer_id?: string | null
          type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string
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
      apply_order_payment_event: {
        Args: {
          p_event_id: string
          p_event_type: string
          p_payment_intent_id: string
        }
        Returns: number
      }
      campaign_prize_for_rank: {
        Args: {
          p_pot_splits: Json
          p_pot_value: number
          p_rank: number
          p_winner_count: number
        }
        Returns: number
      }
      can_manage_challenge: {
        Args: { p_challenge_id: number }
        Returns: boolean
      }
      close_campaign: {
        Args: { p_challenge_id: number }
        Returns: {
          ai_allowed: boolean | null
          brand_asset_paths: string[]
          brand_logo_url: string | null
          brand_name: string
          campaign_goal: string | null
          category: string | null
          closed_at: string | null
          content_format: string
          created_at: string | null
          deadline: string
          deliverable_count: number
          description: string
          donts: string[]
          dos: string[]
          id: number
          image_url: string
          participants_count: number | null
          pot_currency: string
          pot_splits: Json
          pot_value: number | null
          published_at: string | null
          requirements: string[]
          review_sla_days: number
          revisions_allowed: number
          reward: string
          reward_currency: string
          reward_value: number
          settled_at: string | null
          shop_id: number | null
          status: string
          talking_points: string[]
          title: string
          updated_at: string | null
          usage_rights: string
          video_max_seconds: number | null
          video_min_seconds: number | null
          voucher_valid_days: number
        }
        SetofOptions: {
          from: "*"
          to: "challenges"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_dev_merchant: { Args: never; Returns: Json }
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
      current_muse_profile: {
        Args: never
        Returns: {
          avatar_url: string | null
          bio: string | null
          clerk_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          stripe_account_id: string | null
          stripe_customer_id: string | null
          type: string | null
        }
        SetofOptions: {
          from: "*"
          to: "users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decrement_product_quantity: {
        Args: { product_id: number; quantity: number }
        Returns: undefined
      }
      ensure_clerk_profile: {
        Args: { p_avatar_url?: string; p_email: string; p_full_name?: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          clerk_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          stripe_account_id: string | null
          stripe_customer_id: string | null
          type: string | null
        }
        SetofOptions: {
          from: "*"
          to: "users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_campaign_results: { Args: { p_challenge_id: number }; Returns: Json }
      get_creator_opportunity_feed: {
        Args: {
          p_cursor?: number
          p_limit?: number
          p_mall_id?: number
          p_seed?: string
        }
        Returns: {
          brand_asset_paths: string[]
          brand_logo_url: string
          brand_name: string
          campaign_goal: string
          category: string
          content_format: string
          deadline: string
          deliverable_count: number
          description: string
          donts: string[]
          dos: string[]
          has_joined: boolean
          id: number
          image_url: string
          my_submission_status: string
          participants_count: number
          pot_currency: string
          pot_splits: Json
          pot_value: number
          preference_state: string
          requirements: string[]
          review_sla_days: number
          revisions_allowed: number
          shop_id: number
          status: string
          talking_points: string[]
          title: string
          usage_rights: string
          video_max_seconds: number
          video_min_seconds: number
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
          ai_allowed: boolean | null
          brand_asset_paths: string[]
          brand_logo_url: string | null
          brand_name: string
          campaign_goal: string | null
          category: string | null
          closed_at: string | null
          content_format: string
          created_at: string | null
          deadline: string
          deliverable_count: number
          description: string
          donts: string[]
          dos: string[]
          id: number
          image_url: string
          participants_count: number | null
          pot_currency: string
          pot_splits: Json
          pot_value: number | null
          published_at: string | null
          requirements: string[]
          review_sla_days: number
          revisions_allowed: number
          reward: string
          reward_currency: string
          reward_value: number
          settled_at: string | null
          shop_id: number | null
          status: string
          talking_points: string[]
          title: string
          updated_at: string | null
          usage_rights: string
          video_max_seconds: number | null
          video_min_seconds: number | null
          voucher_valid_days: number
        }[]
        SetofOptions: {
          from: "*"
          to: "challenges"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      join_campaign: {
        Args: { p_challenge_id: number }
        Returns: {
          asset_meta: Json
          asset_paths: string[]
          caption: string | null
          challenge_id: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          media_type: string | null
          merchant_note: string | null
          platform: string | null
          public_share_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_count: number
          status: string
          submitted_at: string | null
          thumbnail_path: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "challenge_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      publish_campaign: {
        Args: { p_challenge_id: number }
        Returns: {
          ai_allowed: boolean | null
          brand_asset_paths: string[]
          brand_logo_url: string | null
          brand_name: string
          campaign_goal: string | null
          category: string | null
          closed_at: string | null
          content_format: string
          created_at: string | null
          deadline: string
          deliverable_count: number
          description: string
          donts: string[]
          dos: string[]
          id: number
          image_url: string
          participants_count: number | null
          pot_currency: string
          pot_splits: Json
          pot_value: number | null
          published_at: string | null
          requirements: string[]
          review_sla_days: number
          revisions_allowed: number
          reward: string
          reward_currency: string
          reward_value: number
          settled_at: string | null
          shop_id: number | null
          status: string
          talking_points: string[]
          title: string
          updated_at: string | null
          usage_rights: string
          video_max_seconds: number | null
          video_min_seconds: number | null
          voucher_valid_days: number
        }
        SetofOptions: {
          from: "*"
          to: "challenges"
          isOneToOne: true
          isSetofReturn: false
        }
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
      reserve_checkout_order: {
        Args: {
          p_attribution: Json
          p_fulfilment: Json
          p_idempotency_key: string
          p_items: Json
          p_user_id: string
        }
        Returns: Json
      }
      review_campaign_submission: {
        Args: { p_decision: string; p_note?: string; p_submission_id: number }
        Returns: {
          asset_meta: Json
          asset_paths: string[]
          caption: string | null
          challenge_id: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          media_type: string | null
          merchant_note: string | null
          platform: string | null
          public_share_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_count: number
          status: string
          submitted_at: string | null
          thumbnail_path: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "challenge_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      select_campaign_winners: {
        Args: { p_challenge_id: number; p_ranked_submission_ids: number[] }
        Returns: Json
      }
      set_creator_opportunity_preference: {
        Args: { p_opportunity_id: number; p_state: string }
        Returns: undefined
      }
      settle_campaign: { Args: { p_challenge_id: number }; Returns: Json }
      submit_campaign_entry: {
        Args: {
          p_asset_meta?: Json
          p_asset_paths: string[]
          p_caption?: string
          p_challenge_id: number
          p_consent_version?: string
          p_public_share_url?: string
        }
        Returns: {
          asset_meta: Json
          asset_paths: string[]
          caption: string | null
          challenge_id: number
          consent_version: string | null
          consented_at: string | null
          content_url: string | null
          created_at: string
          final_rank: number | null
          id: number
          media_type: string | null
          merchant_note: string | null
          platform: string | null
          public_share_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_count: number
          status: string
          submitted_at: string | null
          thumbnail_path: string | null
          user_id: string
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
