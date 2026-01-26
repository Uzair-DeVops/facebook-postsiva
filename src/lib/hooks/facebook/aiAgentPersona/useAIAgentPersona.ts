'use client';

import { useCallback, useReducer } from 'react';
import { aiAgentPersonaReducer, initialAIAgentPersonaState } from './reducers';
import {
  buildAIAgentPersona,
  getAIAgentPersona,
  updateAIAgentPersona,
  patchAIAgentPersona,
  deleteAIAgentPersona,
  regenerateAIAgentPersona,
} from './api';
import type {
  AIAgentPersonaUpdateRequest,
  AIAgentPersonaPatchRequest,
  AIAgentPersonaRegenerateRequest,
} from './types';

export function useAIAgentPersona() {
  const [state, dispatch] = useReducer(aiAgentPersonaReducer, initialAIAgentPersonaState);

  const build = useCallback(async (pageId: string, userRequirements?: string | null) => {
    dispatch({ type: 'AI_AGENT_PERSONA_START' });
    try {
      const res = await buildAIAgentPersona(pageId, userRequirements);
      if (!res.success) {
        throw new Error(res.error || res.message || 'Failed to build AI Agent Persona');
      }
      dispatch({
        type: 'AI_AGENT_PERSONA_SUCCESS',
        payload: res.data,
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'AI_AGENT_PERSONA_ERROR',
        payload: err.message ?? 'Failed to build AI Agent Persona',
      });
      throw err;
    }
  }, []);

  const load = useCallback(async (pageId: string) => {
    dispatch({ type: 'AI_AGENT_PERSONA_START' });
    try {
      const res = await getAIAgentPersona(pageId);
      // If persona not found, treat it as valid state (no persona exists yet)
      // Only throw error for actual errors (network, server errors, etc.)
      if (!res.success) {
        // Check if it's a "not found" error (valid state) vs actual error
        const errorMessage = res.error || res.message || '';
        if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('build persona first')) {
          // Persona doesn't exist yet - this is a valid state, not an error
          dispatch({
            type: 'AI_AGENT_PERSONA_SUCCESS',
            payload: null, // No persona exists
          });
          return res;
        }
        // Actual error - throw it
        throw new Error(errorMessage || 'Failed to load AI Agent Persona');
      }
      dispatch({
        type: 'AI_AGENT_PERSONA_SUCCESS',
        payload: res.data,
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'AI_AGENT_PERSONA_ERROR',
        payload: err.message ?? 'Failed to load AI Agent Persona',
      });
      throw err;
    }
  }, []);

  const update = useCallback(async (pageId: string, request: AIAgentPersonaUpdateRequest) => {
    dispatch({ type: 'AI_AGENT_PERSONA_START' });
    try {
      const res = await updateAIAgentPersona(pageId, request);
      if (!res.success) {
        throw new Error(res.error || res.message || 'Failed to update AI Agent Persona');
      }
      dispatch({
        type: 'AI_AGENT_PERSONA_SUCCESS',
        payload: res.data,
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'AI_AGENT_PERSONA_ERROR',
        payload: err.message ?? 'Failed to update AI Agent Persona',
      });
      throw err;
    }
  }, []);

  const patch = useCallback(async (pageId: string, request: AIAgentPersonaPatchRequest) => {
    dispatch({ type: 'AI_AGENT_PERSONA_START' });
    try {
      const res = await patchAIAgentPersona(pageId, request);
      if (!res.success) {
        throw new Error(res.error || res.message || 'Failed to patch AI Agent Persona');
      }
      dispatch({
        type: 'AI_AGENT_PERSONA_SUCCESS',
        payload: res.data,
      });
      return res;
    } catch (err: any) {
      dispatch({
        type: 'AI_AGENT_PERSONA_ERROR',
        payload: err.message ?? 'Failed to patch AI Agent Persona',
      });
      throw err;
    }
  }, []);

  const remove = useCallback(async (pageId: string) => {
    dispatch({ type: 'AI_AGENT_PERSONA_START' });
    try {
      const res = await deleteAIAgentPersona(pageId);
      if (!res.success) {
        const errorMsg = res.error || res.message || 'Failed to delete AI Agent Persona';
        throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
      // Clear error and reset state on successful delete
      dispatch({ type: 'AI_AGENT_PERSONA_RESET' });
      return res;
    } catch (err: any) {
      // Ensure error message is always a string
      let errorMessage = 'Failed to delete AI Agent Persona';
      if (err) {
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err.message) {
          errorMessage = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
        } else if (typeof err === 'object') {
          errorMessage = JSON.stringify(err);
        }
      }
      dispatch({
        type: 'AI_AGENT_PERSONA_ERROR',
        payload: errorMessage,
      });
      throw err;
    }
  }, []);

  const regenerate = useCallback(
    async (pageId: string, request: AIAgentPersonaRegenerateRequest) => {
      dispatch({ type: 'AI_AGENT_PERSONA_START' });
      try {
        const res = await regenerateAIAgentPersona(pageId, request);
        if (!res.success) {
          throw new Error(res.error || res.message || 'Failed to regenerate AI Agent Persona');
        }
        dispatch({
          type: 'AI_AGENT_PERSONA_SUCCESS',
          payload: res.data,
        });
        return res;
      } catch (err: any) {
        dispatch({
          type: 'AI_AGENT_PERSONA_ERROR',
          payload: err.message ?? 'Failed to regenerate AI Agent Persona',
        });
        throw err;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: 'AI_AGENT_PERSONA_RESET' });
  }, []);

  return {
    ...state,
    build,
    load,
    update,
    patch,
    remove,
    regenerate,
    reset,
  };
}
