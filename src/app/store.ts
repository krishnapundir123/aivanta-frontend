import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/slices/authSlice';
import ticketsReducer from '../features/tickets/slices/ticketsSlice';
import { api } from './api';
import { aiSocketMiddleware } from '../features/ai/middleware/aiSocketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(aiSocketMiddleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
