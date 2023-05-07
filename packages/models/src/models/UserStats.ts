import { z } from 'zod';

export const UserStatsValidator = z.object({
  sudokuId: z.number().int(),
  userId: z.number().int(),
  lastViewedOn: z.date(),
  solvedOn: z.date().nullable(),
  solveTime: z.number().int().nullable(),
  difficulty: z.number().int().nullable()
});
export type UserStats = z.infer<typeof UserStatsValidator>;

export const SudokuStatsValidator = z.array(
  z.object({
    lastViewedOn: z.date(),
    solvedOn: z.date().nullable(),
    difficulty: z.number().int().nullable()
  })
);
export type SudokuStats = z.infer<typeof SudokuStatsValidator>;
