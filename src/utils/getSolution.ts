import type { CellValues, Givens } from '$models/Sudoku';
import deepCopy from './deepCopy';

export function getUserSolution(userInput: CellValues, givens: Givens): CellValues {
	const userSolution = deepCopy(userInput);
	givens.forEach((row, i) => {
		row.forEach((v, j) => {
			if (v.length > 0) {
				userSolution[i][j].digits = [v];
			}
		});
	});

	return userSolution;
}
