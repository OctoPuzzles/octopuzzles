import type {
  CellValues,
  Digit,
  Dimensions,
  EditorHistoryStep,
  Logic,
  Position
} from '@octopuzzles/models';
import { Digits } from '@octopuzzles/models';
import { getValuesFromRange } from '@octopuzzles/utils';

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
  return getValuesFromRange(logic.digits ?? defaultDigits(logic, dimensions)).map(
    (d) => d as Digit
  );
}

export function verifyLogic(
  logic: Logic,
  solution: CellValues,
  clues: EditorHistoryStep
): Position[] {
  const invalidCells: Position[] = [];

  if (logic.flags) {
    const nonConsecutive = logic.flags.includes('Nonconsecutive');
    const negativeBlack = logic.flags.includes('NegativeBlack');
    const negativeWhite = logic.flags.includes('NegativeWhite');
    const negativeX = logic.flags.includes('NegativeX');
    const negativeV = logic.flags.includes('NegativeV');
    if (nonConsecutive || negativeBlack || negativeWhite || negativeX || negativeV) {
      for (
        let i = clues.dimensions.margins?.top ?? 0;
        i < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0);
        ++i
      ) {
        for (
          let j = clues.dimensions.margins?.left ?? 0;
          j < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0);
          ++j
        ) {
          const cell = solution[i][j];
          if (cell.digits != null) {
            const nbrCells = [];
            for (const step of [
              { x: 1, y: 0 },
              { x: 0, y: 1 }
            ]) {
              const row = i + step.x;
              const column = j + step.y;
              if (
                row < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) &&
                column < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0)
              ) {
                if (solution[row][column].digits?.[0]) {
                  nbrCells.push({ row, column });
                }
              }
            }

            if (nonConsecutive) {
              const invalidNbrs = nbrCells.filter((c) => {
                const nbrCell = solution[c.row][c.column];
                if (nbrCell.digits != null) {
                  return cell.digits?.some((d) =>
                    nbrCell.digits?.some(
                      (e) => Math.abs(Digits.indexOf(d) - Digits.indexOf(e)) === 1
                    )
                  );
                } else {
                  return false;
                }
              });
              if (invalidNbrs.length > 0) {
                invalidCells.push(
                  ...[{ row: i, column: j }, ...invalidNbrs].filter(
                    (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                  )
                );
              }
            }
            if (negativeBlack) {
              const invalidNbrs = nbrCells.filter((c) => {
                const nbrCell = solution[c.row][c.column];
                if (nbrCell.digits != null) {
                  const inRatio = cell.digits?.some((d) =>
                    nbrCell.digits?.some(
                      (e) =>
                        Digits.indexOf(d) === 2 * Digits.indexOf(e) ||
                        Digits.indexOf(e) === 2 * Digits.indexOf(d)
                    )
                  );
                  return (
                    inRatio === true &&
                    !clues.borderclues.some(
                      (b) =>
                        b.type === 'KropkiBlack' &&
                        b.positions.every(
                          (p) =>
                            (p.row === i && p.column === j) ||
                            (p.row === c.row && p.column === c.column)
                        )
                    )
                  );
                } else {
                  return false;
                }
              });
              if (invalidNbrs.length > 0) {
                invalidCells.push(
                  ...[{ row: i, column: j }, ...invalidNbrs].filter(
                    (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                  )
                );
              }
            }
            if (negativeWhite) {
              const invalidNbrs = nbrCells.filter((c) => {
                const nbrCell = solution[c.row][c.column];
                if (nbrCell.digits != null) {
                  const consecutive = cell.digits?.some((d) =>
                    nbrCell.digits?.some(
                      (e) => Math.abs(Digits.indexOf(d) - Digits.indexOf(e)) === 1
                    )
                  );
                  return (
                    consecutive === true &&
                    !clues.borderclues.some(
                      (b) =>
                        b.type === 'KropkiWhite' &&
                        b.positions.every(
                          (p) =>
                            (p.row === i && p.column === j) ||
                            (p.row === c.row && p.column === c.column)
                        )
                    )
                  );
                } else {
                  return false;
                }
              });
              if (invalidNbrs.length > 0) {
                invalidCells.push(
                  ...[{ row: i, column: j }, ...invalidNbrs].filter(
                    (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                  )
                );
              }
            }
            if (cell.value != null) {
              if (negativeX) {
                const invalidNbrs = nbrCells.filter((c) => {
                  const nbrCell = solution[c.row][c.column];
                  if (nbrCell.value != null) {
                    return (
                      (cell.value ?? NaN) + nbrCell.value === 10 &&
                      !clues.borderclues.some(
                        (b) =>
                          b.type === 'XvX' &&
                          b.positions.every(
                            (p) =>
                              (p.row === i && p.column === j) ||
                              (p.row === c.row && p.column === c.column)
                          )
                      )
                    );
                  } else {
                    return false;
                  }
                });
                if (invalidNbrs.length > 0) {
                  invalidCells.push(
                    ...[{ row: i, column: j }, ...invalidNbrs].filter(
                      (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                    )
                  );
                }
              }
              if (negativeV) {
                const invalidNbrs = nbrCells.filter((c) => {
                  const nbrCell = solution[c.row][c.column];
                  if (nbrCell.value != null) {
                    return (
                      (cell.value ?? NaN) + nbrCell.value === 5 &&
                      !clues.borderclues.some(
                        (b) =>
                          b.type === 'XvV' &&
                          b.positions.every(
                            (p) =>
                              (p.row === i && p.column === j) ||
                              (p.row === c.row && p.column === c.column)
                          )
                      )
                    );
                  } else {
                    return false;
                  }
                });
                if (invalidNbrs.length > 0) {
                  invalidCells.push(
                    ...[{ row: i, column: j }, ...invalidNbrs].filter(
                      (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                    )
                  );
                }
              }
            }
          }
        }
      }
    }
    if (logic.flags.includes('Entropy')) {
      for (
        let i = clues.dimensions.margins?.top ?? 0;
        i < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) - 1;
        ++i
      ) {
        for (
          let j = clues.dimensions.margins?.left ?? 0;
          j < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0) - 1;
          ++j
        ) {
          const cell = solution[i][j];
          if (cell.digits != null) {
            const nbrCells = [];
            const digits = [...cell.digits];
            for (const step of [
              { x: 1, y: 0 },
              { x: 0, y: 1 },
              { x: 1, y: 1 }
            ]) {
              const row = i + step.x;
              const column = j + step.y;
              const nbrCell = solution[row][column];
              if (nbrCell.digits != null) {
                nbrCells.push({ row, column });
                digits.push(...nbrCell.digits);
              } else {
                break;
              }
            }
            if (nbrCells.length === 3) {
              const entropySets = digits.map((d) => Math.ceil(Digits.indexOf(d) / 3));

              if (
                !entropySets.includes(1) ||
                !entropySets.includes(2) ||
                !entropySets.includes(3)
              ) {
                invalidCells.push(
                  ...[{ row: i, column: j }, ...nbrCells].filter(
                    (c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                  )
                );
              }
            }
          }
        }
      }
    }
    if (logic.flags.includes('Indexed159')) {
      for (
        let i = clues.dimensions.margins?.top ?? 0;
        i < clues.dimensions.rows + (clues.dimensions.margins?.top ?? 0);
        ++i
      ) {
        for (const d of [1, 5, 9]) {
          let cell = solution[i][(clues.dimensions.margins?.left ?? 0) + d - 1];
          if (cell.value != null) {
            const j = cell.value - 1;
            cell = solution[i][j];
            if (cell.digits && !cell.digits.includes(String(d) as Digit)) {
              invalidCells.push(
                { row: i, column: (clues.dimensions.margins?.left ?? 0) + d - 1 },
                { row: i, column: j }
              );
            }
          }
        }
      }
    }
  }

  return invalidCells;
}
