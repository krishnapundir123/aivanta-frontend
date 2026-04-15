import { createSlice } from '@reduxjs/toolkit';
import { ticketsApi } from '../api/ticketsApi';

interface Ticket {
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

interface TicketsState {
  selectedTicket: Ticket | null;
  filters: {
    status: string;
    priority: string;
    category: string;
    search: string;
  };
}

const initialState: TicketsState = {
  selectedTicket: null,
  filters: {
    status: '',
    priority: '',
    category: '',
    search: '',
  },
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ticketsApi.endpoints.getTicket.matchFulfilled,
      (state, action) => {
        state.selectedTicket = action.payload;
      }
    );
  },
});

export const { setSelectedTicket, clearSelectedTicket, setFilters, clearFilters } =
  ticketsSlice.actions;

export default ticketsSlice.reducer;
