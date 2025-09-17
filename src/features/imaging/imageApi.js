import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/api';

// export const imagingApi = createApi({
//   reducerPath: 'imagingApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.accessToken;
//       if (token) headers.set('authorization', `Bearer ${token}`);
//       // do NOT set Content-Type; browser will add multipart boundary
//       return headers;
//     },
//   }),
//   endpoints: (build) => ({
//     analyzeImage: build.mutation({
//       query: ({ file, crop, districtId }) => {
//         const form = new FormData();
//         form.append('image', file);
//         if (crop) form.append('crop', crop);
//         if (districtId) form.append('districtId', districtId);
//         return { url: '/analyses', method: 'POST', body: form };
//       },
//     }),
//   }),
// });

// export const { useAnalyzeImageMutation } = imagingApi;


export const imagingApi = createApi({
  reducerPath: 'diseaseDetectionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/disease-detection`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Analysis'],
  endpoints: (build) => ({
    
    // Analyze image
    analyzeImage: build.mutation({
      query: ({ file, crop, district, state, provider, latitude, longitude }) => {
        const formData = new FormData();
        formData.append('image', file);
        
        if (crop) formData.append('crop', crop);
        if (district) formData.append('district', district);
        if (state) formData.append('state', state);
        if (provider) formData.append('provider', provider);
        if (latitude) formData.append('latitude', latitude.toString());
        if (longitude) formData.append('longitude', longitude.toString());

        return {
          url: '/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Analysis'],
    }),

    // Get single analysis
    getAnalysis: build.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Analysis', id }],
    }),

    // List analyses with pagination
    listAnalyses: build.query({
      query: ({ limit = 20, offset = 0, status } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });
        
        if (status) params.append('status', status);
        
        return `/?${params}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Analysis', id })),
              { type: 'Analysis', id: 'LIST' },
            ]
          : [{ type: 'Analysis', id: 'LIST' }],
    }),

    // Get statistics
    getStats: build.query({
      query: () => '/stats/summary',
      providesTags: [{ type: 'Analysis', id: 'STATS' }],
    }),

    // Retry failed analysis
    retryAnalysis: build.mutation({
      query: (id) => ({
        url: `/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Analysis', id },
        { type: 'Analysis', id: 'LIST' },
        { type: 'Analysis', id: 'STATS' },
      ],
    }),

    // Delete analysis
    deleteAnalysis: build.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Analysis', id },
        { type: 'Analysis', id: 'LIST' },
        { type: 'Analysis', id: 'STATS' },
      ],
    }),

  }),
});

export const {
  useAnalyzeImageMutation,
  useGetAnalysisQuery,
  useListAnalysesQuery,
  useGetStatsQuery,
  useRetryAnalysisMutation,
  useDeleteAnalysisMutation,
} = imagingApi;