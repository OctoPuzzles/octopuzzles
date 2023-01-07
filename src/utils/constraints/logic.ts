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
    for (let i = dimensions.margins?.top ?? 0; i < dimensions.rows - (dimensions.margins?.bottom ?? 0); ++i) {
      for (let j = dimensions.margins?.left ?? 0; j < dimensions.columns - (dimensions.margins?.right ?? 0); ++j) {
        const v = solution[i][j];
        if (v !== '') {
          const a = parseInt(v);
          const nbrCells = [];
          for (const step of [
            { x: 1, y: 0 },
            { x: 0, y: 1 }
          ]) {
            const row = i + step.x;
            const column = j + step.y;
            if (row < dimensions.rows - (dimensions.margins?.bottom ?? 0) && column < dimensions.columns - (dimensions.margins?.right ?? 0)) {
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
      };
    };
  }
  if (flags.indexOf('Entropy') !== -1) {
    for (let i = dimensions.margins?.top ?? 0; i < dimensions.rows - (dimensions.margins?.bottom ?? 0) - 1; ++i) {
      for (let j = dimensions.margins?.left ?? 0; j < dimensions.columns - (dimensions.margins?.right ?? 0) - 1; ++j) {
        const v = solution[i][j];
        if (v !== '') {
          const a = parseInt(v);
          const nbrCells = [];
          for (const step of [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
          ]) {
            const row = i + step.x;
            const column = j + step.y;
            if (solution[row][column] !== '') {
              nbrCells.push({ row, column });
            }
            else {
              break;
            }
          }
          if (nbrCells.length === 3) {
            const b = parseInt(solution[nbrCells[0].row][nbrCells[0].column]);
            const c = parseInt(solution[nbrCells[1].row][nbrCells[1].column]);
            const d = parseInt(solution[nbrCells[2].row][nbrCells[2].column]);

            let invalid = false;
            if (Math.ceil(a / 3) === Math.ceil(b / 3)) {
              invalid = Math.ceil(a / 3) === Math.ceil(c / 3) || Math.ceil(a / 3) === Math.ceil(d / 3) || Math.ceil(c / 3) === Math.ceil(d / 3);
            }
            else if (Math.ceil(a / 3) === Math.ceil(c / 3)) {
              invalid = Math.ceil(a / 3) === Math.ceil(d / 3) || Math.ceil(b / 3) === Math.ceil(d / 3);
            }
            else if (Math.ceil(a / 3) === Math.ceil(d / 3)) {
              invalid = Math.ceil(b / 3) === Math.ceil(c / 3);
            }
            else if (Math.ceil(b / 3) === Math.ceil(c / 3)) {
              invalid = Math.ceil(b / 3) === Math.ceil(d / 3);
            }

            if (invalid) {
              invalidCells.push(
                ...nbrCells.filter((c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column))
              );
            }
          }
        }
      }
    }
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
