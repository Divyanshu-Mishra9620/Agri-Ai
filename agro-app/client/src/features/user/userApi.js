import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/api';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getProfile: build.query({ query: () => '/user/me' }),
    updateProfile: build.mutation({ query: (body) => ({ url: '/user/me', method: 'PUT', body }) }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
