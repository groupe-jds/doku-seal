import { z } from 'zod';

// Create Team
export const CreateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(255),
  url: z
    .string()
    .min(3, 'URL must be at least 3 characters')
    .max(50, 'URL must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'URL must contain only lowercase letters, numbers, and hyphens'),
});

export type CreateTeamDto = z.infer<typeof CreateTeamSchema>;

// Update Team
export const UpdateTeamSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  url: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'URL must contain only lowercase letters, numbers, and hyphens')
    .optional(),
});

export type UpdateTeamDto = z.infer<typeof UpdateTeamSchema>;

// Invite Team Member
export const InviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']),
});

export type InviteTeamMemberDto = z.infer<typeof InviteTeamMemberSchema>;

// Update Member Role
export const UpdateTeamMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']),
});

export type UpdateTeamMemberRoleDto = z.infer<typeof UpdateTeamMemberRoleSchema>;

// Remove Team Member
export const RemoveTeamMemberSchema = z.object({
  memberId: z.string(),
});

export type RemoveTeamMemberDto = z.infer<typeof RemoveTeamMemberSchema>;

// Transfer Team Ownership
export const TransferTeamOwnershipSchema = z.object({
  newOwnerId: z.string(),
});

export type TransferTeamOwnershipDto = z.infer<typeof TransferTeamOwnershipSchema>;

// Team Settings
export const UpdateTeamSettingsSchema = z.object({
  allowPublicTemplates: z.boolean().optional(),
  requireSignatureApproval: z.boolean().optional(),
  enableAdvancedFields: z.boolean().optional(),
});

export type UpdateTeamSettingsDto = z.infer<typeof UpdateTeamSettingsSchema>;

// List Teams
export const ListTeamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ListTeamsDto = z.infer<typeof ListTeamsSchema>;

// Team Profile
export const UpdateTeamProfileSchema = z.object({
  enabled: z.boolean().optional(),
  bio: z.string().max(1000).optional(),
});

export type UpdateTeamProfileDto = z.infer<typeof UpdateTeamProfileSchema>;
