import type { CellValues, Digit, Givens, Logic } from '@octopuzzles/models';
import { deepCopy } from '@octopuzzles/utils';
import { digitValue } from './general';

export function getUserSolution(userInput: CellValues, givens: Givens, logic?: Logic): CellValues {
  const userSolution = deepCopy(userInput);
  const sCells = logic?.flags?.includes('SCells') ?? false;
  const doublers = logic?.flags?.includes('Doublers') ?? false;

  userSolution.forEach((row, i) => {
    row.forEach((cell, j) => {
      const given = givens[i]?.[j];
      if (given && given !== '') {
        cell.digits = [given as Digit];
      }
      if (cell.digits != null && !sCells && !doublers) {
        cell.value = digitValue(cell.digits[0]);
      }
    });
  });

  return userSolution;
}
