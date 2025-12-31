'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCampaignsQuery, useCreateCampaignMutation, useDeleteCampaignMutation, useGetUserProfileQuery } from '@/store/api';
import Navbar from '@/components/Navbar';

export default function CampaignsPage() {
  const router = useRouter();
  const { data: user } = useGetUserProfileQuery();
  const { data: campaigns = [], isLoading } = useGetCampaignsQuery();
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
  });

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCampaign.name.trim()) {
      alert('Campaign name is required');
      return;
    }

    try {
      const campaign = await createCampaign({
        name: newCampaign.name,
        description: newCampaign.description || undefined,
      }).unwrap();

      setNewCampaign({ name: '', description: '' });
      setShowCreateForm(false);

      router.push(`/campaigns/${campaign._id}`);
    } catch (error: any) {
      console.error('Failed to create campaign:', error);
      alert(error?.data?.message || 'Failed to create campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string, campaignName: string) => {
    if (!confirm(`Are you sure you want to delete "${campaignName}"? This will also delete all recipients.`)) {
      return;
    }

    try {
      await deleteCampaign(campaignId).unwrap();
    } catch (error: any) {
      console.error('Failed to delete campaign:', error);
      alert(error?.data?.message || 'Failed to delete campaign');
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showCreateForm ? 'Cancel' : 'Create Campaign'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="e.g., Summer Newsletter 2025"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Brief description of this campaign..."
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Campaign'}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading campaigns...</div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first email campaign
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <div
                  onClick={() => router.push(`/campaigns/${campaign._id}`)}
                  className="p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {campaign.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  {campaign.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Recipients:</span>
                      <span className="font-medium text-gray-900">{campaign.totalRecipients}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sent:</span>
                      <span className="font-medium text-green-600">{campaign.sentCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Failed:</span>
                      <span className="font-medium text-red-600">{campaign.failedCount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {formatDate(campaign.createdAt)}
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/campaigns/${campaign._id}`);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCampaign(campaign._id, campaign.name);
                    }}
                    disabled={isDeleting}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
