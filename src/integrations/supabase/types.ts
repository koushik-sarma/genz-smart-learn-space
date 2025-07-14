export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points_required: number
          rarity: string
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points_required?: number
          rarity?: string
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points_required?: number
          rarity?: string
        }
        Relationships: []
      }
      dim_biology_chapters_notes: {
        Row: {
          biology_notes_id: number
          board_id: number
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_points_to_remember: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          subject_id: number
        }
        Insert: {
          biology_notes_id?: number
          board_id: number
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_points_to_remember: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          subject_id: number
        }
        Update: {
          biology_notes_id?: number
          board_id?: number
          chapter_discussion_points?: string
          chapter_id?: number
          chapter_important_diagrams?: string
          chapter_points_to_remember?: string
          chapter_quick_recall?: string
          chapter_summary?: string
          chapter_takeaways?: string
          subject_id?: number
        }
        Relationships: []
      }
      dim_biology_subject: {
        Row: {
          biology_chapter_id: number
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part: string | null
          subject_id: number
        }
        Insert: {
          biology_chapter_id?: number
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part?: string | null
          subject_id: number
        }
        Update: {
          biology_chapter_id?: number
          board_id?: number
          chapter?: string
          chapter_description?: string
          class?: number
          part?: string | null
          subject_id?: number
        }
        Relationships: []
      }
      dim_boards: {
        Row: {
          board_id: number
          board_name: string
          state_name: string | null
        }
        Insert: {
          board_id?: number
          board_name: string
          state_name?: string | null
        }
        Update: {
          board_id?: number
          board_name?: string
          state_name?: string | null
        }
        Relationships: []
      }
      dim_chemistry_chapters_notes: {
        Row: {
          board_id: number
          chapter_chemical_equation: string
          chapter_chemical_formulae: string
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          chemistry_notes_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter_chemical_equation: string
          chapter_chemical_formulae: string
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          chemistry_notes_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter_chemical_equation?: string
          chapter_chemical_formulae?: string
          chapter_discussion_points?: string
          chapter_id?: number
          chapter_important_diagrams?: string
          chapter_quick_recall?: string
          chapter_summary?: string
          chapter_takeaways?: string
          chemistry_notes_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_chemistry_subject: {
        Row: {
          board_id: number
          chapter: string
          chapter_description: string
          chemistry_chapter_id: number
          class: number
          part: string | null
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter: string
          chapter_description: string
          chemistry_chapter_id?: number
          class: number
          part?: string | null
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter?: string
          chapter_description?: string
          chemistry_chapter_id?: number
          class?: number
          part?: string | null
          subject_id?: number
        }
        Relationships: []
      }
      dim_mathematics_subject: {
        Row: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          math_chapter_id: number
          part: string | null
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          math_chapter_id?: number
          part?: string | null
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter?: string
          chapter_description?: string
          class?: number
          math_chapter_id?: number
          part?: string | null
          subject_id?: number
        }
        Relationships: []
      }
      dim_maths_chapters_notes: {
        Row: {
          board_id: number
          chapter_discussion_points: string
          chapter_formulae: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_quick_recall: string | null
          chapter_summary: string
          chapter_takeaways: string
          maths_notes_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter_discussion_points: string
          chapter_formulae: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_quick_recall?: string | null
          chapter_summary: string
          chapter_takeaways: string
          maths_notes_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter_discussion_points?: string
          chapter_formulae?: string
          chapter_id?: number
          chapter_important_diagrams?: string
          chapter_quick_recall?: string | null
          chapter_summary?: string
          chapter_takeaways?: string
          maths_notes_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_maths_subject: {
        Row: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          maths_chapter_id: number
          part: string | null
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          maths_chapter_id?: number
          part?: string | null
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter?: string
          chapter_description?: string
          class?: number
          maths_chapter_id?: number
          part?: string | null
          subject_id?: number
        }
        Relationships: []
      }
      dim_physics_chapters_notes: {
        Row: {
          board_id: number
          chapter_discussion_points: string
          chapter_formulae: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_summary: string
          chapter_takeaways: string
          class: number
          physics_notes_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter_discussion_points: string
          chapter_formulae: string
          chapter_id: number
          chapter_important_diagrams: string
          chapter_summary: string
          chapter_takeaways: string
          class?: number
          physics_notes_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter_discussion_points?: string
          chapter_formulae?: string
          chapter_id?: number
          chapter_important_diagrams?: string
          chapter_summary?: string
          chapter_takeaways?: string
          class?: number
          physics_notes_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_physics_subject: {
        Row: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part: string | null
          physic_chapter_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part?: string | null
          physic_chapter_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter?: string
          chapter_description?: string
          class?: number
          part?: string | null
          physic_chapter_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_social_chapters_notes: {
        Row: {
          board_id: number
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_dates: string
          chapter_map_points: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          part: string | null
          social_notes_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter_discussion_points: string
          chapter_id: number
          chapter_important_dates: string
          chapter_map_points: string
          chapter_quick_recall: string
          chapter_summary: string
          chapter_takeaways: string
          part?: string | null
          social_notes_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter_discussion_points?: string
          chapter_id?: number
          chapter_important_dates?: string
          chapter_map_points?: string
          chapter_quick_recall?: string
          chapter_summary?: string
          chapter_takeaways?: string
          part?: string | null
          social_notes_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_social_subject: {
        Row: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part: string | null
          social_chapter_id: number
          subject_id: number
        }
        Insert: {
          board_id: number
          chapter: string
          chapter_description: string
          class: number
          part?: string | null
          social_chapter_id?: number
          subject_id: number
        }
        Update: {
          board_id?: number
          chapter?: string
          chapter_description?: string
          class?: number
          part?: string | null
          social_chapter_id?: number
          subject_id?: number
        }
        Relationships: []
      }
      dim_subjects: {
        Row: {
          board_id: number
          board_name: string
          class: number
          part: string | null
          subject_id: number
          subject_name: string
          total_chapters: number
        }
        Insert: {
          board_id: number
          board_name: string
          class: number
          part?: string | null
          subject_id?: number
          subject_name: string
          total_chapters: number
        }
        Update: {
          board_id?: number
          board_name?: string
          class?: number
          part?: string | null
          subject_id?: number
          subject_name?: string
          total_chapters?: number
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          created_at: string
          id: string
          points: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          board_of_education: string | null
          city: string | null
          class: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          board_of_education?: string | null
          city?: string | null
          class?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          board_of_education?: string | null
          city?: string | null
          class?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_chapters: number
          created_at: string
          id: string
          subject_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_chapters?: number
          created_at?: string
          id?: string
          subject_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_chapters?: number
          created_at?: string
          id?: string
          subject_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          chapters_completed: number
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          perfect_scores: number
          quizzes_completed: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chapters_completed?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          perfect_scores?: number
          quizzes_completed?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chapters_completed?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          perfect_scores?: number
          quizzes_completed?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_user_id: string
          p_points: number
          p_reason: string
          p_reference_id?: string
          p_reference_type?: string
        }
        Returns: undefined
      }
      calculate_level: {
        Args: { total_points: number }
        Returns: number
      }
      check_and_award_badges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_chapter_completion: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_quiz_completion: {
        Args: { p_user_id: string; p_score: number }
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
  public: {
    Enums: {},
  },
} as const
