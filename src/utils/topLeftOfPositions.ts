import type { Position } from '$models/Sudoku';

/**
 * Finds the top left of positions in a list.
 * Prioritises tops.
 * If leftmost has lower index than topmost, uses left most, otherwise topmost
 */
export function topLeftOfPositions(positions: Position[]): Position {
	let topLeft = positions[0];
	for (const position of positions) {
		if (position.row < topLeft.row) {
			topLeft = position;
		} else if (position.row == topLeft.row && position.column < topLeft.column) {
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
