export interface PersonaData {
  audience_analysis?: {
    target_audience?: string;
    audience_demographics?: string[];
    skill_level?: string;
    audience_interests?: string[];
    viewer_intent?: string[];
    pain_points_addressed?: string[];
    [key: string]: any;
  };
  content_patterns?: {
    post_naming_convention?: string;
    content_formula?: string;
    post_title_style?: string;
    emoji_usage?: string;
    [key: string]: any;
  };
  writing_style?: {
    tone?: string;
    formality?: string;
    sentence_length?: string;
    characteristics?: string[];
    [key: string]: any;
  };
  topics_and_keywords?: {
    primary_topic?: string;
    common_keywords?: string[];
    [key: string]: any;
  };
  content_examples?: {
    recent_posts?: string[];
    [key: string]: any;
  };
  ai_insights?: {
    content_generation_guidelines?: string[];
    style_characteristics?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PersonaResponse {
  success: boolean;
  message: string;
  data: PersonaData | null;
  error?: string | null;
  persona_id?: number;
  regenerated_agents?: string[];
}

export interface PersonaUpdateRequest {
  persona_data: PersonaData;
}

export interface PersonaPatchRequest {
  content_patterns?: PersonaData['content_patterns'];
  writing_style?: PersonaData['writing_style'];
  topics_and_keywords?: PersonaData['topics_and_keywords'];
  audience_analysis?: PersonaData['audience_analysis'];
  ai_insights?: PersonaData['ai_insights'];
}

export interface PersonaRegenerateRequest {
  regenerate_agents?: string[] | null;
  user_requirements?: string | null;
}

export interface PersonaState {
  loading: boolean;
  error: string | null;
  persona: PersonaData | null;
  personaId: number | null;
}
