// =============================================================================
// DUMMY DATA — used for UI development until the API is ready.
// Set USE_DUMMY_DATA=true in .env.local to enable:  VITE_USE_DUMMY_DATA=true
// All API logic is preserved; this file is only read when the flag is on.
// =============================================================================

// ── Users ─────────────────────────────────────────────────────────────────────

export const dummyUser = {
  id: 'user-001',
  email: 'aman.singh@aivanta.com',
  firstName: 'Aman',
  lastName: 'Singh',
  role: 'ADMIN_3SC',
  tenantId: 'tenant-001',
};

export const dummyToken = 'dummy-jwt-token';

// ── Tickets ───────────────────────────────────────────────────────────────────

export const dummyTickets = [
  {
    id: 'ticket-001',
    title: 'Login page throws 500 on invalid credentials',
    description:
      'Users are seeing a 500 Internal Server Error when they enter incorrect passwords instead of a proper 401 response. This is causing confusion and support load.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'BUG',
    aiCategory: 'BUG',
    aiConfidence: 0.92,
    slaStatus: 'AT_RISK',
    slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hrs from now
    slaTimeRemaining: 120,
    assignedTo: 'user-002',
    aiSummary: 'Server returns 500 instead of 401 for bad credentials — likely uncaught exception in auth middleware.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-002',
    title: 'Export to CSV missing timezone offset',
    description:
      'When exporting ticket reports to CSV the timestamps are in UTC but the client expects local timezone. The offset is not applied anywhere in the export pipeline.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'DATA_ISSUE',
    aiCategory: 'DATA_ISSUE',
    aiConfidence: 0.87,
    slaStatus: 'ON_TRACK',
    slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    slaTimeRemaining: 1440,
    assignedTo: 'user-003',
    aiSummary: 'Timestamp export uses raw UTC values; timezone conversion step is absent.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-003',
    title: 'Add dark mode support to the dashboard',
    description:
      'Multiple enterprise clients have requested a dark mode toggle for the dashboard to reduce eye strain during night shifts.',
    status: 'OPEN',
    priority: 'LOW',
    category: 'FEATURE_REQUEST',
    aiCategory: 'FEATURE_REQUEST',
    aiConfidence: 0.95,
    slaStatus: 'ON_TRACK',
    slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    slaTimeRemaining: 10080,
    assignedTo: undefined,
    aiSummary: 'Client request for dark mode — UI theming change, no backend impact.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-004',
    title: 'Payment gateway timeout during peak hours',
    description:
      'The payment service times out sporadically between 18:00–20:00 UTC. Approximately 3% of transactions fail silently. No retry logic in place.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    category: 'INCIDENT',
    aiCategory: 'INCIDENT',
    aiConfidence: 0.98,
    slaStatus: 'BREACHED',
    slaDeadline: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // already past
    slaTimeRemaining: 0,
    assignedTo: 'user-002',
    aiSummary: 'Payment gateway intermittently fails at peak load — SLA already breached, needs immediate attention.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-005',
    title: 'User profile picture not updating after upload',
    description:
      'After uploading a new avatar the old image still shows in the header and sidebar. Hard refresh clears it, suggesting a cache invalidation issue.',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    category: 'BUG',
    aiCategory: 'BUG',
    aiConfidence: 0.89,
    slaStatus: 'ON_TRACK',
    slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    slaTimeRemaining: 2880,
    assignedTo: 'user-003',
    aiSummary: 'Browser caches old avatar URL — cache-busting query param or CDN invalidation needed.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Messages (for TicketDetailPage) ──────────────────────────────────────────

interface DummyMessage {
  id: string;
  content: string;
  sender: { id: string; name: string };
  createdAt: string;
  isInternal: boolean;
}

export const dummyMessages: Record<string, DummyMessage[]> = {
  'ticket-001': [
    {
      id: 'msg-001',
      content: 'Hi team, we are getting flooded with calls about the login error. Can someone look into this urgently?',
      sender: { id: 'user-004', name: 'Priya Sharma' },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isInternal: false,
    },
    {
      id: 'msg-002',
      content: 'Reproduced the issue locally. The auth middleware is not catching the bcrypt comparison error and it bubbles up as a 500.',
      sender: { id: 'user-002', name: 'Rahul Verma' },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isInternal: true,
    },
    {
      id: 'msg-003',
      content: 'Fix is in review — wrapping the comparison in try/catch and returning 401 with a generic message.',
      sender: { id: 'user-002', name: 'Rahul Verma' },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isInternal: true,
    },
  ],
  'ticket-004': [
    {
      id: 'msg-010',
      content: 'Payment failures started at 18:05 UTC. Roughly 3% error rate. Alerting is firing.',
      sender: { id: 'user-005', name: 'Monitoring Bot' },
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      isInternal: true,
    },
    {
      id: 'msg-011',
      content: 'Escalating to on-call. Stripe dashboard shows elevated latency on their side too.',
      sender: { id: 'user-002', name: 'Rahul Verma' },
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      isInternal: true,
    },
  ],
};

// ── AI — Ticket Summary ───────────────────────────────────────────────────────

export const dummySummary = {
  summary:
    'The authentication middleware fails to handle bcrypt comparison errors gracefully, propagating a 500 status code to clients instead of the expected 401 Unauthorized response.',
  keyPoints: [
    'Affects all users entering incorrect passwords',
    'Root cause is uncaught exception in auth middleware',
    'No data loss — purely a response-code issue',
    'High support call volume reported since 09:00 IST',
  ],
  actionItems: [
    'Wrap bcrypt.compare() call in try/catch',
    'Return 401 with generic "Invalid credentials" message',
    'Add integration test for bad-password scenario',
    'Deploy hotfix to staging for QA sign-off',
  ],
};

// ── AI — Similar Tickets ──────────────────────────────────────────────────────

export const dummySimilarTickets = [
  {
    id: 'ticket-010',
    title: 'OAuth callback returns 500 on token mismatch',
    status: 'RESOLVED',
    priority: 'HIGH',
    similarity: 0.91,
    resolution: 'Added error boundary in OAuth callback handler; returns 400 on state mismatch.',
  },
  {
    id: 'ticket-011',
    title: 'Password reset link expires with wrong error code',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    similarity: 0.78,
    resolution: 'Fixed expiry check to return 410 Gone instead of 500.',
  },
  {
    id: 'ticket-012',
    title: 'Two-factor auth breaks on special characters in TOTP',
    status: 'CLOSED',
    priority: 'MEDIUM',
    similarity: 0.65,
    resolution: 'Sanitised TOTP input before passing to verification library.',
  },
];

// ── AI — Routing Suggestion ───────────────────────────────────────────────────

export const dummyRoutingSuggestion = {
  recommendedAssignee: {
    agentId: 'user-002',
    agentName: 'Rahul Verma',
    confidence: 0.88,
  },
  alternatives: [
    { agentId: 'user-003', agentName: 'Neha Kapoor', confidence: 0.71, reason: 'Has handled 4 similar auth issues' },
    { agentId: 'user-006', agentName: 'Siddharth Jain', confidence: 0.55, reason: 'Available and low current workload' },
  ],
  reasoning: {
    expertiseMatch: 0.88,
    workloadFactor: 0.72,
    slaUrgency: 0.9,
  },
};

// ── AI — Suggested Responses ──────────────────────────────────────────────────

export const dummySuggestedResponses = {
  suggestions: [
    {
      text: "Hi, thank you for reaching out. We've identified the root cause of the login error and a fix is currently in review. We expect to deploy the hotfix within the next 2 hours. We apologise for the inconvenience.",
      confidence: 0.93,
      sources: [
        { id: 'kb-001', type: 'kb', title: 'Auth Error Response Standards', relevance: 0.88 },
      ],
    },
    {
      text: 'We have reproduced the issue and our engineering team is actively working on a resolution. You will receive an update as soon as the fix is deployed.',
      confidence: 0.81,
      sources: [],
    },
  ],
};

// ── AI — Copilot ──────────────────────────────────────────────────────────────

export const dummyCopilotResponses: Record<string, { response: string; suggestedActions?: { type: string; label: string; payload: unknown }[] }> = {
  default: {
    response:
      "I've analysed the ticket. The auth middleware is missing error handling around the password comparison. I recommend wrapping the bcrypt call in a try/catch and returning a 401 with a sanitised error message. Want me to draft the fix?",
    suggestedActions: [
      { type: 'assign', label: 'Assign to Rahul Verma', payload: { agentId: 'user-002' } },
      { type: 'escalate', label: 'Escalate priority to CRITICAL', payload: { priority: 'CRITICAL' } },
    ],
  },
};

// =============================================================================
// NEW PAGE DUMMY DATA
// =============================================================================

// ── Messages Page (Unified Inbox) ─────────────────────────────────────────────

export const dummyInboxConversations = [
  {
    id: 'conv-001',
    customer: { id: 'cust-001', name: 'Arjun Mehta', email: 'arjun.mehta@example.com', avatarUrl: null },
    subject: 'Cannot log in since yesterday',
    lastMessage: 'Still not working. Can someone please help?',
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    unread: true,
    status: 'OPEN',
    ticketId: 'ticket-001',
    channel: 'EMAIL',
  },
  {
    id: 'conv-002',
    customer: { id: 'cust-002', name: 'Sunita Rao', email: 'sunita.rao@example.com', avatarUrl: null },
    subject: 'CSV export timestamps are wrong',
    lastMessage: 'The dates are all off by 5:30 hours — we are in IST.',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
    status: 'IN_PROGRESS',
    ticketId: 'ticket-002',
    channel: 'EMAIL',
  },
  {
    id: 'conv-003',
    customer: { id: 'cust-003', name: 'Vikram Nair', email: 'vikram.nair@example.com', avatarUrl: null },
    subject: 'Feature request: dark mode',
    lastMessage: 'Our night-shift team would really appreciate this.',
    lastMessageAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    unread: false,
    status: 'OPEN',
    ticketId: 'ticket-003',
    channel: 'CHAT',
  },
  {
    id: 'conv-004',
    customer: { id: 'cust-004', name: 'Deepa Krishnan', email: 'deepa.k@bigcorp.com', avatarUrl: null },
    subject: 'Payment failures — urgent!',
    lastMessage: 'We are losing revenue every minute. Please escalate.',
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unread: true,
    status: 'IN_PROGRESS',
    ticketId: 'ticket-004',
    channel: 'PHONE',
  },
  {
    id: 'conv-005',
    customer: { id: 'cust-005', name: 'Rohit Gupta', email: 'rohit.g@startup.io', avatarUrl: null },
    subject: 'Avatar still showing old picture',
    lastMessage: 'Thanks for the fix! All good now.',
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    status: 'RESOLVED',
    ticketId: 'ticket-005',
    channel: 'EMAIL',
  },
];

// ── Documents Page (Knowledge Base) ──────────────────────────────────────────

export const dummyDocuments = [
  {
    id: 'doc-001',
    title: 'Auth Error Response Standards',
    category: 'Engineering',
    excerpt: 'Defines the correct HTTP status codes and response bodies for all authentication-related errors across the platform.',
    author: { id: 'user-002', name: 'Rahul Verma' },
    tags: ['auth', 'http', 'standards'],
    views: 142,
    helpful: 38,
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-002',
    title: 'Payment Gateway Integration Guide',
    category: 'Engineering',
    excerpt: 'Step-by-step guide for integrating with Stripe, including retry logic, webhook handling, and timeout configuration.',
    author: { id: 'user-003', name: 'Neha Kapoor' },
    tags: ['payments', 'stripe', 'integration'],
    views: 89,
    helpful: 27,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-003',
    title: 'SLA Policy & Escalation Runbook',
    category: 'Support',
    excerpt: 'Defines SLA tiers (P0–P3), breach thresholds, escalation paths, and on-call contact protocols.',
    author: { id: 'user-001', name: 'Aman Singh' },
    tags: ['sla', 'escalation', 'policy'],
    views: 203,
    helpful: 61,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-004',
    title: 'CSV Export Timezone Handling',
    category: 'Engineering',
    excerpt: 'Explains how the export pipeline processes timestamps and how to add timezone-aware formatting for client reports.',
    author: { id: 'user-003', name: 'Neha Kapoor' },
    tags: ['csv', 'timezone', 'export'],
    views: 34,
    helpful: 12,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-005',
    title: 'Customer Onboarding Checklist',
    category: 'Support',
    excerpt: 'A step-by-step checklist for onboarding new enterprise customers including SSO setup, data migration, and training.',
    author: { id: 'user-001', name: 'Aman Singh' },
    tags: ['onboarding', 'enterprise', 'checklist'],
    views: 178,
    helpful: 54,
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-006',
    title: 'Browser Cache Invalidation Best Practices',
    category: 'Engineering',
    excerpt: 'Covers CDN cache-busting strategies, ETag usage, and service-worker cache management for web applications.',
    author: { id: 'user-002', name: 'Rahul Verma' },
    tags: ['cache', 'cdn', 'frontend'],
    views: 57,
    helpful: 19,
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Copilot Page (Standalone AI Chat) ────────────────────────────────────────

export const dummyCopilotPageHistory = [
  {
    id: 'cp-msg-001',
    role: 'assistant' as const,
    content: "Hi! I'm your AI Copilot. I can help you analyse tickets, draft responses, search the knowledge base, and suggest assignments. What would you like to work on?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'cp-msg-002',
    role: 'user' as const,
    content: 'Which tickets are breaching SLA right now?',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'cp-msg-003',
    role: 'assistant' as const,
    content: '**1 ticket has breached SLA:**\n\n- **ticket-004** — *Payment gateway timeout during peak hours* (CRITICAL, breached 1 hour ago)\n\n**1 ticket is at risk:**\n\n- **ticket-001** — *Login page throws 500 on invalid credentials* (HIGH, 2 hours remaining)\n\nWould you like me to draft an escalation message or suggest re-assignment for either of these?',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    suggestedActions: [
      { type: 'navigate', label: 'Open ticket-004', payload: { ticketId: 'ticket-004' } },
      { type: 'navigate', label: 'Open ticket-001', payload: { ticketId: 'ticket-001' } },
    ],
  },
];

export const dummyCopilotPageResponses: Record<string, { response: string; suggestedActions?: { type: string; label: string; payload: unknown }[] }> = {
  default: {
    response: "I've reviewed your query. Based on the current ticket data and knowledge base, here's what I found:\n\nThere are currently 2 open high-priority tickets that need attention. The most critical one is the payment gateway issue which has already breached its SLA. Would you like me to help prioritise or draft a response?",
    suggestedActions: [
      { type: 'navigate', label: 'View critical tickets', payload: { filter: 'CRITICAL' } },
      { type: 'search', label: 'Search knowledge base', payload: {} },
    ],
  },
};

// ── Reports Page ──────────────────────────────────────────────────────────────

export const dummyReports = {
  overview: {
    totalTickets: 128,
    openTickets: 34,
    resolvedThisWeek: 47,
    avgResolutionHours: 6.4,
    slaBreachRate: 0.08,
    customerSatisfaction: 4.3,
  },
  ticketsByStatus: [
    { status: 'OPEN', count: 34 },
    { status: 'IN_PROGRESS', count: 22 },
    { status: 'RESOLVED', count: 59 },
    { status: 'CLOSED', count: 13 },
  ],
  ticketsByPriority: [
    { priority: 'CRITICAL', count: 5 },
    { priority: 'HIGH', count: 18 },
    { priority: 'MEDIUM', count: 61 },
    { priority: 'LOW', count: 44 },
  ],
  ticketsByCategory: [
    { category: 'BUG', count: 42 },
    { category: 'FEATURE_REQUEST', count: 31 },
    { category: 'INCIDENT', count: 12 },
    { category: 'DATA_ISSUE', count: 19 },
    { category: 'OTHER', count: 24 },
  ],
  volumeByDay: [
    { date: '2026-04-09', created: 18, resolved: 14 },
    { date: '2026-04-10', created: 22, resolved: 19 },
    { date: '2026-04-11', created: 15, resolved: 21 },
    { date: '2026-04-12', created: 9, resolved: 7 },
    { date: '2026-04-13', created: 6, resolved: 5 },
    { date: '2026-04-14', created: 24, resolved: 16 },
    { date: '2026-04-15', created: 19, resolved: 11 },
  ],
  agentPerformance: [
    { agentId: 'user-002', agentName: 'Rahul Verma', resolved: 21, avgHours: 4.2, satisfaction: 4.6 },
    { agentId: 'user-003', agentName: 'Neha Kapoor', resolved: 18, avgHours: 5.8, satisfaction: 4.4 },
    { agentId: 'user-006', agentName: 'Siddharth Jain', resolved: 14, avgHours: 8.1, satisfaction: 4.1 },
    { agentId: 'user-007', agentName: 'Anjali Desai', resolved: 11, avgHours: 6.5, satisfaction: 4.5 },
  ],
};

// ── Team Page ─────────────────────────────────────────────────────────────────

export const dummyTeamMembers = [
  {
    id: 'user-001',
    firstName: 'Aman',
    lastName: 'Singh',
    email: 'aman.singh@aivanta.com',
    role: 'ADMIN',
    status: 'ONLINE',
    avatarUrl: null,
    openTickets: 0,
    resolvedThisWeek: 0,
    skills: ['Management', 'Escalations', 'Strategy'],
    joinedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'user-002',
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@aivanta.com',
    role: 'AGENT',
    status: 'ONLINE',
    avatarUrl: null,
    openTickets: 6,
    resolvedThisWeek: 21,
    skills: ['Backend', 'Auth', 'Payments', 'Debugging'],
    joinedAt: new Date('2024-03-15').toISOString(),
  },
  {
    id: 'user-003',
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha.kapoor@aivanta.com',
    role: 'AGENT',
    status: 'ONLINE',
    avatarUrl: null,
    openTickets: 4,
    resolvedThisWeek: 18,
    skills: ['Frontend', 'Data Issues', 'Reporting', 'Customer Success'],
    joinedAt: new Date('2024-04-01').toISOString(),
  },
  {
    id: 'user-006',
    firstName: 'Siddharth',
    lastName: 'Jain',
    email: 'siddharth.jain@aivanta.com',
    role: 'AGENT',
    status: 'AWAY',
    avatarUrl: null,
    openTickets: 3,
    resolvedThisWeek: 14,
    skills: ['Integrations', 'API', 'Onboarding'],
    joinedAt: new Date('2024-06-20').toISOString(),
  },
  {
    id: 'user-007',
    firstName: 'Anjali',
    lastName: 'Desai',
    email: 'anjali.desai@aivanta.com',
    role: 'AGENT',
    status: 'OFFLINE',
    avatarUrl: null,
    openTickets: 2,
    resolvedThisWeek: 11,
    skills: ['Mobile', 'UX Issues', 'Feature Requests'],
    joinedAt: new Date('2024-08-05').toISOString(),
  },
];

export const dummyTeamStats = {
  totalAgents: 4,
  onlineAgents: 2,
  awayAgents: 1,
  offlineAgents: 1,
  totalOpenTickets: 15,
  avgTicketsPerAgent: 3.75,
};

// ── Settings Page ─────────────────────────────────────────────────────────────

export const dummySettings = {
  workspace: {
    name: 'AiVanta Support',
    domain: 'aivanta.com',
    timezone: 'Asia/Kolkata',
    language: 'en',
    logoUrl: null,
  },
  notifications: {
    emailOnNewTicket: true,
    emailOnSlaBreach: true,
    emailOnAssignment: true,
    slackWebhookUrl: '',
    slackOnCritical: false,
  },
  sla: {
    criticalResponseHours: 1,
    highResponseHours: 4,
    mediumResponseHours: 24,
    lowResponseHours: 72,
    businessHoursOnly: false,
  },
  ai: {
    autoCategorizationEnabled: true,
    autoRoutingEnabled: true,
    suggestedResponsesEnabled: true,
    copilotEnabled: true,
    confidenceThreshold: 0.75,
  },
  integrations: [
    { id: 'int-001', name: 'Slack', connected: false, logoUrl: null },
    { id: 'int-002', name: 'Jira', connected: false, logoUrl: null },
    { id: 'int-003', name: 'Stripe', connected: true, logoUrl: null },
    { id: 'int-004', name: 'SendGrid', connected: true, logoUrl: null },
    { id: 'int-005', name: 'GitHub', connected: false, logoUrl: null },
  ],
};
