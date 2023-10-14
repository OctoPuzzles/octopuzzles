import type {
  CellValues,
  Digit,
  Dimensions,
  EditorHistoryStep,
  Logic,
  Position
} from '@octopuzzles/models';
import { getValuesFromRange } from '@octopuzzles/utils';
import { digitValue, isConsecutive, isEqualPosition, isInRatio } from './general';
import uniqWith from 'lodash/uniqWith';

export function defaultDigits(logic: Logic, dimensions: Dimensions): string {
  const rows = dimensions.rows - (dimensions.margins?.top ?? 0) - (dimensions.margins?.bottom ?? 0);
  const sCells = logic.flags?.includes('SCells') ?? false;
  if (rows < 10) {
    return (sCells ? '0' : '1') + '-' + rows;
  } else if (rows === 10 && !sCells) {
    return '0-9';
  } else {
    const numDigits = rows + (sCells ? 1 : 0);
    if (numDigits <= 26) {
      return 'A-' + String.fromCharCode('A'.charCodeAt(0) + numDigits - 1);
    } else {
      return '0-9;A-' + String.fromCharCode('A'.charCodeAt(0) + numDigits - 11);
    }
  }
}

export function getValidDigits(logic: Logic, dimensions: Dimensions): Digit[] {
  return getValuesFromRange(logic.digits ?? defaultDigits(logic, dimensions)) as Digit[];
}

