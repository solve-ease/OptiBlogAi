// Blog generation interfaces based on FastAPI backend schema

export interface BlogCustomization {
  tone?: 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative';
  target_audience?: 'beginners' | 'intermediate' | 'advanced' | 'general';
  content_type?: 'tutorial' | 'guide' | 'review' | 'comparison' | 'news' | 'opinion';
  word_count_target?: number;
  include_faq?: boolean;
  include_conclusion?: boolean;
  include_table_of_contents?: boolean;
  focus_keywords?: string[];
  exclude_domains?: string[];
}

export interface BlogGenerationRequest {
  keyword: string;
  max_attempts?: number;
  seo_threshold?: number;
  customization?: BlogCustomization;
  priority?: 'low' | 'normal' | 'high';
  callback_url?: string;
  user_id?: string;
}

export interface SEOScores {
  title_score: number;
  meta_description_score: number;
  keyword_optimization_score: number;
  content_structure_score: number;
  readability_score: number;
  content_quality_score: number;
  technical_seo_score: number;
  final_score: number;
  word_count: number;
  reading_time_minutes: number;
  keyword_density: number;
}

export interface ContentMetadata {
  sources_used: string[];
  processing_time_seconds: number;
  model_used: string;
  content_language: string;
  generated_at: string;
}

export interface BlogGenerationResponse {
  run_id: string;
  final_blog: string;
  seo_scores: SEOScores;
  attempts: number;
  success: boolean;
  metadata: ContentMetadata;
  customization_applied: BlogCustomization;
  status: string;
  progress_percentage: number;
  estimated_reading_time: number;
  content_quality_grade: string;
}

export interface LoadingQuote {
  text: string;
  icon: string;
}

export const LOADING_QUOTES: LoadingQuote[] = [
  { text: "Crafting your perfect blog post...", icon: "PenTool" },
  { text: "Analyzing keywords for maximum impact...", icon: "Search" },
  { text: "Optimizing content for SEO success...", icon: "TrendingUp" },
  { text: "Generating engaging headlines...", icon: "Type" },
  { text: "Structuring content for readability...", icon: "AlignLeft" },
  { text: "Adding finishing touches...", icon: "Sparkles" },
  { text: "Quality checking your content...", icon: "CheckCircle" },
  { text: "Almost there, polishing the final draft...", icon: "Edit3" }
];