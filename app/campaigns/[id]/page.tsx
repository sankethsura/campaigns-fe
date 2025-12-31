'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetCampaignByIdQuery,
  useGetCampaignRecipientsQuery,
  useAddRecipientMutation,
  useGetUserProfileQuery,
} from '@/store/api';
import RecipientsTable from '@/components/RecipientsTable';
import Navbar from '@/components/Navbar';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const { data: user } = useGetUserProfileQuery();
  const { data: campaign, isLoading: campaignLoading } = useGetCampaignByIdQuery(campaignId);

  const [currentPage, setCurrentPage] = useState(1);
  const { data: recipientsData, isLoading: recipientsLoading, refetch } = useGetCampaignRecipientsQuery({
    campaignId,
    page: currentPage,
    limit: 10
  });

  const [addRecipient, { isLoading: isAdding }] = useAddRecipientMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    message: '',
    triggerDate: '',
  });

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRecipient.email || !newRecipient.message || !newRecipient.triggerDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await addRecipient({
        campaignId,
        data: {
          email: newRecipient.email,
          message: newRecipient.message,
          triggerDate: newRecipient.triggerDate,
        },
      }).unwrap();

      setNewRecipient({ email: '', message: '', triggerDate: '' });
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      console.error('Failed to add recipient:', error);
      alert(error?.data?.message || 'Failed to add recipient');
    }
  };

  if (!user || campaignLoading || recipientsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-red-600">Campaign not found</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/campaigns')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaigns
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                {campaign.description && (
                  <p className="mt-2 text-gray-600">{campaign.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                {campaign.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Recipients</div>
                <div className="text-2xl font-bold text-gray-900">{campaign.totalRecipients}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Sent</div>
                <div className="text-2xl font-bold text-green-600">{campaign.sentCount}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Failed</div>
                <div className="text-2xl font-bold text-red-600">{campaign.failedCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Import Recipients from Excel</h2>
            <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Bulk import recipients from Excel files with columns: <strong>email</strong>, <strong>triggerDate</strong> (YYYY-MM-DD HH:MM), <strong>message</strong>
          </p>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-500 font-medium">Excel Import Feature</p>
            <p className="text-sm text-gray-400 mt-1">This feature will be available soon</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recipients ({recipientsData?.pagination.totalRecipients || 0})
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showAddForm ? 'Cancel' : 'Add Recipient Manually'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddRecipient} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newRecipient.triggerDate}
                    onChange={(e) => setNewRecipient({ ...newRecipient, triggerDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newRecipient.message}
                  onChange={(e) => setNewRecipient({ ...newRecipient, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Email message content..."
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add Recipient'}
              </button>
            </form>
          )}

          <RecipientsTable
            campaignId={campaignId}
            recipients={recipientsData?.recipients || []}
            pagination={recipientsData?.pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
