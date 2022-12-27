import { z } from 'zod';

export const UserStatsValidator = z.object({
  sudokuId: z.number().int(),
  userId: z.number().int(),
  lastViewedOn: z.date(),
  bookmarked: z.boolean().optional(),
  solvedOn: z.date().optional(),
  solveTime: z.number().int().optional(),
});
export type UserStats = z.infer<typeof UserStatsValidator>;
