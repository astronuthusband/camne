// Hand-written types mirroring supabase/migrations/0001_core_schema.sql.
//
// Once you have the Supabase CLI set up (optional — not required for V1),
// you can replace this file with `supabase gen types typescript` output to
// keep it perfectly in sync automatically. For now this is maintained by
// hand alongside the migrations, which is fine at this table count.

export type CategorySlug =
  | "government"
  | "business"
  | "property"
  | "cars"
  | "money"
  | "education"
  | "home"
  | "everyday";

export type GuideStatus = "draft" | "published";
export type Locale = "en" | "ms";
export type SourceType = "official" | "expert" | "reference";
export type UserRole = "user" | "admin";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      guides: {
        Row: {
          id: string;
          translation_group_id: string;
          locale: Locale;
          slug: string;
          category_id: string;
          title: string;
          overview: string | null;
          who_this_is_for: string | null;
          before_you_start: string | null;
          what_youll_need: string[];
          estimated_cost_text: string | null;
          estimated_time_text: string | null;
          common_mistakes: string[];
          featured_image_url: string | null;
          status: GuideStatus;
          last_verified_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["guides"]["Row"]> & {
          slug: string;
          category_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["guides"]["Row"]>;
      };
      guide_steps: {
        Row: {
          id: string;
          guide_id: string;
          step_number: number;
          title: string;
          content: string;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["guide_steps"]["Row"]> & {
          guide_id: string;
          step_number: number;
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["guide_steps"]["Row"]>;
      };
      sources: {
        Row: {
          id: string;
          guide_id: string;
          source_type: SourceType;
          label: string;
          url: string;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["sources"]["Row"]> & {
          guide_id: string;
          label: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["sources"]["Row"]>;
      };
      experts: {
        Row: {
          id: string;
          slug: string;
          name: string;
          photo_url: string | null;
          profession: string | null;
          company: string | null;
          bio: string | null;
          credentials: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["experts"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["experts"]["Row"]>;
      };
      guide_experts: {
        Row: {
          guide_id: string;
          expert_id: string;
          advice_text: string | null;
          interviewed_at: string | null;
        };
        Insert: Database["public"]["Tables"]["guide_experts"]["Row"];
        Update: Partial<Database["public"]["Tables"]["guide_experts"]["Row"]>;
      };
      guide_tags: {
        Row: { guide_id: string; tag: string };
        Insert: Database["public"]["Tables"]["guide_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["guide_tags"]["Row"]>;
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      bookmarks: {
        Row: { user_id: string; guide_id: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]> & {
          user_id: string;
          guide_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]>;
      };
      feedback: {
        Row: {
          id: string;
          guide_id: string;
          user_id: string | null;
          helpful: boolean;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["feedback"]["Row"]> & {
          guide_id: string;
          helpful: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["feedback"]["Row"]>;
      };
      search_analytics: {
        Row: {
          id: string;
          query: string;
          result_count: number;
          clicked_guide_id: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["search_analytics"]["Row"]
        > & { query: string };
        Update: Partial<Database["public"]["Tables"]["search_analytics"]["Row"]>;
      };
    };
  };
}
