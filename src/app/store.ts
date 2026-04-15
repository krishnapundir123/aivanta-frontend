import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/store/authSlice';
import ticketsReducer from '../features/tickets/store/ticketsSlice';
import { ticketsApi } from '../features/tickets/api/ticketsApi';
import { aiApi } from '../features/ai/api/aiApi';
import { aiSocketMiddleware } from '../features/ai/middleware/aiSocketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ticketsApi.middleware)
      .concat(aiApi.middleware)
      .concat(aiSocketMiddleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
