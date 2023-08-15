import { z } from 'zod';
import { GameDataValidator } from './Walkthrough';

export const SavedGameValidator = z.object({
  sudokuId: z.number().int(),
  userId: z.number().int(),
  /** When this game was saved */
  savedOn: z.date(),
  gameData: GameDataValidator
});
export type SavedGame = z.infer<typeof SavedGameValidator>;
