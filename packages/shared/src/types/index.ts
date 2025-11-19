// Common TypeScript types shared across the application

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

// User types
export interface User {
  id: number;
  name: string | null;
  email: string;
  avatarImageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Document/Envelope types
export type DocumentStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'ARCHIVED';
export type DocumentVisibility = 'EVERYONE' | 'TEAM' | 'MANAGER_AND_ABOVE';
export type RecipientRole = 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
export type FieldType =
  | 'SIGNATURE'
  | 'TEXT'
  | 'DATE'
  | 'EMAIL'
  | 'NAME'
  | 'NUMBER'
  | 'CHECKBOX'
  | 'DROPDOWN'
  | 'RADIO';

// Organisation types
export type OrganisationRole = 'ADMIN' | 'MEMBER';

// Team types
export type TeamRole = 'ADMIN' | 'MANAGER' | 'MEMBER';
