import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../services/api';

interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  actions?: Array<{
    type: string;
    label: string;
    params: Record<string, unknown>;
  }>;
  timestamp: string;
}

interface CopilotSession {
  id: string;
  context: Record<string, unknown>;
  messages: CopilotMessage[];
}

interface CopilotState {
  sessions: CopilotSession[];
  currentSession: CopilotSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CopilotState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

export const sendCopilotQuery = createAsyncThunk(
  'copilot/sendQuery',
  async ({ query, context }: { query: string; context: Record<string, unknown> }) => {
    const response = await api.post<{
      content: string;
      actions?: CopilotMessage['actions'];
      context?: Record<string, unknown>;
      sessionId: string;
    }>('/ai/copilot/query', { query, context });
    return response.data;
  }
);

export const executeCopilotAction = createAsyncThunk(
  'copilot/executeAction',
  async ({ action, params }: { action: string; params: Record<string, unknown> }) => {
    const response = await api.post('/ai/copilot/action', { action, params });
    return response.data;
  }
);

const copilotSlice = createSlice({
  name: 'copilot',
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    addLocalMessage: (state, action: { payload: CopilotMessage }) => {
      if (state.currentSession) {
        state.currentSession.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCopilotQuery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendCopilotQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentSession && action.payload) {
          state.currentSession.messages.push({
            role: 'assistant',
            content: action.payload.content,
            actions: action.payload.actions,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(sendCopilotQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get response';
      });
  },
});

export const { setCurrentSession, clearCurrentSession, addLocalMessage } = copilotSlice.actions;
export default copilotSlice.reducer;
