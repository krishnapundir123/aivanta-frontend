import { api } from '../../../app/api';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  aiCategory?: string;
  aiConfidence?: number;
  slaStatus: string;
  slaDeadline?: string;
  slaTimeRemaining?: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTickets {
  data: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: string;
  category?: string;
}

export interface UpdateTicketInput {
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export const ticketsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<PaginatedTickets, { status?: string; priority?: string; category?: string }>({
      query: (params) => ({
        url: '/tickets',
        params,
      }),
      transformResponse: (raw: { data: Ticket[]; pagination: PaginatedTickets['pagination'] }) => ({
        data: raw.data,
        pagination: raw.pagination,
      }),
      providesTags: ['Ticket'],
    }),

    getTicket: builder.query<Ticket, string>({
      query: (id) => `/tickets/${id}`,
      transformResponse: (raw: { data: Ticket }) => raw.data,
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),
    
    createTicket: builder.mutation<Ticket, CreateTicketInput>({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    updateTicket: builder.mutation<Ticket, { id: string; data: UpdateTicketInput }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Ticket', id }],
    }),
    
    deleteTicket: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;
