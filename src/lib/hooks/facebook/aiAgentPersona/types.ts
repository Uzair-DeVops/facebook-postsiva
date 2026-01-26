export interface AIAgentPersonaData {
  agent_tone?: string; // casual, professional, enthusiastic, friendly, authoritative
  content_style?: string; // educational, promotional, entertaining, informational, mixed
  target_audience?: string[]; // List of target audiences
  emoji_preference?: string; // none, minimal, moderate, high
  brand_message?: string | null; // Optional core message
  [key: string]: any;
}

export interface AIAgentPersonaResponse {
  success: boolean;
  message: string;
  data: AIAgentPersonaData | null;
  error?: string | null;
}

export interface AIAgentPersonaUpdateRequest {
  agent_tone: string;
  content_style: string;
  target_audience: string[];
  emoji_preference: string;
  brand_message?: string | null;
}

export interface AIAgentPersonaPatchRequest {
  agent_tone?: string;
  content_style?: string;
  target_audience?: string[];
  emoji_preference?: string;
  brand_message?: string | null;
}

export interface AIAgentPersonaRegenerateRequest {
  user_requirements?: string | null;
}

export interface AIAgentPersonaState {
  loading: boolean;
  error: string | null;
  persona: AIAgentPersonaData | null;
}
