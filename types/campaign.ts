export interface Campaign {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'paused';
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRecipient {
  _id: string;
  campaignId: string;
  email: string;
  message: string;
  triggerDate: string;
  status: 'pending' | 'sent' | 'failed' | 'scheduled' | 'processing';
  sentAt?: string;
  error?: string;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
}

export interface UploadExcelResponse {
  success: boolean;
  message: string;
  data?: {
    validRecipients: Array<{
      email: string;
      triggerDate: string;
      message: string;
    }>;
    errors: Array<{
      row: number;
      error: string;
    }>;
  };
}

export interface AddRecipientRequest {
  email: string;
  message: string;
  triggerDate: string;
}

export interface UpdateRecipientRequest {
  email?: string;
  message?: string;
  triggerDate?: string;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalRecipients: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedRecipientsResponse {
  recipients: EmailRecipient[];
  pagination: PaginationMetadata;
}
