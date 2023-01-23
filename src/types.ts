import type { SudokuClues, GameData } from '$models/Sudoku';

export type Mode = 'editor' | 'game';

type NonNullableFields<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type EditorHistoryStep = NonNullableFields<SudokuClues>;

export type GameHistoryStep = GameData;

export type InputMode =
	| keyof EditorHistoryStep
	| 'digits'
	| 'cornermarks'
	| 'centermarks'
	| 'colors'
	| 'notes';

/**
 * Either some type or a number to indicate the index where the previous clue lies
 */
type WithNumbers<Type> = {
	[Property in keyof Type]: Type[Property] | number;
};

export type EditorHistoryStepWithNumbers = WithNumbers<EditorHistoryStep>;
export type GameHistoryStepWithNumbers = WithNumbers<GameHistoryStep>;
