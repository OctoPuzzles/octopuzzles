import { digitValue } from '$constants';
import type { CellValues, Givens, Logic } from '$models/Sudoku';
import deepCopy from './deepCopy';

export function getUserSolution(userInput: CellValues, givens: Givens, logic?: Logic): CellValues {
	const userSolution = deepCopy(userInput);
	const sCells = logic?.flags?.includes('SCells') ?? false;
	const sCellType = logic?.sCellType ?? 'Sum';
	const doublers = logic?.flags?.includes('Doublers') ?? false;

	userSolution.forEach((row, i) => {
		row.forEach((cell, j) => {
			const v = givens[i]?.[j];
			if (v && v !== '') {
				cell.digits = [v];
			}
			if (cell.digits) {
				if (sCells && cell.modifiers?.includes('SCell')) {
					if (cell.digits.length == 2 && sCellType !== 'NonStandard') {
						cell.value = digitValue[cell.digits[0]] + digitValue[cell.digits[1]];
						if (sCellType === 'Average') {
							cell.value /= 2;
						}
					}
				} else {
					cell.value = digitValue[cell.digits[0]];
				}
				if (cell.value && doublers && cell.modifiers?.includes('Doubler')) {
					cell.value *= 2;
				}
			}
		});
	});

	return userSolution;
}
