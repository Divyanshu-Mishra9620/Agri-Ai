import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    signup: build.mutation({ query: (body) => 
      ({ url: '/auth/signup', method: 'POST', body }) }),
    login: build.mutation({ query: (body) => 
      ({ url: '/auth/login', method: 'POST', body }) }),
    refresh: build.mutation({ query: (body) => 
      ({ url: '/auth/refresh', method: 'POST', body }) }),
    logout: build.mutation({ query: () => 
      ({ url: '/auth/logout', method: 'POST' }) }),
  }),
});

export const {
  useSignupMutation, useLoginMutation, useRefreshMutation, useLogoutMutation,
} = authApi;
