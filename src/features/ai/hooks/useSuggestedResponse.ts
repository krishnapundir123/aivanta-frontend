import { useState, useCallback } from 'react';
import { aiApi } from '../api/aiApi';
import { useDummyData } from '../../../shared/mocks/useDummyData';

interface Suggestion {
  text: string;
  confidence: number;
  sources: Array<{
    id: string;
    type: string;
    title: string;
    relevance: number;
  }>;
}

interface UseSuggestedResponseResult {
  suggestions: Suggestion[];
  isLoading: boolean;
  generateSuggestions: (params: {
    ticketId: string;
    conversationHistory: Array<{ role: string; content: string }>;
    includeSources?: boolean;
  }) => Promise<void>;
}

export default function useSuggestedResponse(): UseSuggestedResponseResult {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dummy = useDummyData();

  const [getSuggestions] = aiApi.useLazyGetSuggestedResponsesQuery();

  const generateSuggestions = useCallback(
    async (params: {
      ticketId: string;
      conversationHistory: Array<{ role: string; content: string }>;
      includeSources?: boolean;
    }) => {
      if (dummy.enabled) {
        setSuggestions(dummy.suggestedResponses.suggestions);
        return;
      }
      setIsLoading(true);
      try {
        const result = await getSuggestions(params).unwrap();

        setSuggestions(result.suggestions || []);
      } catch (error) {
        console.error('Failed to generate suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [getSuggestions, dummy]
  );

  return {
    suggestions,
    isLoading,
    generateSuggestions,
  };
}
