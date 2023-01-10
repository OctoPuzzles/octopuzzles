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

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('finds top left of positions', () => {
		expect(
			topLeftOfPositions([
				{ row: 0, column: 0 },
				{ row: 1, column: 1 },
				{ row: 8, column: 6 },
				{ row: 4, column: 2 }
			])
		).toStrictEqual({ row: 0, column: 0 });
	});
}
