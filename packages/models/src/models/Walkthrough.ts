import { z } from 'zod';
import { ColorValidator, PositionValidator, DigitValidator } from './Sudoku';

/** (Obsolete) */
const GameValuesValidator = z.array(z.array(z.string()));

/** (Obsolete) */
const CornermarksValidator = z.array(z.array(z.string()));

/** (Obsolete) */
const CentermarksValidator = z.array(z.array(z.string()));

/** (Obsolete) */
const NotesValidator = z.array(z.array(z.string()));

/** (Obsolete) */
const GameColorsValidator = z.array(z.array(z.array(ColorValidator)));

/** (Obsolete) */
const PenToolTypeValidator = z.enum(['cross', 'circle', 'line']);
const PenToolValidator = z.object({
  positions: z.array(PositionValidator),
  type: PenToolTypeValidator,
  color: ColorValidator.nullish()
});
const PenToolsValidator = z.array(PenToolValidator);

/** (Obsolete) A single step on the way to a solution */
const SolutionStepValidator = z.object({
  /** Values on the solution step */
  values: GameValuesValidator,
  /** Cornermarks on the solution step */
  cornermarks: CornermarksValidator,
  /** Centermarks on the solution step */
  centermarks: CentermarksValidator,
  /** Notes on the solution step */
  notes: NotesValidator,
  /** A list of colors on each cell */
  colors: GameColorsValidator,
  pentool: PenToolsValidator.nullish()
});

export const AnnotationTypeValidator = z.enum(['Note', 'Penline', 'Pencross', 'Pencircle']);
export type AnnotationType = z.infer<typeof AnnotationTypeValidator>;

export const AnnotationValidator = z.object({
  positions: z.array(PositionValidator),
  type: AnnotationTypeValidator,
  details: z.string().nullish(),
  color: ColorValidator.nullish()
});
export type Annotation = z.infer<typeof AnnotationValidator>;

export const CellDataValidator = z.object({
  digits: z.array(DigitValidator).optional(),
  centermarks: z.array(DigitValidator).optional(),
  cornermarks: z.array(DigitValidator).optional(),
  colors: z.array(ColorValidator).optional(),
  value: z.number().optional()
});
export type CellData = z.infer<typeof CellDataValidator>;

export const CellValuesValidator = z.array(z.array(CellDataValidator));
export type CellValues = z.infer<typeof CellValuesValidator>;

export const AnnotationsValidator = z.array(AnnotationValidator);
export type Annotations = z.infer<typeof AnnotationsValidator>;

export const GameDataValidator = z.object({
  cellValues: CellValuesValidator,
  notes: AnnotationsValidator,
  pentool: AnnotationsValidator
});
export type GameData = z.infer<typeof GameDataValidator>;

/** A single step on the way to a solution */
export const WalkthroughStepValidator = z.object({
  /** A description of the logic used etc. */
  description: z.string(),
  /** (Obsolete) The actual important step */
  step: SolutionStepValidator.optional(),
  /** The game state at this step*/
  gameData: GameDataValidator.default({
    cellValues: Array(9).fill(Array(9).fill({})),
    notes: [],
    pentool: []
  })
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
