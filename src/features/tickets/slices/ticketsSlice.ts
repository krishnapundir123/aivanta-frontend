import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, ApiError } from '../../../services/api';
import { logout } from '../../auth/slices/authSlice';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category?: string;
  tags: string[];
  assigneeId?: string;
  requesterId: string;
  assignee?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  requester?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  aiSummary?: string;
  aiTriage?: {
    category: string;
    priority: string;
    confidence: number;
  };
  slaDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketsState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

const initialState: TicketsState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

function handleApiError(error: unknown, dispatch: Function): string {
  if (error instanceof ApiError && error.status === 401) {
    dispatch(logout());
    return 'Session expired. Please sign in again.';
  }
  return error instanceof Error ? error.message : 'An error occurred';
}

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (
    params: { page?: number; limit?: number; status?: string; priority?: string; search?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
      const response = await api.get<Ticket[]>(`/tickets?${queryParams.toString()}`);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error, dispatch));
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get<Ticket>(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, dispatch));
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (
    data: { title: string; description: string; priority?: string; category?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post<Ticket>('/tickets', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, dispatch));
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async (
    { id, data }: { id: string; data: Partial<Ticket> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.patch<Ticket>(`/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, dispatch));
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    addTicketMessage: (state, _action) => {
      if (state.currentTicket) {
        void state;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch tickets';
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTicket = action.payload || null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch ticket';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        if (action.payload) {
          state.tickets.unshift(action.payload);
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to create ticket';
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tickets.findIndex(t => t.id === action.payload!.id);
          if (index !== -1) {
            state.tickets[index] = action.payload;
          }
          if (state.currentTicket?.id === action.payload.id) {
            state.currentTicket = action.payload;
          }
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to update ticket';
      });
  },
});

export const { setFilters, clearFilters } = ticketsSlice.actions;
export default ticketsSlice.reducer;
