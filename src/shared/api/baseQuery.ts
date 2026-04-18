import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Local shape to avoid circular dependency with app/store
interface StateShape {
  auth: { token: string | null };
}

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as StateShape).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});
