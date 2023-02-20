import type { CellValues, Color, Position, Region, RegionType } from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';
import deepCopy from '$utils/deepCopy';
import { comparePositions } from '$utils/topLeftOfPositions';

export function emptyRegion(positions: Position[], type?: RegionType): Region {
	return { type, positions, borders: undefined, color: undefined, nonStandard: undefined };
}

export function regionDefaults(
	type?: RegionType | 'CUSTOM' | null,
	nonstandard = false
): {
	borders: boolean;
	color: Color | 'NONE';
	uniqueDigits: boolean;
	nonStandard: boolean;
} {
	switch (type) {
		case 'Normal':
			return {
				borders: true,
				color: 'NONE',
				uniqueDigits: !nonstandard,
				nonStandard: nonstandard
			};
		case 'Clone':
			return {
				borders: false,
				color: 'LightGray',
				uniqueDigits: false,
				nonStandard: false
			};
		default:
			return {
				borders: false,
				color: 'Gray',
				uniqueDigits: type === 'Extra' || type === 'MagicSquare',
				nonStandard: false
			};
	}
}

export function getRegionsToDraw(region: Region): Region[] {
	const defaultSettings = regionDefaults(region.type);
	return [
		{
			positions: region.positions,
			type: region.type,
			borders: region.borders ?? defaultSettings.borders,
			color: region.color ?? (defaultSettings.color !== 'NONE' ? defaultSettings.color : undefined),
			uniqueDigits: undefined
		}
	];
}

export function verifyRegion(
	region: Region,
	solution: CellValues,
	clues: EditorHistoryStep
): Position[] {
	if (!(region.nonStandard ?? false)) {
		switch (region.type) {
			case 'MagicSquare': {
				const n = Math.sqrt(region.positions.length);
				const positions = deepCopy(region.positions).sort(comparePositions);
				const values: number[][] = [];
				for (let i = 0; i < n; ++i) {
					values[i] = [];
					for (let j = 0; j < n; ++j) {
						const p = positions[i * n + j];
						const cell = solution[p.row][p.column];
						if (cell.value === undefined) {
							return [];
						}
						values[i].push(cell.value);
					}
				}
				let target = NaN;
				let total: number;
				//rows
				for (let i = 0; i < n; ++i) {
					total = 0;
					for (let j = 0; j < n; ++j) {
						total += values[i][j];
					}
					if (isNaN(target)) {
						target = total;
					} else if (total !== target) {
						return positions;
					}
				}
				//columns
				for (let j = 0; j < n; ++j) {
					total = 0;
					for (let i = 0; i < n; ++i) {
						total += values[i][j];
					}
					if (target === undefined) {
						target = total;
					} else if (total !== target) {
						return positions;
					}
				}
				//diagonals
				total = 0;
				for (let i = 0; i < n; ++i) {
					total += values[i][i];
				}
				if (target === undefined) {
					target = total;
				} else if (total !== target) {
					return positions;
				}

				total = 0;
				for (let i = 0; i < n; ++i) {
					const j = n - i - 1;
					total += values[i][j];
				}
				if (target === undefined) {
					target = total;
				} else if (total !== target) {
					return positions;
				}
				break;
			}
			case 'Clone': {
				const clones = clues.regions.filter(
					(r) => r !== region && r.type === 'Clone' && r.color === region.color
				);
				const positions = deepCopy(region.positions).sort(comparePositions);
				const uncloned: Position[] = [];
				clones.forEach((r) => {
					const clonePositions = deepCopy(r.positions).sort(comparePositions);
					positions.forEach((p, i) => {
						const a = solution[p.row][p.column];
						if (a.value !== undefined) {
							const q = clonePositions[i];
							const b = solution[q.row][q.column];
							if (b.value !== undefined && b.value !== a.value) {
								if (!uncloned.includes(p)) {
									uncloned.push(p);
								}
								uncloned.push(q);
							}
						}
					});
				});
				if (uncloned.length) {
					return uncloned;
				}
				break;
			}
		}
	}

	return [];
}
