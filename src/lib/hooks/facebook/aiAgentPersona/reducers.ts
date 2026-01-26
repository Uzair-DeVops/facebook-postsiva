import type { AIAgentPersonaData, AIAgentPersonaState } from './types';

export const initialAIAgentPersonaState: AIAgentPersonaState = {
  loading: false,
  error: null,
  persona: null,
};

type AIAgentPersonaAction =
  | { type: 'AI_AGENT_PERSONA_START' }
  | { type: 'AI_AGENT_PERSONA_SUCCESS'; payload: AIAgentPersonaData | null }
  | { type: 'AI_AGENT_PERSONA_ERROR'; payload: string }
  | { type: 'AI_AGENT_PERSONA_RESET' };

export function aiAgentPersonaReducer(
  state: AIAgentPersonaState,
  action: AIAgentPersonaAction,
): AIAgentPersonaState {
  switch (action.type) {
    case 'AI_AGENT_PERSONA_START':
      return { ...state, loading: true, error: null };
    case 'AI_AGENT_PERSONA_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        persona: action.payload,
      };
    case 'AI_AGENT_PERSONA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AI_AGENT_PERSONA_RESET':
      return initialAIAgentPersonaState;
    default:
      return state;
  }
}
