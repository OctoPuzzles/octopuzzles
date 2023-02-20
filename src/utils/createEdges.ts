import { cellSize } from '$constants';
import type { Dimensions, Position } from '$models/Sudoku';
import deepCopy from './deepCopy';

type Point = {
	x: number;
	y: number;
};

type Direction = 'up' | 'left' | 'right' | 'down';
type InterCardinal = 'nw' | 'ne' | 'sw' | 'se';

type OutlinePoint = {
	/** The point to use for calculating the outline */
	forAlgorithm: Point;
	/** The point to use when drawing the outline */
	forGraphics: Point;
	interCardinal: InterCardinal;
};

function findOutlinePoints(
	positions: Position[],
	dimensions: Dimensions,
	offset = 0
): OutlinePoint[] {
	const matrixOfPoints: (number | undefined)[][] = deepCopy(Array(dimensions.rows).fill([]));

	positions.forEach(({ row, column }) => {
		matrixOfPoints[row][column] = 1;
	});

	const points: OutlinePoint[] = [];

	for (let rowIndex = 0; rowIndex < dimensions.rows; rowIndex++) {
		const row = matrixOfPoints[rowIndex];
		if (row.length === 0) {
			continue;
		}
		for (let columnIndex = 0; columnIndex < dimensions.columns; columnIndex++) {
			const cell = row[columnIndex];
			if (!cell) {
				continue;
			}

			// Find the values of cells around the center cell
			const nw = matrixOfPoints[rowIndex - 1]?.[columnIndex - 1];
			const n = matrixOfPoints[rowIndex - 1]?.[columnIndex];
			const ne = matrixOfPoints[rowIndex - 1]?.[columnIndex + 1];
			const w = matrixOfPoints[rowIndex]?.[columnIndex - 1];
			const e = matrixOfPoints[rowIndex]?.[columnIndex + 1];
			const sw = matrixOfPoints[rowIndex + 1]?.[columnIndex - 1];
			const s = matrixOfPoints[rowIndex + 1]?.[columnIndex];
			const se = matrixOfPoints[rowIndex + 1]?.[columnIndex + 1];

			// Add the points
			// Top left point
			if ((n == null && w == null) || (n != null && nw == null && w != null)) {
				points.push({
					forAlgorithm: { x: columnIndex, y: rowIndex },
					forGraphics: { x: columnIndex * cellSize + offset, y: rowIndex * cellSize + offset },
					interCardinal: 'nw'
				});
			}
			// Top right point
			if ((n == null && e == null) || (n != null && ne == null && e != null)) {
				points.push({
					forAlgorithm: { x: columnIndex + 1, y: rowIndex },
					forGraphics: {
						x: (columnIndex + 1) * cellSize - offset,
						y: rowIndex * cellSize + offset
					},
					interCardinal: 'ne'
				});
			}
			// Bottom left
			if ((w == null && s == null) || (w != null && sw == null && s != null)) {
				points.push({
					forAlgorithm: { x: columnIndex, y: rowIndex + 1 },
					forGraphics: {
						x: columnIndex * cellSize + offset,
						y: (rowIndex + 1) * cellSize - offset
					},
					interCardinal: 'sw'
				});
			}
			// Bottom right
			if ((e == null && s == null) || (e != null && se == null && s != null)) {
				points.push({
					forAlgorithm: { x: columnIndex + 1, y: rowIndex + 1 },
					forGraphics: {
						x: (columnIndex + 1) * cellSize - offset,
						y: (rowIndex + 1) * cellSize - offset
					},
					interCardinal: 'se'
				});
			}
		}
	}

	return points;
}

function findTopLeftOutlinePoint(
	outlinePoints: OutlinePoint[]
): [OutlinePoint | undefined, number] {
	let topLeftPoint: OutlinePoint | undefined = undefined;
	let index = -1;
	outlinePoints.forEach((p, i) => {
		if (topLeftPoint == null) {
			topLeftPoint = p;
			index = i;
			return;
		}
		if (
			p.forAlgorithm.x < topLeftPoint.forAlgorithm.x ||
			(p.forAlgorithm.x <= topLeftPoint.forAlgorithm.x &&
				p.forAlgorithm.y < topLeftPoint.forAlgorithm.y)
		) {
			index = i;
			topLeftPoint = p;
		}
	});
	return [topLeftPoint, index];
}

/** E.g. going, "up", coming to "nw", then go "right" */
const NextDirection: Record<Direction, Record<InterCardinal, Direction>> = {
	up: {
		nw: 'right',
		ne: 'left',
		sw: 'left',
		se: 'right'
	},
	down: {
		nw: 'left',
		ne: 'right',
		sw: 'right',
		se: 'left'
	},
	right: {
		nw: 'up',
		ne: 'down',
		sw: 'down',
		se: 'up'
	},
	left: {
		nw: 'down',
		ne: 'up',
		sw: 'up',
		se: 'down'
	}
};

