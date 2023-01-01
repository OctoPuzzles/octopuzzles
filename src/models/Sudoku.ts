import { z } from 'zod';

export const MarginsValidator = z.object({
	/** The width of the left edge of the frame */
	left: z.number().int().min(0).max(10),
	/** The width of the right edge of the frame */
	right: z.number().int().min(0).max(10),
	/** The width of the top edge of the frame */
	top: z.number().int().min(0).max(10),
	/** The width of the bottom edge of the frame */
	bottom: z.number().int().min(0).max(10)
});

export type Margins = z.infer<typeof MarginsValidator>;

export const DimensionsValidator = z.object({
	/** The number of rows in the sudoku */
	rows: z.number().int().min(1).max(36),
	/** The number of columns in the sudoku */
	columns: z.number().int().min(1).max(36),
	/** The margins of the sudoku (for outside clues) */
	margins: MarginsValidator.nullish()
});

export type Dimensions = z.infer<typeof DimensionsValidator>;

export const ColorValidator = z.enum([
	'Black',
	'White',
	'LightGray',
	'Gray',
	'Orange',
	'Purple',
	'Red',
	'Yellow',
	'Green',
	'Blue'
]);

export type Color = z.infer<typeof ColorValidator>;

export const PositionValidator = z.object({
	row: z.number().int(),
	column: z.number().int()
});

export type Position = z.infer<typeof PositionValidator>;

export const RegionTypeValidator = z.enum(['Normal', 'Extra', 'Clone', 'MagicSquare']);
export type RegionType = z.infer<typeof RegionTypeValidator>;

export const RegionValidator = z.object({
	positions: z.array(PositionValidator),
	type: RegionTypeValidator.nullish(),
	color: ColorValidator.nullish(),
	borders: z.boolean().nullish(),
	uniqueDigits: z.boolean().nullish()
});

export type Region = z.infer<typeof RegionValidator>;

export const LineValidator = z.object({
	/** The starting x of the line */
	x1: z.number().int(),
	/** The starting y of the line */
	y1: z.number().int(),
	/** The ending x of the line */
	x2: z.number().int(),
	/** The ending y of the line */
	y2: z.number().int()
});

export type Line = z.infer<typeof LineValidator>;

export const CageTypeValidator = z.enum(['Killer']);
export type CageType = z.infer<typeof CageTypeValidator>;

export const ExtendedcageValidator = z.object({
	positions: z.array(PositionValidator),
	type: CageTypeValidator.nullish(),
	text: z.string().nullish(),
	color: ColorValidator.nullish(),
	uniqueDigits: z.boolean().nullish()
});
export type Extendedcage = z.infer<typeof ExtendedcageValidator>;

export const PathTypeValidator = z.enum([
	'Arrow',
	'Thermo',
	'Between',
	'Lockout',
	'Renban',
	'Whisper',
	'Palindrome',
	'AntiFactor',
	'EqualSum',
	'ProductSum',
	'Entropic',
	'Odd',
	'Even',
	'Pill'
]);
export type PathType = z.infer<typeof PathTypeValidator>;

export const FormValidator = z.enum(['Square', 'Round', 'Diamond']);
export type Form = z.infer<typeof FormValidator>;
export const forms: Form[] = ['Square', 'Round', 'Diamond'];

export const FillValidator = z.enum(['Solid', 'Hollow']);
export type Fill = z.infer<typeof FillValidator>;

export const PathValidator = z.object({
	positions: z.array(PositionValidator),
	type: PathTypeValidator.nullish(),
	color: ColorValidator.nullish(),
	width: z.number().int().nullish(), // up to 100%
	form: FormValidator.nullish(),
	fill: FillValidator.nullish(),
	arrow: z.boolean().nullish(),
	uniqueDigits: z.boolean().nullish()
});
export type Path = z.infer<typeof PathValidator>;

export const BorderClueTypeValidator = z.enum([
	'KropkiWhite',
	'KropkiBlack',
	'XvX',
	'XvV',
	'Inequality',
	'Quadruple',
	'Border'
]);
export type BorderClueType = z.infer<typeof BorderClueTypeValidator>;

export const ShapeValidator = z.enum(['Circle', 'Square', 'Diamond', 'Star', 'Line']);
export type Shape = z.infer<typeof ShapeValidator>;
export const shapes: Shape[] = ['Circle', 'Square', 'Diamond', 'Star', 'Line'];

export const BorderclueValidator = z.object({
	positions: z.array(PositionValidator).length(2),
	type: BorderClueTypeValidator.nullish(),
	shape: ShapeValidator.nullish(),
	color: ColorValidator.nullish(),
	radius: z.number().int().nullish(), // up to 100%
	text: z.string().nullish()
});
export type Borderclue = z.infer<typeof BorderclueValidator>;

export const CellClueTypeValidator = z.enum([
	'Maximum',
	'Minimum',
	'LittleKillerNE',
	'LittleKillerSE',
	'LittleKillerSW',
	'LittleKillerNW',
	'Sandwich',
	'Skyscraper',
	'XSum',
	'NumberedRoom'
]);
export type CellClueType = z.infer<typeof CellClueTypeValidator>;

export const CellClueLocationValidator = z.enum([
	'TopLeft',
	'Top',
	'TopRight',
	'Left',
	'Center',
	'Right',
	'BottomLeft',
	'Bottom',
	'BottomRight'
]);
export type CellClueLocation = z.infer<typeof CellClueLocationValidator>;

