export interface PersonaData {
  page_info_analysis?: {
    page_focus?: string;
    content_type?: string;
    target_audience?: string;
    brand_voice?: string;
    [key: string]: any;
  };
  content_patterns?: {
    post_naming_convention?: string;
    content_formula?: string;
    post_title_style?: string;
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
  emoji_usage?: {
    uses_emojis?: boolean;
    common_emojis?: string[];
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
  emoji_usage?: PersonaData['emoji_usage'];
  page_info_analysis?: PersonaData['page_info_analysis'];
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
