import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/api';

export const suggestionsApi = createApi({
  reducerPath: 'suggestionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (h, { getState }) => {
      const t = getState().auth.accessToken;
      if (t) h.set('authorization', `Bearer ${t}`);
      return h;
    },
  }),
  endpoints: (b) => ({
    // chat with AI (non-stream example)
    chatSuggest: b.mutation({
      query: (body) => ({ url: '/suggestions/chat', method: 'POST', body }),
    }),
    // soil/leaf image analysis
    analyzeSoilImage: b.mutation({
      query: ({ file, crop }) => {
        const form = new FormData();
        form.append('image', file);
        if (crop) form.append('crop', crop);
        return { url: '/soil/analyze', method: 'POST', body: form };
      },
    }),
    // proxy endpoints in backend
    geocodeAddress: b.mutation({
      query: ({ address }) => ({ url: '/geo/geocode', method: 'POST', body: { address } }),
    }),
    weatherByCoords: b.query({
      query: ({ lat, lon }) => `/weather/current?lat=${lat}&lon=${lon}`,
    }),
    marketTrends: b.query({
      query: ({ state, district, crop }) =>
        `/market/trends?state=${encodeURIComponent(state||'')}&district=${encodeURIComponent(district||'')}&crop=${encodeURIComponent(crop||'')}`,
    }),
  }),
});

export const {
  useChatSuggestMutation,
  useAnalyzeSoilImageMutation,
  useGeocodeAddressMutation,
  useWeatherByCoordsQuery,
  useMarketTrendsQuery,
} = suggestionsApi;
