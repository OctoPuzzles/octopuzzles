import type {
	Cellclue,
	CellClueLocation,
	CellClueSize,
	CellClueType,
	Color,
	Dimensions,
	Position,
	Rotation,
	SymbolType
} from '$models/Sudoku';

export function emptyCellClue(position: Position, type?: CellClueType): Cellclue {
	return {
		type,
		position: position,
		location: undefined,
		text: undefined,
		size: undefined,
		symbol: undefined,
		rotation: undefined,
		color: undefined
	};
}

export function cellClueDefaults(type?: CellClueType | 'CUSTOM' | null): {
	text: string;
	location: CellClueLocation;
	size: CellClueSize;
	symbol: SymbolType | 'NONE';
	rotation: Rotation;
	color: Color;
} {
	switch (type) {
		case 'LittleKillerNW':
		case 'LittleKillerNE':
		case 'LittleKillerSE':
		case 'LittleKillerSW':
		case 'Sandwich':
		case 'Skyscraper':
		case 'XSum':
		case 'NumberedRoom':
			return {
				text: '',
				location: 'Center',
				size: 'Medium',
				symbol: 'NONE',
				rotation: 'NorthWest',
				color: 'Black'
			};
		case 'Maximum':
		case 'Minimum':
			return {
				text: '',
				location: 'Center',
				size: 'Small',
				symbol: 'NONE',
				rotation: 'NorthWest',
				color: 'Gray'
			};
		default:
			return {
				text: '',
				location: 'TopLeft',
				size: 'Small',
				symbol: 'NONE',
				rotation: 'NorthWest',
				color: 'Black'
			};
	}
}

export function getCellCluesToDraw(clue: Cellclue): Cellclue[] {
	const defaultSettings = cellClueDefaults(clue.type);

	const drawClues: Cellclue[] = [
		{
			position: clue.position,
			type: clue.type,
			text: clue.text ?? defaultSettings.text,
			location: clue.location ?? defaultSettings.location,
			size: clue.size ?? defaultSettings.size,
			symbol:
				clue.symbol ?? (defaultSettings.symbol !== 'NONE' ? defaultSettings.symbol : undefined),
			rotation: clue.rotation ?? defaultSettings.rotation,
			color: clue.color ?? defaultSettings.color
		}
	];
	switch (clue.type) {
		case 'Maximum':
		case 'Minimum': {
			const partial: Cellclue = {
				position: clue.position,
				type: undefined,
				text: undefined,
				location: undefined,
				size: undefined,
				symbol: clue.type === 'Minimum' ? 'InvertedArrowhead' : 'Arrowhead',
				color: clue.color ?? defaultSettings.color
			};
			drawClues.push({ ...partial, rotation: 'North' });
			drawClues.push({ ...partial, rotation: 'East' });
			drawClues.push({ ...partial, rotation: 'South' });
			drawClues.push({ ...partial, rotation: 'West' });
			break;
		}
		case 'LittleKillerNW': {
			drawClues.push({
				position: clue.position,
				type: undefined,
				text: undefined,
				size: undefined,
				location: undefined,
				symbol: 'SmallArrow',
				rotation: 'NorthWest',
				color: clue.color ?? defaultSettings.color
			});
			break;
		}
		case 'LittleKillerNE': {
			drawClues.push({
				position: clue.position,
				type: undefined,
				text: undefined,
				size: undefined,
				location: undefined,
				symbol: 'SmallArrow',
				rotation: 'NorthEast',
				color: clue.color ?? defaultSettings.color
			});
			break;
		}
		case 'LittleKillerSE': {
			drawClues.push({
				position: clue.position,
				type: undefined,
				text: undefined,
				size: undefined,
				location: undefined,
				symbol: 'SmallArrow',
				rotation: 'SouthEast',
				color: clue.color ?? defaultSettings.color
			});
			break;
		}
		case 'LittleKillerSW': {
			drawClues.push({
				position: clue.position,
				type: undefined,
				text: undefined,
				size: undefined,
				location: undefined,
				symbol: 'SmallArrow',
				rotation: 'SouthWest',
				color: clue.color ?? defaultSettings.color
			});
			break;
		}
	}

	return drawClues;
}

