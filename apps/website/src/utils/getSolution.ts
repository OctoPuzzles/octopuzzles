import deepCopy from './deepCopy';

export function getUserSolution({
  givens,
  values
}: {
  givens: string[][];
  values: string[][];
}): string[][] {
  const userSolution = deepCopy(values);
  givens.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell.length > 0) {
        userSolution[rowIndex][columnIndex] = cell;
      }
    });
  });

  return userSolution;
}
