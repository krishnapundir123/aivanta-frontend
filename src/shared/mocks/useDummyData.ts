// =============================================================================
// useDummyData — returns dummy data for any hook/page when VITE_USE_DUMMY_DATA=true.
// Usage:
//   const dummy = useDummyData();
//   if (dummy.enabled) return dummy.tickets;   // short-circuit before real API call
// =============================================================================

import {
  dummyUser,
  dummyToken,
  dummyTickets,
  dummyMessages,
  dummySummary,
  dummySimilarTickets,
  dummyRoutingSuggestion,
  dummySuggestedResponses,
  dummyCopilotResponses,
  dummyInboxConversations,
  dummyDocuments,
  dummyCopilotPageHistory,
  dummyCopilotPageResponses,
  dummyReports,
  dummyTeamMembers,
  dummyTeamStats,
  dummySettings,
} from './dummyData';

export const DUMMY_MODE = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export function useDummyData() {
  return {
    enabled: DUMMY_MODE,

    // Auth
    user: dummyUser,
    token: dummyToken,

    // Tickets
    tickets: dummyTickets,
    getTicket: (id: string) => dummyTickets.find((t) => t.id === id) ?? dummyTickets[0],

    // Messages
    getMessages: (ticketId: string) => dummyMessages[ticketId] ?? [],

    // AI
    summary: dummySummary,
    similarTickets: dummySimilarTickets,
    routingSuggestion: dummyRoutingSuggestion,
    suggestedResponses: dummySuggestedResponses,
    copilotResponse: (_query: string) => dummyCopilotResponses['default'],

    // Messages page
    inboxConversations: dummyInboxConversations,

    // Documents page
    documents: dummyDocuments,

    // Copilot page
    copilotPageHistory: dummyCopilotPageHistory,
    copilotPageResponse: (_query: string) => dummyCopilotPageResponses['default'],

    // Reports page
    reports: dummyReports,

    // Team page
    teamMembers: dummyTeamMembers,
    teamStats: dummyTeamStats,

    // Settings page
    settings: dummySettings,
  };
}