export function verifyCellClue(
	cellclue: Cellclue,
	solution: string[][],
	dimensions: Dimensions
): Position[] {
	switch (cellclue.type) {
		case 'LittleKillerNW':
		case 'LittleKillerNE':
		case 'LittleKillerSE':
		case 'LittleKillerSW': {
			if (cellclue.text) {
				const target = parseInt(cellclue.text);
				let rowStep = 0;
				let colStep = 0;
				if (cellclue.type === 'LittleKillerNW') {
					rowStep = -1;
					colStep = -1;
				} else if (cellclue.type === 'LittleKillerNE') {
					rowStep = -1;
					colStep = 1;
				} else if (cellclue.type === 'LittleKillerSE') {
					rowStep = 1;
					colStep = 1;
				} else if (cellclue.type === 'LittleKillerSW') {
					rowStep = 1;
					colStep = -1;
				}

				let total = 0;
				let count = 0;
				const cells: Position[] = [];
				for (
					let i = cellclue.position.row + rowStep, j = cellclue.position.column + colStep;
					i >= (dimensions.margins?.top ?? 0) &&
					i < dimensions.rows - (dimensions.margins?.bottom ?? 0) &&
					j >= (dimensions.margins?.left ?? 0) &&
					j < dimensions.columns - (dimensions.margins?.right ?? 0);
					i += rowStep, j += colStep
				) {
					const v = solution[i][j];
					if (v !== '') {
						total += parseInt(v);
						++count;
					}
					cells.push({ row: i, column: j });
				}

				if (count === cells.length && total !== target) {
					return [cellclue.position, ...cells];
				} else if (count < cells.length && total >= target) {
					return [cellclue.position, ...cells];
				}
			}
			break;
		}
		case 'Sandwich':
		case 'Skyscraper':
		case 'XSum':
		case 'NumberedRoom': {
			if (cellclue.text) {
				const target = parseInt(cellclue.text);
				let rowStep = 0;
				let colStep = 0;
				if (cellclue.position.row === (dimensions.margins?.top ?? 0) - 1) {
					rowStep = 1;
				} else if (cellclue.position.row === dimensions.rows - (dimensions.margins?.bottom ?? 0)) {
					rowStep = -1;
				}
				if (cellclue.position.column === (dimensions.margins?.left ?? 0) - 1) {
					colStep = 1;
				} else if (
					cellclue.position.column ===
					dimensions.columns - (dimensions.margins?.right ?? 0)
				) {
					colStep = -1;
				}
				if (rowStep === 0 && colStep === 0) {
					break;
				}

				let i = cellclue.position.row + rowStep;
				let j = cellclue.position.column + colStep;
				let key = 0;
				if (cellclue.type === 'XSum' || cellclue.type === 'NumberedRoom') {
					if (solution[i][j] === '') {
						break;
					} else {
						key = parseInt(solution[i][j]);
						if (cellclue.type === 'NumberedRoom') {
							i += (key - 1) * rowStep;
							j += (key - 1) * colStep;
							if (solution[i][j] === '') {
								break;
							} else {
								const v = solution[i][j];
								if (v === '') {
									break;
								} else if (parseInt(v) !== key) {
									return [cellclue.position];
								}
							}
						}
					}
				}

				let total = 0;
				let count = 0;
				const cells: Position[] = [];
				for (
					;
					i >= (dimensions.margins?.top ?? 0) &&
					i < (dimensions.margins?.top ?? 0) + dimensions.rows &&
					j >= (dimensions.margins?.left ?? 0) &&
					i < (dimensions.margins?.left ?? 0) + dimensions.columns;
					i += rowStep, j += colStep
				) {
					const v = solution[i][j];
					if (v !== '') {
						const d = parseInt(v);
						if (cellclue.type === 'Skyscraper') {
							if (d > key) {
								++total;
								key = d;
							}
						} else if (cellclue.type === 'Sandwich') {
							if (d === 1 || d === 9) {
								if (key === 0) {
									key = d;
								} else {
									++count;
									cells.push({ row: i, column: j });
									break;
								}
							} else if (key !== 0) {
								total += d;
							} else {
								continue;
							}
						} else if (cellclue.type === 'XSum') {
							total += d;
						}
						++count;
					}
					if (cellclue.type !== 'Sandwich' || key !== 0) {
						cells.push({ row: i, column: j });
					}

					if (cellclue.type === 'XSum' && cells.length === key) {
						break;
					}
				}

				if (count > 0 && count === cells.length && total !== target) {
					return [cellclue.position, ...cells];
				}
			}
			break;
		}
		case 'Maximum':
		case 'Minimum': {
			const v = solution[cellclue.position.row][cellclue.position.column];
			if (v !== '') {
				const nbrCells = [];
				for (const step of [
					{ x: -1, y: 0 },
					{ x: 1, y: 0 },
					{ x: 0, y: -1 },
					{ x: 0, y: 1 }
				]) {
					const row = cellclue.position.row + step.x;
					const column = cellclue.position.column + step.y;
					if (row >= 0 && row < solution.length && column >= 0 && column < solution[0].length) {
						if (solution[row][column] !== '') {
							nbrCells.push({ row, column });
						}
					}
				}

				const invalidCells = nbrCells.filter((c) => {
					if (cellclue.type === 'Maximum') {
						return v < solution[c.row][c.column];
					} else {
						return v > solution[c.row][c.column];
					}
				});
				if (invalidCells.length) {
					return [cellclue.position, ...invalidCells];
				}
				break;
			}
		}
	}
	return [];
}
