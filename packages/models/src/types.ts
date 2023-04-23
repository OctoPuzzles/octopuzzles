import type { SudokuClues, GameData, Position } from '.';

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

export type MouseDownHandler = ({
  cell,
  metaButtonClicked
}: {
  cell: Position;
  metaButtonClicked: boolean;
}) => void;
export type MouseEnterHandler = ({
  cell,
  metaButtonClicked,
  mouseDown
}: {
  cell: Position;
  metaButtonClicked: boolean;
  mouseDown: boolean;
}) => void;
