export { aiApi } from './api/aiApi';
export { aiSocketMiddleware } from './middleware/aiSocketMiddleware';

export { default as useTicketSummary } from './hooks/useTicketSummary';
export { default as useSimilarTickets } from './hooks/useSimilarTickets';
export { default as useRoutingSuggestion } from './hooks/useRoutingSuggestion';
export { default as useCopilot } from './hooks/useCopilot';
export { default as useSuggestedResponse } from './hooks/useSuggestedResponse';

export { default as TicketSummary } from './components/TicketSummary';
export { default as SimilarTickets } from './components/SimilarTickets';
export { default as RoutingSuggestion } from './components/RoutingSuggestion';
export { default as CopilotSidebar } from './components/CopilotSidebar';
export { default as SuggestedResponse } from './components/SuggestedResponse';
export { default as AITriageBadge } from './components/AITriageBadge';
export { default as SLAIndicator } from './components/SLAIndicator';
export { default as MessageThread } from './components/MessageThread';
