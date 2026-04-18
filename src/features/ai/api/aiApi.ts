import { api } from '../../../app/api';

// ── Summarize ────────────────────────────────────────────────────────────────

interface SummarizeInput {
  type: 'ticket';
  ticketId: string;
  messages?: string[];
}

interface SummarizeResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

// ── Semantic search ──────────────────────────────────────────────────────────

interface SemanticSearchInput {
  query: string;
  type: 'ticket' | 'document';
  limit?: number;
}

interface SemanticSearchResult {
  results: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    similarity: number;
    resolution?: string;
  }>;
}

// ── Routing suggestions ──────────────────────────────────────────────────────

interface RoutingSuggestionsInput {
  ticketId: string;
  title: string;
  description: string;
  priority: string;
  category: string;
}

interface RoutingSuggestionsResult {
  recommendedAssignee: {
    agentId: string;
    agentName?: string;
    confidence: number;
  } | null;
  alternatives: Array<{
    agentId: string;
    agentName?: string;
    confidence: number;
    reason: string;
  }>;
  reasoning: {
    expertiseMatch: number;
    workloadFactor: number;
    slaUrgency: number;
  };
}

// ── Suggested responses ──────────────────────────────────────────────────────

interface SuggestedResponsesInput {
  ticketId: string;
  conversationHistory: Array<{ role: string; content: string }>;
  includeSources?: boolean;
}

interface SuggestedResponsesResult {
  suggestions: Array<{
    text: string;
    confidence: number;
    sources: Array<{
      id: string;
      type: string;
      title: string;
      relevance: number;
    }>;
  }>;
}

// ── Copilot ──────────────────────────────────────────────────────────────────

interface CopilotQueryInput {
  query: string;
  context: object;
}

interface CopilotQueryResult {
  response: string;
  suggestedActions?: Array<{
    type: string;
    label: string;
    payload: unknown;
  }>;
}

// ── API definition ───────────────────────────────────────────────────────────

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    summarizeTicket: builder.mutation<SummarizeResult, SummarizeInput>({
      query: (body) => ({
        url: '/ai/summarize',
        method: 'POST',
        body,
      }),
    }),

    semanticSearch: builder.mutation<SemanticSearchResult, SemanticSearchInput>({
      query: (body) => ({
        url: '/ai/search',
        method: 'POST',
        body,
      }),
    }),

    getRoutingSuggestions: builder.query<RoutingSuggestionsResult, RoutingSuggestionsInput>({
      query: ({ ticketId, ...params }) => ({
        url: `/ai/routing/${ticketId}`,
        params,
      }),
    }),

    getSuggestedResponses: builder.query<SuggestedResponsesResult, SuggestedResponsesInput>({
      query: ({ ticketId, ...body }) => ({
        url: `/ai/suggest-response/${ticketId}`,
        params: { includeSources: body.includeSources },
      }),
    }),

    copilotQuery: builder.mutation<CopilotQueryResult, CopilotQueryInput>({
      query: (body) => ({
        url: '/ai/copilot',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSummarizeTicketMutation,
  useSemanticSearchMutation,
  useGetRoutingSuggestionsQuery,
  useLazyGetRoutingSuggestionsQuery,
  useGetSuggestedResponsesQuery,
  useLazyGetSuggestedResponsesQuery,
  useCopilotQueryMutation,
} = aiApi;
