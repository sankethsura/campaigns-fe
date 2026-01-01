'use client';

import { useState } from 'react';
import { EmailRecipient, PaginationMetadata } from '@/types/campaign';
import { useUpdateRecipientMutation, useDeleteRecipientMutation, useTriggerEmailNowMutation } from '@/store/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Edit,
  Trash2,
  Save,
  X,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

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
    const variantMap: Record<EmailRecipient['status'], "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
      pending: 'warning',
      scheduled: 'info',
      processing: 'secondary',
      sent: 'success',
      failed: 'destructive',
    };

    const iconMap: Record<EmailRecipient['status'], React.ReactNode> = {
      pending: <Clock className="h-3 w-3" />,
      scheduled: <Clock className="h-3 w-3" />,
      processing: <Loader2 className="h-3 w-3 animate-spin" />,
      sent: <CheckCircle2 className="h-3 w-3" />,
      failed: <AlertTriangle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variantMap[status]} className="gap-1">
        {iconMap[status]}
        {status.toUpperCase()}
      </Badge>
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
      <div className="text-center py-16 bg-accent/30 rounded-lg border-2 border-dashed">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground font-medium">No recipients added yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Add recipients to start your campaign</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-accent/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Trigger Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {recipients.map((recipient) => (
              <tr key={recipient._id} className="hover:bg-accent/30 transition-colors">
                {editingId === recipient._id ? (
                  <>
                    <td className="px-6 py-4">
                      <Input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="min-w-[200px]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Textarea
                        value={editForm.message || ''}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        rows={2}
                        className="min-w-[250px]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="datetime-local"
                        value={editForm.triggerDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, triggerDate: e.target.value })}
                        className="min-w-[200px]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(recipient.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(recipient._id)}
                          disabled={isUpdating}
                          size="sm"
                          variant="default"
                          className="gap-1"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          disabled={isUpdating}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {recipient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="max-w-xs truncate group relative cursor-help">
                        {recipient.message}
                        <div className="invisible group-hover:visible absolute z-50 w-80 p-3 mt-2 text-sm bg-popover text-popover-foreground border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 left-0 top-full whitespace-normal break-words">
                          {recipient.message}
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-popover border-l border-t transform rotate-45"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(recipient.triggerDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(recipient.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {recipient.status === 'pending' && (
                          <>
                            {isExpired(recipient.triggerDate) && (
                              <Badge variant="warning" className="gap-1 mr-2">
                                <AlertTriangle className="h-3 w-3" />
                                Expired
                              </Badge>
                            )}
                            <Button
                              onClick={() => handleTriggerNow(recipient._id)}
                              disabled={isTriggering}
                              size="sm"
                              variant="default"
                              className="gap-1"
                            >
                              <Send className="h-3 w-3" />
                              Trigger
                            </Button>
                            <Button
                              onClick={() => handleEdit(recipient)}
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(recipient._id)}
                              disabled={isDeleting}
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </>
                        )}
                        {recipient.status === 'failed' && (
                          <Button
                            onClick={() => handleTriggerNow(recipient._id)}
                            disabled={isTriggering}
                            size="sm"
                            variant="outline"
                            className="gap-1 border-orange-500 text-orange-600 hover:bg-orange-500/10"
                            title={recipient.error || 'Failed to send email'}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Retry
                          </Button>
                        )}
                        {recipient.status === 'sent' && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            Sent {recipient.sentAt && formatDate(recipient.sentAt)}
                          </span>
                        )}
                        {recipient.status === 'processing' && (
                          <span className="text-xs flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Sending...
                          </span>
                        )}
                      </div>
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
        <div className="flex items-center justify-between border-t bg-accent/30 px-4 py-4 sm:px-6 mt-4 rounded-b-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {(currentPage - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-foreground">
                  {Math.min(currentPage * pagination.limit, pagination.totalRecipients)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-foreground">{pagination.totalRecipients}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex gap-1" aria-label="Pagination">
                <Button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
