// Common constants shared across the application

/**
 * API configuration
 */
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 30000,
  RETRY_LIMIT: 2,
} as const;

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  PASSWORD_MIN_LENGTH: 8,
  SESSION_COOKIE_NAME: 'auth_session',
} as const;

/**
 * File upload configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'] as const,
  ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg'] as const,
} as const;

/**
 * Document statuses
 */
export const DOCUMENT_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;

/**
 * Recipient roles
 */
export const RECIPIENT_ROLES = {
  SIGNER: 'SIGNER',
  VIEWER: 'VIEWER',
  APPROVER: 'APPROVER',
  CC: 'CC',
} as const;

/**
 * Field types
 */
export const FIELD_TYPES = {
  SIGNATURE: 'SIGNATURE',
  TEXT: 'TEXT',
  DATE: 'DATE',
  EMAIL: 'EMAIL',
  NAME: 'NAME',
  NUMBER: 'NUMBER',
  CHECKBOX: 'CHECKBOX',
  DROPDOWN: 'DROPDOWN',
  RADIO: 'RADIO',
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;
