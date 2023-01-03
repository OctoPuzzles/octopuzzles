import type { Position } from '$models/Sudoku';

export function comparePositions(a: Position, b: Position): number {
  if (a.row < b.row) {
    return -1;
  } else if (a.row == b.row && a.column < b.column) {
    return -1;
  } else if (a.row === b.row && a.column === b.column) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Finds the top left of positions in a list.
 * Prioritises tops.
 * If leftmost has lower index than topmost, uses left most, otherwise topmost
 */
export function topLeftOfPositions(positions: Position[]): Position {
  let topLeft = positions[0];
  for (const position of positions) {
    if (comparePositions(position, topLeft) === -1) {
      topLeft = position;
    }
  }
  return topLeft;
}
