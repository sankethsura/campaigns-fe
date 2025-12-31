import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/lib/auth';
import { User } from '@/types/user';
import {
  Campaign,
  EmailRecipient,
  CreateCampaignRequest,
  UploadExcelResponse,
  AddRecipientRequest,
  UpdateRecipientRequest,
  PaginatedRecipientsResponse
} from '@/types/campaign';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Campaign', 'Recipient'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => '/api/user/profile',
      providesTags: ['User'],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Campaign endpoints
    getCampaigns: builder.query<Campaign[], void>({
      query: () => '/api/campaigns',
      providesTags: ['Campaign'],
      // Poll every 5 seconds for real-time updates
      pollingInterval: 5000,
    }),

    getCampaignById: builder.query<Campaign, string>({
      query: (id) => `/api/campaigns/${id}`,
      providesTags: ['Campaign'],
      // Poll every 5 seconds for real-time updates
      pollingInterval: 5000,
    }),

    createCampaign: builder.mutation<Campaign, CreateCampaignRequest>({
      query: (data) => ({
        url: '/api/campaigns',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Campaign'],
    }),

    uploadExcel: builder.mutation<UploadExcelResponse, { campaignId: string; file: File }>({
      query: ({ campaignId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/api/campaigns/${campaignId}/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Campaign', 'Recipient'],
    }),

    getCampaignRecipients: builder.query<PaginatedRecipientsResponse, { campaignId: string; page?: number; limit?: number }>({
      query: ({ campaignId, page = 1, limit = 10 }) => ({
        url: `/api/campaigns/${campaignId}/recipients`,
        params: { page, limit }
      }),
      providesTags: ['Recipient'],
      // Poll every 5 seconds for real-time updates
      pollingInterval: 5000,
    }),

    addRecipient: builder.mutation<EmailRecipient, { campaignId: string; data: AddRecipientRequest }>({
      query: ({ campaignId, data }) => ({
        url: `/api/campaigns/${campaignId}/recipients`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Recipient', 'Campaign'],
    }),

    updateRecipient: builder.mutation<EmailRecipient, { campaignId: string; recipientId: string; data: UpdateRecipientRequest }>({
      query: ({ campaignId, recipientId, data }) => ({
        url: `/api/campaigns/${campaignId}/recipients/${recipientId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Recipient'],
    }),

    deleteRecipient: builder.mutation<{ message: string }, { campaignId: string; recipientId: string }>({
      query: ({ campaignId, recipientId }) => ({
        url: `/api/campaigns/${campaignId}/recipients/${recipientId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recipient', 'Campaign'],
    }),

    deleteCampaign: builder.mutation<{ message: string }, string>({
      query: (campaignId) => ({
        url: `/api/campaigns/${campaignId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign'],
    }),

    triggerEmailNow: builder.mutation<{ success: boolean; message: string; error?: string }, { campaignId: string; recipientId: string }>({
      query: ({ campaignId, recipientId }) => ({
        url: `/api/campaigns/${campaignId}/recipients/${recipientId}/trigger`,
        method: 'POST',
      }),
      invalidatesTags: ['Recipient', 'Campaign'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLogoutMutation,
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUploadExcelMutation,
  useGetCampaignRecipientsQuery,
  useAddRecipientMutation,
  useUpdateRecipientMutation,
  useDeleteRecipientMutation,
  useDeleteCampaignMutation,
  useTriggerEmailNowMutation,
} = api;
