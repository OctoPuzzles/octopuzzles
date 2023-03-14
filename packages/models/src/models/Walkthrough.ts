import { z } from 'zod';
import { ColorValidator } from './Sudoku';

export const GameValuesValidator = z.array(z.array(z.string()));
export type GameValues = z.infer<typeof GameValuesValidator>;

export const CornermarksValidator = z.array(z.array(z.string()));
export type Cornermarks = z.infer<typeof CornermarksValidator>;

export const CentermarksValidator = z.array(z.array(z.string()));
export type Centermarks = z.infer<typeof CentermarksValidator>;

export const NotesValidator = z.array(z.array(z.string()));
export type Notes = z.infer<typeof NotesValidator>;

export const GameColorsValidator = z.array(z.array(z.array(ColorValidator)));
export type GameColors = z.infer<typeof GameColorsValidator>;

/** A single step on the way to a solution */
export const SolutionStepValidator = z.object({
  /** Values on the solution step */
  values: GameValuesValidator,
  /** Cornermarks on the solution step */
  cornermarks: CornermarksValidator,
  /** Centermarks on the solution step */
  centermarks: CentermarksValidator,
  /** Notes on the solution step */
  notes: NotesValidator,
  /** A list of colors on each cell */
  colors: GameColorsValidator
});
export type SolutionStep = z.infer<typeof SolutionStepValidator>;

/** A single step on the way to a solution */
export const WalkthroughStepValidator = z.object({
  /** A description of the logic used etc. */
  description: z.string(),
  /** The actual important step */
  step: SolutionStepValidator
});
export type WalkthroughStep = z.infer<typeof WalkthroughStepValidator>;

export const WalkthroughValidator = z.object({
  id: z.number().int(),
  /** The sudoku this walkthrough is made on */
  sudokuId: z.number().int(),
  /** The user that made this walkthrough */
  userId: z.number().int(),
  /** The steps on the way to the solution */
  steps: z.array(WalkthroughStepValidator)
});
export type Walkthrough = z.infer<typeof WalkthroughValidator>;
