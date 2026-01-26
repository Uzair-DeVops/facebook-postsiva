import type { PersonaData, PersonaState } from './types';

export const initialPersonaState: PersonaState = {
  loading: false,
  error: null,
  persona: null,
  personaId: null,
};

type PersonaAction =
  | { type: 'PERSONA_START' }
  | { type: 'PERSONA_SUCCESS'; payload: { persona: PersonaData | null; personaId?: number | null } }
  | { type: 'PERSONA_ERROR'; payload: string }
  | { type: 'PERSONA_RESET' };

export function personaReducer(
  state: PersonaState,
  action: PersonaAction,
): PersonaState {
  switch (action.type) {
    case 'PERSONA_START':
      return { ...state, loading: true, error: null };
    case 'PERSONA_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        persona: action.payload.persona,
        personaId: action.payload.personaId ?? null,
      };
    case 'PERSONA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'PERSONA_RESET':
      return initialPersonaState;
    default:
      return state;
  }
}