/*Checks the inputted digits against the standard global constraint logic
and returns any cells that have errors*/
export function verifyLogic(
  logic: Logic,
  solution: CellValues,
  clues: EditorHistoryStep
): Position[] {
  if (logic.flags == null) return [];

  let invalidCells: Position[] = [];

  const firstRow = clues.dimensions.margins?.top ?? 0;
  const lastRow = clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) - 1;
  const firstCol = clues.dimensions.margins?.left ?? 0;
  const lastCol = clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0) - 1;

  const nonConsecutive = logic.flags.includes('Nonconsecutive');
  const negativeBlack = logic.flags.includes('NegativeBlack');
  const negativeWhite = logic.flags.includes('NegativeWhite');
  const negativeX = logic.flags.includes('NegativeX');
  const negativeV = logic.flags.includes('NegativeV');

  if (nonConsecutive || negativeBlack || negativeWhite || negativeX || negativeV) {
    for (let i = firstRow; i <= lastRow; ++i) {
      for (let j = firstCol; j <= lastCol; ++j) {
        const cell = solution[i][j];
        const digits = cell.digits;

        if (digits == null) continue;

        const nbrs = [];
        for (const x of [0, 1]) {
          for (const y of [0, 1]) {
            if (x + y !== 1) continue;

            const row = i + x;
            const column = j + y;
            if (row <= lastRow && column <= lastCol) {
              if (solution[row][column].digits?.[0] != null) {
                nbrs.push({ row, column });
              }
            }
          }
        }

        if (nonConsecutive) {
          const invalidNbrs = nbrs.filter((nbr) => {
            const nbrCell = solution[nbr.row][nbr.column];
            const nbrDigits = nbrCell.digits;

            if (nbrDigits == null) return false;

            return digits.some((digit) =>
              nbrDigits.some((nbrDigit) => isConsecutive(digit, nbrDigit))
            );
          });
          if (invalidNbrs.length > 0) {
            invalidCells.push(...[{ row: i, column: j }, ...invalidNbrs]);
          }
        }

        if (negativeBlack) {
          const invalidNbrs = nbrs.filter((nbrPosition) => {
            const nbrCell = solution[nbrPosition.row][nbrPosition.column];
            const nbrDigits = nbrCell.digits;

            if (nbrDigits == null) return false;

            const inRatio = digits.some((digit) =>
              nbrDigits.some((nbrDigit) => isInRatio(digit, nbrDigit, 2))
            );

            return (
              inRatio === true &&
              !clues.borderclues.some(
                (clue) =>
                  clue.type === 'KropkiBlack' &&
                  clue.positions.every(
                    (p) => (p.row === i && p.column === j) || isEqualPosition(p, nbrPosition)
                  )
              )
            );
          });

          if (invalidNbrs.length > 0) {
            invalidCells.push(...[{ row: i, column: j }, ...invalidNbrs]);
          }
        }

        if (negativeWhite) {
          const invalidNbrs = nbrs.filter((nbr) => {
            const nbrCell = solution[nbr.row][nbr.column];
            const nbrDigits = nbrCell.digits;

            if (nbrDigits == null) return false;

            const consecutive = digits.some((digit) =>
              nbrDigits.some((nbrDigit) => isConsecutive(digit, nbrDigit))
            );

            return (
              consecutive === true &&
              !clues.borderclues.some(
                (clue) =>
                  clue.type === 'KropkiWhite' &&
                  clue.positions.every(
                    (p) => (p.row === i && p.column === j) || isEqualPosition(p, nbr)
                  )
              )
            );
          });

          if (invalidNbrs.length > 0) {
            invalidCells.push(...[{ row: i, column: j }, ...invalidNbrs]);
          }
        }

        if (cell.value == null) continue;

        if (negativeX) {
          const invalidNbrs = nbrs.filter((nbr) => {
            const nbrCell = solution[nbr.row][nbr.column];
            const nbrValue = nbrCell.value;

            if (nbrValue == null) return false;

            return (
              (cell.value ?? NaN) + nbrValue === 10 &&
              !clues.borderclues.some(
                (clue) =>
                  clue.type === 'XvX' &&
                  clue.positions.every(
                    (p) => (p.row === i && p.column === j) || isEqualPosition(p, nbr)
                  )
              )
            );
          });

          if (invalidNbrs.length > 0) {
            invalidCells.push(...[{ row: i, column: j }, ...invalidNbrs]);
          }
        }

        if (negativeV) {
          const invalidNbrs = nbrs.filter((nbr) => {
            const nbrCell = solution[nbr.row][nbr.column];
            const nbrValue = nbrCell.value;
            if (nbrValue == null) return false;

            return (
              (cell.value ?? NaN) + nbrValue === 5 &&
              !clues.borderclues.some(
                (clue) =>
                  clue.type === 'XvV' &&
                  clue.positions.every(
                    (p) => (p.row === i && p.column === j) || isEqualPosition(p, nbr)
                  )
              )
            );
          });
          if (invalidNbrs.length > 0) {
            invalidCells.push(
              ...[{ row: i, column: j }, ...invalidNbrs].filter(
                (c) => !invalidCells.some((d) => isEqualPosition(d, c))
              )
            );
          }
        }
      }
    }
  }

  if (logic.flags.includes('Entropy')) {
    for (let i = firstRow; i <= lastRow; ++i) {
      for (let j = firstCol; j <= lastCol; ++j) {
        const cell = solution[i][j];
        const digits = cell.digits;

        if (digits == null) continue;

        const nbrs = [];
        const allDigits = [...digits];
        for (const x of [0, 1]) {
          for (const y of [0, 1]) {
            if (x + y === 0) continue;

            const row = i + x;
            const column = j + y;
            const nbrCell = solution[row][column];
            const nbrDigits = nbrCell.digits;

            if (nbrDigits == null) break;

            nbrs.push({ row, column });
            allDigits.push(...nbrDigits);
          }
        }

        if (nbrs.length === 3) {
          const entropySets = allDigits.map((d) => Math.ceil(digitValue(d) / 3));

          if (!entropySets.includes(1) || !entropySets.includes(2) || !entropySets.includes(3)) {
            invalidCells.push(...[{ row: i, column: j }, ...nbrs]);
          }
        }
      }
    }
  }

  if (logic.flags.includes('Indexed159')) {
    for (let i = firstRow; i <= lastRow; ++i) {
      for (const d of [1, 5, 9]) {
        let cell = solution[i][firstCol + d - 1];
        if (cell.value == null) continue;

        const j = cell.value - 1;
        cell = solution[i][j];
        if (cell.digits && !cell.digits.includes(String(d) as Digit)) {
          invalidCells.push({ row: i, column: firstCol + d - 1 }, { row: i, column: j });
        }
      }
    }
  }

  if (invalidCells.length > 0) {
    invalidCells = uniqWith(invalidCells, isEqualPosition);
  }

  return invalidCells;
}
