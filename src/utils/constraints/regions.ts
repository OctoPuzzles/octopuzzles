import type { Color, Position, Region, RegionType } from '$models/Sudoku';
import deepCopy from '$utils/deepCopy';
import { comparePositions, topLeftOfPositions } from '$utils/topLeftOfPositions';

export function emptyRegion(positions: Position[], type?: RegionType): Region {
	return { type, positions, borders: undefined, color: undefined };
}

export function regionDefaults(
	type?: RegionType | 'CUSTOM' | null,
	nonstandard = false
): {
	borders: boolean;
	color: Color | 'NONE';
	uniqueDigits: boolean;
} {
	switch (type) {
		case 'Normal':
			return {
				borders: true,
				color: 'NONE',
				uniqueDigits: !nonstandard
			};
		case 'Clone':
			return {
				borders: false,
				color: 'LightGray',
				uniqueDigits: false
			};
		default:
			return {
				borders: false,
				color: 'Gray',
				uniqueDigits: type === 'Extra' || type === 'MagicSquare'
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

export function verifyRegion(region: Region, solution: string[][], regions: Region[]): Position[] {
	switch (region.type) {
		case 'MagicSquare': {
			const n = Math.sqrt(region.positions.length);
			const positions = deepCopy(region.positions).sort(comparePositions);
			const values: string[][] = [];
			for (let i = 0; i < n; ++i) {
				values[i] = [];
				for (let j = 0; j < n; ++j) {
					const p = positions[i * n + j];
					values[i].push(solution[p.row][p.column]);
				}
			}
			let target = NaN;
			let total: number;
			let count: number;
			//rows
			for (let i = 0; i < n; ++i) {
				total = 0;
				count = 0;
				for (let j = 0; j < n; ++j) {
					if (values[i][j] !== '') {
						total += parseInt(values[i][j]);
						++count;
					} else {
						break;
					}
				}
				if (count == n) {
					if (isNaN(target)) {
						target = total;
					} else if (total !== target) {
						return positions;
					}
				}
			}
			//columns
			for (let j = 0; j < n; ++j) {
				total = 0;
				count = 0;
				for (let i = 0; i < n; ++i) {
					if (values[i][j] !== '') {
						total += parseInt(values[i][j]);
						++count;
					} else {
						break;
					}
				}
				if (count == n) {
					if (isNaN(target)) {
						target = total;
					} else if (total !== target) {
						return positions;
					}
				}
			}
			//diagonals
			total = 0;
			count = 0;
			for (let i = 0; i < n; ++i) {
				if (values[i][i] !== '') {
					total += parseInt(values[i][i]);
					++count;
				} else {
					break;
				}
			}
			if (count == n) {
				if (isNaN(target)) {
					target = total;
				} else if (total !== target) {
					return positions;
				}
			}

			total = 0;
			count = 0;
			for (let i = 0; i < n; ++i) {
				const j = n - i - 1;
				if (values[i][j] !== '') {
					total += parseInt(values[i][j]);
					++count;
				} else {
					break;
				}
			}
			if (count == n) {
				if (isNaN(target)) {
					target = total;
				} else if (total !== target) {
					return positions;
				}
			}
			break;
		}
		case 'Clone':
			//TODO
			break;
	}

	return [];
}
