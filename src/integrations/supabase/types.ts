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
      achievement_settings: {
        Row: {
          created_at: string
          footer_subtitle_ar: string
          footer_subtitle_en: string
          footer_title_ar: string
          footer_title_en: string
          hero_subtitle_ar: string
          hero_subtitle_en: string
          hero_title_ar: string
          hero_title_en: string
          highlights: Json
          id: string
          is_visible: boolean
          key_targets: Json
          story_items: Json
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          footer_subtitle_ar?: string
          footer_subtitle_en?: string
          footer_title_ar?: string
          footer_title_en?: string
          hero_subtitle_ar?: string
          hero_subtitle_en?: string
          hero_title_ar?: string
          hero_title_en?: string
          highlights?: Json
          id?: string
          is_visible?: boolean
          key_targets?: Json
          story_items?: Json
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          footer_subtitle_ar?: string
          footer_subtitle_en?: string
          footer_title_ar?: string
          footer_title_en?: string
          hero_subtitle_ar?: string
          hero_subtitle_en?: string
          hero_title_ar?: string
          hero_title_en?: string
          highlights?: Json
          id?: string
          is_visible?: boolean
          key_targets?: Json
          story_items?: Json
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      initiatives: {
        Row: {
          created_at: string
          description_ar: string
          description_en: string
          goal_id: string | null
          id: string
          name_ar: string
          name_en: string
          pillar_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string
          description_en?: string
          goal_id?: string | null
          id?: string
          name_ar: string
          name_en: string
          pillar_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string
          description_en?: string
          goal_id?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          pillar_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiatives_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "strategic_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiatives_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_actuals: {
        Row: {
          actual_value: string
          created_at: string
          id: string
          kpi_id: string
          notes_ar: string
          notes_en: string
          updated_at: string
          year: number
        }
        Insert: {
          actual_value?: string
          created_at?: string
          id?: string
          kpi_id: string
          notes_ar?: string
          notes_en?: string
          updated_at?: string
          year: number
        }
        Update: {
          actual_value?: string
          created_at?: string
          id?: string
          kpi_id?: string
          notes_ar?: string
          notes_en?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_actuals_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          baseline: string
          calculation_method_ar: string
          calculation_method_en: string
          created_at: string
          data_source_ar: string
          data_source_en: string
          description_ar: string
          description_en: string
          final_target: string
          id: string
          initiative_id: string
          measurement_frequency: string
          name_ar: string
          name_en: string
          sort_order: number
          supporting_references_ar: string
          supporting_references_en: string
          target_2025: string
          target_2026: string
          target_2027: string
          target_2028: string
          target_2029: string
          target_2029_description: string
          unit: string
          updated_at: string
        }
        Insert: {
          baseline?: string
          calculation_method_ar?: string
          calculation_method_en?: string
          created_at?: string
          data_source_ar?: string
          data_source_en?: string
          description_ar?: string
          description_en?: string
          final_target?: string
          id?: string
          initiative_id: string
          measurement_frequency?: string
          name_ar: string
          name_en: string
          sort_order?: number
          supporting_references_ar?: string
          supporting_references_en?: string
          target_2025?: string
          target_2026?: string
          target_2027?: string
          target_2028?: string
          target_2029?: string
          target_2029_description?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          baseline?: string
          calculation_method_ar?: string
          calculation_method_en?: string
          created_at?: string
          data_source_ar?: string
          data_source_en?: string
          description_ar?: string
          description_en?: string
          final_target?: string
          id?: string
          initiative_id?: string
          measurement_frequency?: string
          name_ar?: string
          name_en?: string
          sort_order?: number
          supporting_references_ar?: string
          supporting_references_en?: string
          target_2025?: string
          target_2026?: string
          target_2027?: string
          target_2028?: string
          target_2029?: string
          target_2029_description?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpis_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          page: string
          section_key: string
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          page: string
          section_key: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          page?: string
          section_key?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      pillars: {
        Row: {
          color: string
          created_at: string
          description_ar: string
          description_en: string
          general_goal_ar: string
          general_goal_en: string
          icon: string
          id: string
          name_ar: string
          name_en: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          general_goal_ar?: string
          general_goal_en?: string
          icon?: string
          id?: string
          name_ar: string
          name_en: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          general_goal_ar?: string
          general_goal_en?: string
          icon?: string
          id?: string
          name_ar?: string
          name_en?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description_ar: string
          description_en: string
          end_date: string | null
          id: string
          initiative_id: string
          name_ar: string
          name_en: string
          outputs_ar: string
          outputs_en: string
          owner_ar: string
          owner_en: string
          sort_order: number
          start_date: string | null
          status: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          description_ar?: string
          description_en?: string
          end_date?: string | null
          id?: string
          initiative_id: string
          name_ar: string
          name_en: string
          outputs_ar?: string
          outputs_en?: string
          owner_ar?: string
          owner_en?: string
          sort_order?: number
          start_date?: string | null
          status?: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          description_ar?: string
          description_en?: string
          end_date?: string | null
          id?: string
          initiative_id?: string
          name_ar?: string
          name_en?: string
          outputs_ar?: string
          outputs_en?: string
          owner_ar?: string
          owner_en?: string
          sort_order?: number
          start_date?: string | null
          status?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_goals: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          pillar_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          pillar_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          pillar_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_goals_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      target_settings: {
        Row: {
          created_at: string
          footer_subtitle_ar: string
          footer_subtitle_en: string
          footer_title_ar: string
          footer_title_en: string
          hero_subtitle_ar: string
          hero_subtitle_en: string
          hero_title_ar: string
          hero_title_en: string
          highlights: Json
          id: string
          is_visible: boolean
          story_items: Json
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          footer_subtitle_ar?: string
          footer_subtitle_en?: string
          footer_title_ar?: string
          footer_title_en?: string
          hero_subtitle_ar?: string
          hero_subtitle_en?: string
          hero_title_ar?: string
          hero_title_en?: string
          highlights?: Json
          id?: string
          is_visible?: boolean
          story_items?: Json
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          footer_subtitle_ar?: string
          footer_subtitle_en?: string
          footer_title_ar?: string
          footer_title_en?: string
          hero_subtitle_ar?: string
          hero_subtitle_en?: string
          hero_title_ar?: string
          hero_title_en?: string
          highlights?: Json
          id?: string
          is_visible?: boolean
          story_items?: Json
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      university_info: {
        Row: {
          created_at: string
          id: string
          mission_ar: string
          mission_en: string
          updated_at: string
          values_ar: string
          values_en: string
          vision_ar: string
          vision_en: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_ar?: string
          mission_en?: string
          updated_at?: string
          values_ar?: string
          values_en?: string
          vision_ar?: string
          vision_en?: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_ar?: string
          mission_en?: string
          updated_at?: string
          values_ar?: string
          values_en?: string
          vision_ar?: string
          vision_en?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
