import type { SudokuClues } from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';
import {
	defaultBorderclues,
	defaultCages,
	defaultCellclues,
	defaultCells,
	defaultEditorColors,
	defaultGivens,
	defaultLogic,
	defaultPaths,
	defaultRegions
} from './defaults';

export function fillSudokuWithDefaults(sudoku: SudokuClues): EditorHistoryStep {
	return {
		cells: sudoku.cells ?? defaultCells(sudoku.dimensions),
		regions: sudoku.regions ?? defaultRegions(sudoku.dimensions),
		dimensions: sudoku.dimensions,
		logic: sudoku.logic ?? defaultLogic(),
		givens: sudoku.givens ?? defaultGivens(sudoku.dimensions),
		paths: sudoku.paths ?? defaultPaths(),
		extendedcages: sudoku.extendedcages ?? defaultCages(),
		colors: sudoku.colors ?? defaultEditorColors(sudoku.dimensions),
		borderclues: sudoku.borderclues ?? defaultBorderclues(),
		cellclues: sudoku.cellclues ?? defaultCellclues()
	};
}
