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