function findNextPoint(
	previousPointInPath: OutlinePoint,
	points: OutlinePoint[],
	direction: Direction
): [OutlinePoint, number] | undefined {
	// e.g. if coming from nw going right, we should find a point that has the same y coordinates, and has an interCardinal of ne or se
	let nextPointIndex: number | undefined;
	let nextPoint: OutlinePoint | undefined;
	switch (direction) {
		case 'right':
			points.forEach((p, i) => {
				if (
					p.forAlgorithm.y === previousPointInPath.forAlgorithm.y &&
					p.forAlgorithm.x > previousPointInPath.forAlgorithm.x &&
					p.interCardinal[0] === previousPointInPath.interCardinal[0]
				) {
					if (nextPoint == null) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					} else if (p.forAlgorithm.x < nextPoint.forAlgorithm.x) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					}
				}
			});
			break;
		case 'left':
			points.forEach((p, i) => {
				if (
					p.forAlgorithm.y === previousPointInPath.forAlgorithm.y &&
					p.forAlgorithm.x < previousPointInPath.forAlgorithm.x &&
					p.interCardinal[0] === previousPointInPath.interCardinal[0]
				) {
					if (nextPoint == null) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					} else if (p.forAlgorithm.x > nextPoint.forAlgorithm.x) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					}
				}
			});
			break;
		case 'up':
			points.forEach((p, i) => {
				if (
					p.forAlgorithm.x === previousPointInPath.forAlgorithm.x &&
					p.forAlgorithm.y < previousPointInPath.forAlgorithm.y &&
					p.interCardinal[1] === previousPointInPath.interCardinal[1]
				) {
					if (nextPoint == null) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					} else if (p.forAlgorithm.y > nextPoint.forAlgorithm.y) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					}
				}
			});
			break;
		case 'down':
			points.forEach((p, i) => {
				if (
					p.forAlgorithm.x === previousPointInPath.forAlgorithm.x &&
					p.forAlgorithm.y > previousPointInPath.forAlgorithm.y &&
					p.interCardinal[1] === previousPointInPath.interCardinal[1]
				) {
					if (nextPoint == null) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					} else if (p.forAlgorithm.y < nextPoint.forAlgorithm.y) {
						nextPoint = p;
						nextPointIndex = i;
						return;
					}
				}
			});
			break;
	}
	if (nextPoint == null || nextPointIndex == null) return undefined;
	return [nextPoint, nextPointIndex];
}

/** Find the oultine of cells in a grid. Offset is absolute number out of 32 */
export function createOutlines(
	positions: Position[],
	dimensions: Dimensions,
	offset = 0
): string[] {
	const points = findOutlinePoints(positions, dimensions, offset);
	const paths: OutlinePoint[][] = [];

	while (points.length > 0) {
		const pathPoints: OutlinePoint[] = [];
		const [topLeftPoint, index] = findTopLeftOutlinePoint(points);
		if (topLeftPoint == null) return [];
		// Remove the top left point
		points.splice(index, 1);
		pathPoints.push(topLeftPoint);

		let direction: Direction = 'up';

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const previousPointInPath = pathPoints[pathPoints.length - 1];

			direction = NextDirection[direction][previousPointInPath.interCardinal];

			const nextPointInfo = findNextPoint(previousPointInPath, points, direction);
			if (nextPointInfo == null) {
				// We have reached the end
				pathPoints.push(topLeftPoint); // Add the first point to the end to make a loop
				paths.push(pathPoints);
				break;
			}
			const [nextPoint, nextPointIndex] = nextPointInfo;
			points.splice(nextPointIndex, 1);
			pathPoints.push(nextPoint);
		}
	}

	const stringPaths: string[] = [];
	paths.forEach((path) => {
		stringPaths.push(
			path
				.map((point) => ` ${point.forGraphics.x},${point.forGraphics.y}`)
				.join(' ')
				.trim()
		);
	});

	return stringPaths;
}

if (import.meta.vitest) {
	const { it, expect, describe } = import.meta.vitest;
	describe('Create outline', () => {
		it('Creates the correct outline', () => {
			expect(
				createOutlines(
					[
						{ row: 0, column: 0 },
						{ row: 0, column: 1 },
						{ row: 0, column: 2 },
						{ row: 1, column: 0 },
						{ row: 1, column: 2 },
						{ row: 3, column: 0 },
						{ row: 3, column: 1 },
						{ row: 3, column: 2 },
						{ row: 4, column: 1 },
						{ row: 4, column: 3 },
						{ row: 5, column: 1 },
						{ row: 5, column: 2 },
						{ row: 5, column: 3 }
					],
					{ rows: 9, columns: 9 }
				)
			).toEqual([
				'0,0  192,0  192,128  128,128  128,64  64,64  64,128  0,128  0,0',
				'0,192  192,192  192,256  128,256  128,320  192,320  192,256  256,256  256,384  64,384  64,256  0,256  0,192'
			]);
		});
	});
}
