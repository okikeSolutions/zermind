import { z } from "zod";

// Participant role enum
export const participantRoleSchema = z.enum([
  "owner",
  "collaborator",
  "viewer",
]);

// Invitation role enum (subset of participant roles)
export const invitationRoleSchema = z.enum(["collaborator", "viewer"]);

// Invitation request schema for API validation
export const invitationRequestSchema = z.object({
  chatId: z.string().uuid("Chat ID must be a valid UUID"),
  inviteeEmail: z.string().email("Must be a valid email address"),
  role: invitationRoleSchema,
  chatTitle: z.string().optional(),
});

// Collaboration session creation schema
export const createCollaborationSessionSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  role: participantRoleSchema.optional().default("collaborator"),
  maxParticipants: z.number().int().min(1).max(50).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// Join collaboration session schema
export const joinCollaborationSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  role: participantRoleSchema.optional().default("collaborator"),
});

// Update collaboration session schema
export const updateCollaborationSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  maxParticipants: z.number().int().min(1).max(50).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// Participant update schema
export const updateParticipantSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required"),
  role: participantRoleSchema,
});

// Collaboration invite schema
export const collaborationInviteSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  inviteeEmail: z.string().email("Valid email is required"),
  role: participantRoleSchema.default("collaborator"),
  message: z.string().max(500).optional(),
  expiresIn: z.number().int().min(1).max(168).default(24), // Hours, max 1 week
});

// Real-time action schemas
export const mindMapActionSchema = z.object({
  type: z.enum([
    "node_move",
    "node_select",
    "node_create",
    "node_delete",
    "cursor_move",
    "user_join",
    "user_leave",
  ]),
  nodeId: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  userId: z.string(),
  userName: z.string(),
  userColor: z.string(),
  timestamp: z.number(),
  data: z.record(z.string(), z.unknown()).optional(),
});

// Collaborative user schema
export const collaborativeUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  cursor: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  selectedNodeId: z.string().optional(),
  color: z.string(),
  online_at: z.coerce.date(),
});

// Session permissions schema
export const sessionPermissionsSchema = z.object({
  canEdit: z.boolean(),
  canInvite: z.boolean(),
  canManage: z.boolean(),
  canDelete: z.boolean(),
  maxNodes: z.number().optional(),
});

// Collaboration settings schema
export const collaborationSettingsSchema = z.object({
  allowAnonymous: z.boolean().default(false),
  requireApproval: z.boolean().default(true),
  autoLayout: z.boolean().default(true),
  showCursors: z.boolean().default(true),
  showPresence: z.boolean().default(true),
  conflictResolution: z
    .enum(["last-writer-wins", "manual", "auto-merge"])
    .default("last-writer-wins"),
  defaultRole: z.enum(["collaborator", "viewer"]).default("collaborator"),
  maxParticipants: z.number().optional(),
});

// Collaboration session response schema
export const collaborationSessionSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  activeSince: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    return val;
  }, z.date()),
  lastActivity: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    return val;
  }, z.date()),
  maxParticipants: z.number().nullable(),
  settings: collaborationSettingsSchema.nullable(),
  participants: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      role: participantRoleSchema,
      joinedAt: z.preprocess((val) => {
        if (typeof val === "string") return new Date(val);
        return val;
      }, z.date()),
      lastActivity: z.preprocess((val) => {
        if (typeof val === "string") return new Date(val);
        return val;
      }, z.date()),
    })
  ),
});

// Export types
export type ParticipantRole = z.infer<typeof participantRoleSchema>;
export type InvitationRole = z.infer<typeof invitationRoleSchema>;
export type InvitationRequest = z.infer<typeof invitationRequestSchema>;
export type CreateCollaborationSession = z.infer<
  typeof createCollaborationSessionSchema
>;
export type JoinCollaborationSession = z.infer<
  typeof joinCollaborationSessionSchema
>;
export type UpdateCollaborationSession = z.infer<
  typeof updateCollaborationSessionSchema
>;
export type CollaborationSession = z.infer<typeof collaborationSessionSchema>;
export type UpdateParticipant = z.infer<typeof updateParticipantSchema>;
export type CollaborationInvite = z.infer<typeof collaborationInviteSchema>;
export type MindMapAction = z.infer<typeof mindMapActionSchema>;
export type CollaborativeUser = z.infer<typeof collaborativeUserSchema>;
export type SessionPermissions = z.infer<typeof sessionPermissionsSchema>;
export type CollaborationSettings = z.infer<typeof collaborationSettingsSchema>;
