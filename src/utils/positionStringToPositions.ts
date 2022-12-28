import type { Position } from '$models/Sudoku';
import type { PositionString } from './compressor';

function positionFromPositionString(positionString: PositionString): Position {
	const regex = /r(\d+)c(\d+)/i;

	const match = positionString.match(regex) as RegExpMatchArray;

	return { row: parseInt(match[1]) - 1, column: parseInt(match[2]) - 1 };
}

/**
 * Transforms position strings into Positions
 */
export function positionStringToPosition(positionStrings: PositionString): Position;
export function positionStringToPosition(positionStrings: PositionString[]): Position[];
export function positionStringToPosition(
	positionStrings: PositionString | PositionString[]
): Position | Position[] {
	if (Array.isArray(positionStrings)) {
		return positionStrings.map(positionFromPositionString);
	}

	return positionFromPositionString(positionStrings);
}


if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest
	it('creates the correct position from a position string', () => {
		expect(positionFromPositionString("R5C7")).toStrictEqual({ row: 4, column: 6 });
	})
}
