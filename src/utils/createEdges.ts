import type { Dimensions, Position } from '$models/Sudoku';
import deepCopy from './deepCopy';

type Edge = { x1: number; y1: number; x2: number; y2: number };

const createEdge = (
	position: Position,
	direction:
		| 'up'
		| 'down'
		| 'left'
		| 'right'
		| 'uprightup'
		| 'rightupright'
		| 'rightdownright'
		| 'downrightdown'
		| 'downleftdown'
		| 'leftdownleft'
		| 'leftupleft'
		| 'upleftup',
	offset = 0
): Edge => {
	switch (direction) {
		case 'up':
			return {
				x1: position.column + offset,
				y1: position.row + offset,
				x2: position.column + 1 - offset,
				y2: position.row + offset
			};
		case 'down':
			return {
				x1: position.column + offset,
				y1: position.row + 1 - offset,
				x2: position.column + 1 - offset,
				y2: position.row + 1 - offset
			};
		case 'left':
			return {
				x1: position.column + offset,
				y1: position.row + offset,
				x2: position.column + offset,
				y2: position.row + 1 - offset
			};
		case 'right':
			return {
				x1: position.column + 1 - offset,
				y1: position.row + offset,
				x2: position.column + 1 - offset,
				y2: position.row + 1 - offset
			};
		case 'uprightup':
			return {
				x1: position.column + 1 - offset,
				y1: position.row + offset,
				x2: position.column + 1 - offset,
				y2: position.row
			};
		case 'rightupright':
			return {
				x1: position.column + 1 - offset,
				y1: position.row + offset,
				x2: position.column + 1,
				y2: position.row + offset
			};
		case 'rightdownright':
			return {
				x1: position.column + 1 - offset,
				y1: position.row + 1 - offset,
				x2: position.column + 1,
				y2: position.row + 1 - offset
			};
		case 'downrightdown':
			return {
				x1: position.column + 1 - offset,
				y1: position.row + 1 - offset,
				x2: position.column + 1 - offset,
				y2: position.row + 1
			};
		case 'downleftdown':
			return {
				x1: position.column + offset,
				y1: position.row + 1 - offset,
				x2: position.column + offset,
				y2: position.row + 1
			};
		case 'leftdownleft':
			return {
				x1: position.column + offset,
				y1: position.row + 1 - offset,
				x2: position.column,
				y2: position.row + 1 - offset
			};
		case 'leftupleft':
			return {
				x1: position.column + offset,
				y1: position.row + offset,
				x2: position.column,
				y2: position.row + offset
			};
		case 'upleftup':
			return {
				x1: position.column + offset,
				y1: position.row + offset,
				x2: position.column + offset,
				y2: position.row
			};
	}
};

export const createEdges = (box: Position[], dimensions: Dimensions, offset = 0): Edge[] => {
	const matrixOfPoints: number[][] = deepCopy(Array(dimensions.rows).fill([]));

	for (const point of box) {
		matrixOfPoints[point.row][point.column] = 1;
	}

	const paths: Edge[] = [];

	for (let rowIndex = 0; rowIndex < dimensions.rows; rowIndex++) {
		const row = matrixOfPoints[rowIndex];
		if (row.length === 0) {
			continue;
		}
		for (let columnIndex = 0; columnIndex < dimensions.columns; columnIndex++) {
			const cell = row[columnIndex];
			if (!cell) {
				continue;
			} else {
				if (rowIndex === 0 || !matrixOfPoints[rowIndex - 1][columnIndex]) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'up', offset));
				}
				if (columnIndex === 0 || !matrixOfPoints[rowIndex][columnIndex - 1]) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'left', offset));
				}
				if (rowIndex === dimensions.rows - 1 || !matrixOfPoints[rowIndex + 1][columnIndex]) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'down', offset));
				}
				if (columnIndex === dimensions.columns - 1 || !matrixOfPoints[rowIndex][columnIndex + 1]) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'right', offset));
				}
				if (
					rowIndex !== 0 &&
					matrixOfPoints[rowIndex - 1][columnIndex] &&
					(columnIndex === 0 ||
						!matrixOfPoints[rowIndex][columnIndex - 1] ||
						!matrixOfPoints[rowIndex - 1][columnIndex - 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'upleftup', offset));
				}
				if (
					rowIndex !== 0 &&
					matrixOfPoints[rowIndex - 1][columnIndex] &&
					(columnIndex === dimensions.columns - 1 ||
						!matrixOfPoints[rowIndex][columnIndex + 1] ||
						!matrixOfPoints[rowIndex - 1][columnIndex + 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'uprightup', offset));
				}
				if (
					columnIndex !== dimensions.columns - 1 &&
					matrixOfPoints[rowIndex][columnIndex + 1] &&
					(rowIndex === 0 ||
						!matrixOfPoints[rowIndex - 1][columnIndex + 1] ||
						!matrixOfPoints[rowIndex - 1][columnIndex])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'rightupright', offset));
				}
				if (
					columnIndex !== dimensions.columns - 1 &&
					matrixOfPoints[rowIndex][columnIndex + 1] &&
					(rowIndex === dimensions.rows - 1 ||
						!matrixOfPoints[rowIndex + 1][columnIndex + 1] ||
						!matrixOfPoints[rowIndex + 1][columnIndex])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'rightdownright', offset));
				}
				if (
					rowIndex !== dimensions.rows - 1 &&
					matrixOfPoints[rowIndex + 1][columnIndex] &&
					(columnIndex === dimensions.columns - 1 ||
						!matrixOfPoints[rowIndex][columnIndex + 1] ||
						!matrixOfPoints[rowIndex + 1][columnIndex + 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'downrightdown', offset));
				}
				if (
					rowIndex !== dimensions.rows - 1 &&
					matrixOfPoints[rowIndex + 1][columnIndex] &&
					(columnIndex === 0 ||
						!matrixOfPoints[rowIndex][columnIndex - 1] ||
						!matrixOfPoints[rowIndex + 1][columnIndex - 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'downleftdown', offset));
				}
				if (
					columnIndex !== 0 &&
					matrixOfPoints[rowIndex][columnIndex - 1] &&
					(rowIndex === dimensions.rows - 1 ||
						!matrixOfPoints[rowIndex][columnIndex - 1] ||
						!matrixOfPoints[rowIndex + 1][columnIndex - 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'leftdownleft', offset));
				}
				if (
					columnIndex !== 0 &&
					matrixOfPoints[rowIndex][columnIndex - 1] &&
					(rowIndex === 0 ||
						!matrixOfPoints[rowIndex - 1][columnIndex] ||
						!matrixOfPoints[rowIndex - 1][columnIndex - 1])
				) {
					paths.push(createEdge({ row: rowIndex, column: columnIndex }, 'leftupleft', offset));
				}
			}
		}
	}

	return paths;
};
