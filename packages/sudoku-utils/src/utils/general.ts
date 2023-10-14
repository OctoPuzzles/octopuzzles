import { type Digit, Digits, type Position } from '@octopuzzles/models';

export function digitValue(d: Digit): number {
  return Digits.indexOf(d);
}

export function isConsecutive(a: Digit, b: Digit): boolean {
  const u = digitValue(a);
  const v = digitValue(b);

  return Math.abs(u - v) === 1;
}

export function isWithin(a: Digit, b: Digit, diff: number): boolean {
  const u = digitValue(a);
  const v = digitValue(b);

  return Math.abs(u - v) < diff;
}

export function isInRatio(a: Digit, b: Digit, ratio: number): boolean {
  const u = digitValue(a);
  const v = digitValue(b);

  return u === ratio * v || v === ratio * u;
}

export function isEqualPosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.column === b.column;
}

export function comparePositions(a: Position, b: Position): number {
  if (a.row < b.row) {
    return -1;
  } else if (a.row === b.row && a.column < b.column) {
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
export function topLeftPosition(positions: Position[]): Position {
  let topLeft = positions[0];
  for (const position of positions) {
    if (comparePositions(position, topLeft) === -1) {
      topLeft = position;
    }
  }
  return topLeft;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('finds top left of positions', () => {
    expect(
      topLeftPosition([
        { row: 0, column: 0 },
        { row: 1, column: 1 },
        { row: 8, column: 6 },
        { row: 4, column: 2 }
      ])
    ).toStrictEqual({ row: 0, column: 0 });
  });
}
