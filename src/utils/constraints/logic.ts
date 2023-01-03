import type { Borderclue, Dimensions, LogicFlag, Position } from '$models/Sudoku';

export function verifyLogic(
  flags: LogicFlag[],
  solution: string[][],
  borderclues: Borderclue[],
  dimensions: Dimensions
): Position[] {
  const invalidCells: Position[] = [];

  const nonConsecutive = flags.indexOf('Nonconsecutive') !== -1;
  const negativeBlack = flags.indexOf('NegativeBlack') !== -1;
  const negativeWhite = flags.indexOf('NegativeWhite') !== -1;
  const negativeX = flags.indexOf('NegativeX') !== -1;
  const negativeV = flags.indexOf('NegativeV') !== -1;
  if (nonConsecutive || negativeBlack || negativeWhite || negativeX || negativeV) {
    solution.forEach((r, i) => {
      r.forEach((v, j) => {
        if (v !== '') {
          const a = parseInt(v);
          const nbrCells = [];
          for (const step of [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
          ]) {
            const row = i + step.x;
            const column = j + step.y;
            if (row >= 0 && row < solution.length && column >= 0 && column < solution[0].length) {
              if (solution[row][column] !== '') {
                nbrCells.push({ row, column });
              }
            }
          }

          if (nonConsecutive) {
            invalidCells.push(
              ...nbrCells.filter((c) => {
                const b = parseInt(solution[c.row][c.column]);
                return (
                  Math.abs(a - b) === 1 &&
                  !invalidCells.some((d) => d.row === c.row && d.column === c.column)
                );
              })
            );
          }
          if (negativeBlack) {
            invalidCells.push(
              ...nbrCells.filter((c) => {
                const b = parseInt(solution[c.row][c.column]);
                return (
                  (a === 2 * b || b === 2 * a) &&
                  !invalidCells.some((d) => d.row === c.row && d.column === c.column) &&
                  !borderclues.some(
                    (b) =>
                      b.type === 'KropkiBlack' &&
                      b.positions.every(
                        (p) =>
                          (p.row === i && p.column === j) ||
                          (p.row === c.row && p.column === c.column)
                      )
                  )
                );
              })
            );
          }
          if (negativeWhite) {
            invalidCells.push(
              ...nbrCells.filter((c) => {
                const b = parseInt(solution[c.row][c.column]);
                return (
                  Math.abs(a - b) === 1 &&
                  !invalidCells.some((d) => d.row === c.row && d.column === c.column) &&
                  !borderclues.some(
                    (b) =>
                      b.type === 'KropkiWhite' &&
                      b.positions.every(
                        (p) =>
                          (p.row === i && p.column === j) ||
                          (p.row === c.row && p.column === c.column)
                      )
                  )
                );
              })
            );
          }
          if (negativeX) {
            invalidCells.push(
              ...nbrCells.filter((c) => {
                const b = parseInt(solution[c.row][c.column]);
                return (
                  a + b === 10 &&
                  !invalidCells.some((d) => d.row === c.row && d.column === c.column) &&
                  !borderclues.some(
                    (b) =>
                      b.type === 'XvX' &&
                      b.positions.every(
                        (p) =>
                          (p.row === i && p.column === j) ||
                          (p.row === c.row && p.column === c.column)
                      )
                  )
                );
              })
            );
          }
          if (negativeV) {
            invalidCells.push(
              ...nbrCells.filter((c) => {
                const b = parseInt(solution[c.row][c.column]);
                return (
                  a + b === 5 &&
                  !invalidCells.some((d) => d.row === c.row && d.column === c.column) &&
                  !borderclues.some(
                    (b) =>
                      b.type === 'XvV' &&
                      b.positions.every(
                        (p) =>
                          (p.row === i && p.column === j) ||
                          (p.row === c.row && p.column === c.column)
                      )
                  )
                );
              })
            );
          }
        }
      });
    });
  }
  if (flags.indexOf('Entropy') !== -1) {
    //TODO
  }
  if (flags.indexOf('Indexed159') !== -1) {
    for (
      let i = dimensions.margins?.top ?? 0;
      i < dimensions.rows + (dimensions.margins?.top ?? 0);
      ++i
    ) {
      for (const d of [1, 5, 9]) {
        let v = solution[i][(dimensions.margins?.left ?? 0) + d - 1];
        if (v !== '') {
          const j = parseInt(v) - 1;
          v = solution[i][j];
          if (v !== '' && parseInt(v) !== d) {
            invalidCells.push(
              { row: i, column: (dimensions.margins?.left ?? 0) + d - 1 },
              { row: i, column: j }
            );
          }
        }
      }
    }
  }

  return invalidCells;
}
