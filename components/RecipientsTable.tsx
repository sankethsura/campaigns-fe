'use client';

import { useState } from 'react';
import { EmailRecipient, PaginationMetadata } from '@/types/campaign';
import { useUpdateRecipientMutation, useDeleteRecipientMutation, useTriggerEmailNowMutation } from '@/store/api';

interface RecipientsTableProps {
  campaignId: string;
  recipients: EmailRecipient[];
  pagination?: PaginationMetadata;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function RecipientsTable({
  campaignId,
  recipients,
  pagination,
  currentPage,
  onPageChange
}: RecipientsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmailRecipient>>({});

  const [updateRecipient, { isLoading: isUpdating }] = useUpdateRecipientMutation();
  const [deleteRecipient, { isLoading: isDeleting }] = useDeleteRecipientMutation();
  const [triggerEmailNow, { isLoading: isTriggering }] = useTriggerEmailNowMutation();

  const handleEdit = (recipient: EmailRecipient) => {
    setEditingId(recipient._id);
    setEditForm({
      email: recipient.email,
      message: recipient.message,
      triggerDate: recipient.triggerDate.split('.')[0], // Remove milliseconds for datetime-local input
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (recipientId: string) => {
    try {
      await updateRecipient({
        campaignId,
        recipientId,
        data: {
          email: editForm.email,
          message: editForm.message,
          triggerDate: editForm.triggerDate,
        },
      }).unwrap();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update recipient:', error);
      alert('Failed to update recipient');
    }
  };

  const handleDelete = async (recipientId: string) => {
    if (!confirm('Are you sure you want to delete this recipient?')) {
      return;
    }

    try {
      await deleteRecipient({ campaignId, recipientId }).unwrap();
    } catch (error) {
      console.error('Failed to delete recipient:', error);
      alert('Failed to delete recipient');
    }
  };

  const handleTriggerNow = async (recipientId: string) => {
    if (!confirm('Send this email immediately?')) {
      return;
    }

    try {
      const result = await triggerEmailNow({ campaignId, recipientId }).unwrap();
      if (result.success) {
        alert('Email sent successfully!');
      } else {
        alert(`Failed to send email: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Failed to trigger email:', error);
      alert(error?.data?.error || 'Failed to trigger email');
    }
  };

  const getStatusBadge = (status: EmailRecipient['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (recipients.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No recipients added yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trigger Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipients.map((recipient) => (
              <tr key={recipient._id} className="hover:bg-gray-50">
                {editingId === recipient._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={editForm.message || ''}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="datetime-local"
                        value={editForm.triggerDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, triggerDate: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(recipient.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleSave(recipient._id)}
                        disabled={isUpdating}
                        className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recipient.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate group relative cursor-help">
                        {recipient.message}
                        <div className="invisible group-hover:visible absolute z-50 w-64 p-2 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 left-0 top-full whitespace-normal break-words">
                          {recipient.message}
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(recipient.triggerDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(recipient.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {recipient.status === 'pending' && (
                        <>
                          {isExpired(recipient.triggerDate) && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 mr-2">
                              Expired
                            </span>
                          )}
                          <button
                            onClick={() => handleTriggerNow(recipient._id)}
                            disabled={isTriggering}
                            className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                          >
                            Trigger Now
                          </button>
                          <button
                            onClick={() => handleEdit(recipient)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(recipient._id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {recipient.status === 'failed' && (
                        <button
                          onClick={() => handleTriggerNow(recipient._id)}
                          disabled={isTriggering}
                          className="text-orange-600 hover:text-orange-900 font-medium disabled:opacity-50"
                          title={recipient.error || 'Failed to send email'}
                        >
                          Retry
                        </button>
                      )}
                      {recipient.status === 'sent' && (
                        <span className="text-xs text-gray-500">
                          Sent {recipient.sentAt && formatDate(recipient.sentAt)}
                        </span>
                      )}
                      {recipient.status === 'processing' && (
                        <span className="text-xs text-purple-600">
                          Sending...
                        </span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pagination.limit, pagination.totalRecipients)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalRecipients}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
