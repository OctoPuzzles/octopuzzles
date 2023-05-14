import { z } from 'zod';

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

export const VerificationModeValidator = z.enum(['ON_DEMAND', 'ON_COMPLETE', 'ON_INPUT']);
export type VerificationMode = z.infer<typeof VerificationModeValidator>;

export const UserSettingsValidator = z.object({
  userId: z.number().int(),
  scanner: ScannerSettingsValidator.nullish(),
  verificationMode: VerificationModeValidator.nullable()
});
export type UserSettings = z.infer<typeof UserSettingsValidator>;

export const UpdateUserSettingsValidator = UserSettingsValidator.partial();