export const CellClueSizeValidator = z.enum(['Large', 'Medium', 'Small', 'XSmall']);
export type CellClueSize = z.infer<typeof CellClueSizeValidator>;

export const SymbolTypeValidator = z.enum([
	'Arrowhead',
	'InvertedArrowhead',
	'Arrow',
	'SmallArrow',
	'Diagonal'
]);
export type SymbolType = z.infer<typeof SymbolTypeValidator>;

export const RotationValidator = z.enum([
	'North',
	'NorthEast',
	'East',
	'SouthEast',
	'South',
	'SouthWest',
	'West',
	'NorthWest'
]);
export type Rotation = z.infer<typeof RotationValidator>;

export const CellclueValidator = z.object({
	position: PositionValidator,
	type: CellClueTypeValidator.nullish(),
	location: CellClueLocationValidator.nullish(),
	text: z.string().nullish(),
	size: CellClueSizeValidator.nullish(),
	symbol: SymbolTypeValidator.nullish(),
	rotation: RotationValidator.nullish(),
	color: ColorValidator.nullish()
});
export type Cellclue = z.infer<typeof CellclueValidator>;

export const LogicFlagValidator = z.enum([
	'NonStandard',
	'DiagonalPos',
	'DiagonalNeg',
	'Antiknight',
	'Antiking',
	'Nonconsecutive',
	'DisjointSets',
	'SCells',
	'Entropy',
	'Indexed159',
	'NegativeX',
	'NegativeV',
	'NegativeBlack',
	'NegativeWhite'
]);
export type LogicFlag = z.infer<typeof LogicFlagValidator>;

export const LogicValidator = z.object({
	/** the valid digits expected in the puzzle, as a comma separated list of ranges (num or alpha). If None, defaults to 1-9 */
	digits: z.string().nullish(),
	flags: z.array(LogicFlagValidator).nullish()
});
export type Logic = z.infer<typeof LogicValidator>;

export const CellsValidator = z.array(z.array(z.boolean()));
export type Cells = z.infer<typeof CellsValidator>;

export const GivensValidator = z.array(z.array(z.string()));
export type Givens = z.infer<typeof GivensValidator>;

export const EditorColorsValidator = z.array(z.array(ColorValidator.nullable()));
export type EditorColors = z.infer<typeof EditorColorsValidator>;

export const RegionsValidator = z.array(RegionValidator);
export type Regions = z.infer<typeof RegionsValidator>;

export const ExtendedcagesValidator = z.array(ExtendedcageValidator);
export type Extendedcages = z.infer<typeof ExtendedcagesValidator>;

export const PathsValidator = z.array(PathValidator);
export type Paths = z.infer<typeof PathsValidator>;

export const BordercluesValidator = z.array(BorderclueValidator);
export type Borderclues = z.infer<typeof BordercluesValidator>;

export const CellcluesValidator = z.array(CellclueValidator);
export type Cellclues = z.infer<typeof CellcluesValidator>;

export const SolutionValidator = z.object({ numbers: z.array(z.array(z.string().max(3))) });
export type Solution = z.infer<typeof SolutionValidator>;

export const SudokuCluesValidator = z.object({
	/** The dimensions of the sudoku, i.e. the number of rows and columns */
	dimensions: DimensionsValidator,
	/** The cells that are interactable in the sudoku. */
	cells: CellsValidator.nullable(),
	/** The givens in the sudoku.  */
	givens: GivensValidator.nullable(),
	/** The colors in the cells of the sudoku. */
	colors: EditorColorsValidator.nullable(),
	/** The regions of the sudoku. */
	regions: RegionsValidator.nullable(),
	/** The dotted boxes (killer cages) in the grid, with optional rendering settings */
	extendedcages: ExtendedcagesValidator.nullable(),
	/** The paths in the sudoku, i.e. thermometers, etc. */
	paths: PathsValidator.nullable(),
	/** The borderclues of the sudoku. That is, a clue lying on a border. If null, there are no border clues */
	borderclues: BordercluesValidator.nullable(),
	/** The cellclues of the sudoku. That is, a clue contained within a cell. If null, there are no cell clues */
	cellclues: CellcluesValidator.nullable(),
	/** The global sudoku logic in the grid. */
	logic: LogicValidator.nullable()
});
export type SudokuClues = z.infer<typeof SudokuCluesValidator>;

export const SudokuValidator = SudokuCluesValidator.extend({
	id: z.number().int(),
	/** The id of the user who created the sudoku */
	userId: z.number().int().nullable(),
	/** When this sudoku became public */
	publicSince: z.date().nullable(),
	/** The title of the sudoku */
	title: z.string().max(64).min(1),
	/** The description of the sudoku, e.g. rules, etc. */
	description: z.string().max(4096).min(1),
	/** The upvotes minus the downvotes */
	points: z.number().int(),
	/** The calculated points the sudoku has gotten from upvotes/downvotes using the ranking algorithm */
	rank: z.number(),
	/** The solution to the puzzle if any is given */
	solution: SolutionValidator.nullable(),
	/** The time when the user was created */
	createdAt: z.date(),
	/** The last time the user was updated */
	updatedAt: z.date()
});
export type Sudoku = z.infer<typeof SudokuValidator>;

export const NewSudokuValidator = SudokuCluesValidator.extend({
	/** The title of the sudoku */
	title: z.string().max(64).min(1),
	/** The description of the sudoku, e.g. rules, etc. */
	description: z.string().max(4096).min(1)
});
export const UpdateSudokuValidator = NewSudokuValidator.partial();
