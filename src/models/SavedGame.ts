import { z } from 'zod';
import { SolutionStepValidator } from './Walkthrough';

export const SavedGameValidator = z.object({
  sudokuId: z.number().int(),
  userId: z.number().int(),
  /** When this game was saved */
  savedOn: z.date(),
  gameData: SolutionStepValidator
});
export type SavedGame = z.infer<typeof SavedGameValidator>;
