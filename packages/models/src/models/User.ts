import { z } from 'zod';

export const RoleValidator = z.enum(['Admin', 'User']);
export type Role = z.infer<typeof RoleValidator>;

export const UserValidator = z.object({
  id: z.number().int(),
  /** Username of the user */
  username: z
    .string()
    .max(32, 'Username is too long, it should be at most 32 characters long')
    .min(1, "Username can't be empty")
    .regex(
      /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen'
    ),
  /** The email of the user */
  email: z.string().email(),
  password: z.string().min(10).max(64),
  /** The users permission role */
  role: RoleValidator,
  /** Whether the user has verified their account */
  verified: z.boolean(),
  /** The time when the user was created */
  createdAt: z.date(),
  /** The last time the user was updated */
  updatedAt: z.date()
});

/** A frontend that is send to the frontend */
export const FrontendUserValidator = z.object({
  id: z.number().int(),
  /** Username of the user */
  username: z.string(),
  /** The users permission role */
  role: RoleValidator
});

export type User = z.infer<typeof UserValidator>;

export const ScannerHighlightModeValidator = z.enum(['None', 'Seen', 'Tuples']);
export type ScannerHighlightMode = z.infer<typeof ScannerHighlightModeValidator>;

export const ScannerModeValidator = z.enum(['Basic', 'Advanced', 'Extreme']);
export type ScannerMode = z.infer<typeof ScannerModeValidator>;

export const ScannerSpeedValidator = z.enum(['Slow', 'Fast', 'Instant']);
export type ScannerSpeed = z.infer<typeof ScannerSpeedValidator>;

export const ScannerSettingsValidator = z.object({
  highlightMode: ScannerHighlightModeValidator.nullish(),
  mode: ScannerModeValidator.nullish(),
  scannerSpeed: ScannerSpeedValidator.nullish(),
  autoScan: z.boolean().nullish(),
  useCentreMarks: z.boolean().nullish(),
  useCornerMarks: z.boolean().nullish(),
  scanDiagonals: z.boolean().nullish(),
  scanAntiKnight: z.boolean().nullish(),
  scanAntiKing: z.boolean().nullish(),
  scanDisjointSets: z.boolean().nullish(),
  scanCages: z.boolean().nullish(),
  scanPaths: z.boolean().nullish(),
  scanExtraRegions: z.boolean().nullish(),
  scanNegativeXV: z.boolean().nullish(),
  scanNegativeKropki: z.boolean().nullish(),
  scanNonConsecutive: z.boolean().nullish()
});
export type ScannerSettings = z.infer<typeof ScannerSettingsValidator>;

export const UserSettingsValidator = z.object({
  userId: z.number().int(),
  scanner: ScannerSettingsValidator.optional()
});
export type UserSettings = z.infer<typeof UserSettingsValidator>;

export const UpdateUserSettingsValidator = UserSettingsValidator.partial();
