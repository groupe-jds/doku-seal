import { z } from 'zod';

// Create Organisation
export const CreateOrganisationSchema = z.object({
  name: z.string().min(1, 'Organisation name is required').max(255),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export type CreateOrganisationDto = z.infer<typeof CreateOrganisationSchema>;

// Update Organisation
export const UpdateOrganisationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
});

export type UpdateOrganisationDto = z.infer<typeof UpdateOrganisationSchema>;

// Invite Member to Organisation
export const InviteOrganisationMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export type InviteOrganisationMemberDto = z.infer<typeof InviteOrganisationMemberSchema>;

// Update Member Role
export const UpdateOrganisationMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export type UpdateOrganisationMemberRoleDto = z.infer<typeof UpdateOrganisationMemberRoleSchema>;

// Remove Member
export const RemoveOrganisationMemberSchema = z.object({
  memberId: z.string(),
});

export type RemoveOrganisationMemberDto = z.infer<typeof RemoveOrganisationMemberSchema>;

// Accept Invitation
export const AcceptOrganisationInvitationSchema = z.object({
  token: z.string(),
});

export type AcceptOrganisationInvitationDto = z.infer<typeof AcceptOrganisationInvitationSchema>;

// Organisation Settings
export const UpdateOrganisationSettingsSchema = z.object({
  allowPublicTemplates: z.boolean().optional(),
  requireSignatureApproval: z.boolean().optional(),
  enableTwoFactorAuth: z.boolean().optional(),
});

export type UpdateOrganisationSettingsDto = z.infer<typeof UpdateOrganisationSettingsSchema>;

// List Organisations
export const ListOrganisationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ListOrganisationsDto = z.infer<typeof ListOrganisationsSchema>;
