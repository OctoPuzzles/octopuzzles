import type { Color, Fill, Form, Path, PathType, Position } from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';
import deepCopy from '$utils/deepCopy';
import { comparePositions } from '$utils/topLeftOfPositions';

export function emptyPath(positions: Position[], type?: PathType): Path {
	return {
		type,
		positions,
		color: undefined,
		width: undefined,
		form: undefined,
		fill: undefined,
		arrow: undefined,
		uniqueDigits: undefined
	};
}

export function pathDefaults(type?: PathType | 'CUSTOM' | null): {
	color: Color;
	width: number;
	form: Form;
	fill: Fill;
	arrow: boolean;
	uniqueDigits: boolean;
} {
	switch (type) {
		case 'Arrow':
			return {
				color: 'Gray',
				width: 5,
				form: 'Round',
				fill: 'Solid',
				arrow: true,
				uniqueDigits: false
			};
		case 'Thermo':
			return {
				arrow: false,
				color: 'Gray',
				fill: 'Solid',
				form: 'Round',
				width: 20,
				uniqueDigits: true
			};
		case 'Between':
			return {
				arrow: false,
				color: 'Gray',
				fill: 'Solid',
				form: 'Round',
				width: 5,
				uniqueDigits: false
			};
		case 'Lockout':
			return {
				arrow: false,
				color: 'Blue',
				fill: 'Solid',
				form: 'Diamond',
				width: 5,
				uniqueDigits: false
			};
		case 'Renban':
			return {
				arrow: false,
				color: 'Purple',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: true
			};
		case 'Whisper':
		case 'DutchWhisper':
			return {
				arrow: false,
				color: type === 'DutchWhisper' ? 'Orange' : 'Green',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: false
			};
		case 'Palindrome':
		case 'Parity':
			return {
				arrow: false,
				color: 'Gray',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: false
			};
		case 'AntiFactor':
			return {
				arrow: false,
				color: 'Yellow',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: false
			};
		case 'EqualSum':
			return {
				arrow: false,
				color: 'Blue',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: false
			};
		case 'ProductSum':
			return {
				arrow: false,
				color: 'Red',
				fill: 'Solid',
				form: 'Square',
				width: 13,
				uniqueDigits: false
			};
		case 'Entropic':
			return {
				arrow: false,
				color: 'Gray',
				fill: 'Solid',
				form: 'Round',
				width: 15,
				uniqueDigits: false
			};
		case 'Odd':
		case 'Even':
			return {
				arrow: false,
				color: 'Gray',
				fill: 'Solid',
				form: type === 'Even' ? 'Square' : 'Round',
				width: 70,
				uniqueDigits: false
			};
		case 'Pill':
			return {
				color: 'Gray',
				width: 66,
				form: 'Round',
				fill: 'Hollow',
				arrow: false,
				uniqueDigits: false
			};
		default:
			return {
				color: 'Black',
				width: 10,
				form: 'Round',
				fill: 'Solid',
				arrow: false,
				uniqueDigits: false
			};
	}
}

export function getPathsToDraw(path: Path): Path[] {
	const defaultSettings = pathDefaults(path.type);

	const drawPaths: Path[] = [
		{
			positions: path.positions,
			type: path.type,
			color: path.color ?? defaultSettings.color,
			width: path.width ?? defaultSettings.width,
			form: path.form ?? defaultSettings.form,
			fill: path.fill ?? defaultSettings.fill,
			arrow: path.arrow ?? defaultSettings.arrow,
			uniqueDigits: undefined
		}
	];
	switch (path.type) {
		case 'Arrow': {
			drawPaths.push(
				...getPathsToDraw({
					...emptyPath([path.positions[0]], 'Pill'),
					color: path.color,
					form: path.form
				})
			);
			break;
		}
		case 'Thermo': {
			drawPaths.push({
				type: undefined,
				arrow: path.arrow ?? defaultSettings.arrow,
				color: path.color ?? defaultSettings.color,
				fill: path.fill ?? defaultSettings.fill,
				form: path.form ?? defaultSettings.form,
				positions: [path.positions[0]],
				width: 66,
				uniqueDigits: undefined
			});
			break;
		}
		case 'Between':
		case 'Lockout':
		case 'ProductSum': {
			const firstPosition = path.positions[0];
			const lastPosition = path.positions[path.positions.length - 1];

			for (const bulbPosition of [firstPosition, lastPosition]) {
				drawPaths.push({
					type: undefined,
					arrow: false,
					color: path.color ?? defaultSettings.color,
					fill: 'Hollow',
					form:
						path.form ??
						(path.type === 'Between' ? 'Round' : path.type === 'Lockout' ? 'Diamond' : 'Square'),
					positions: [bulbPosition],
					width: path.type === 'ProductSum' ? 70 : 81,
					uniqueDigits: undefined
				});
			}
			break;
		}
	}

	return drawPaths;
}

export function verifyPath(
	path: Path,
	solution: string[][],
	clues:EditorHistoryStep
): Position[] {
	let isValid = true;
	switch (path.type) {
		case 'Arrow': {
			let target = NaN;
			const p = path.positions[0];
			const pill = clues.paths.find(
				(l) =>
					l.type === 'Pill' && l.positions.some((q) => q.row === p.row && q.column === p.column)
			);

			if (pill) {
				let t = '';
				if (
					deepCopy(pill.positions)
						.sort(comparePositions)
						.some((p) => {
							if (solution[p.row][p.column] === '') {
								return true;
							}

							t += solution[p.row][p.column];

							return false;
						})
				) {
					break;
				}

				target = parseInt(t);
			} else {
				const t = solution[p.row][p.column];
				if (t === '') {
					break;
				}

				target = parseInt(t);
			}

			let total = 0;
			let count = 0;

			path.positions.forEach((p, i) => {
				if (i === 0) return;

				const v = solution[p.row][p.column];
				if (v !== '') {
					total += parseInt(v);
					++count;
				}
			});

			if (count === path.positions.length - 1) {
				isValid = total === target;
			}

			if (!isValid && pill) {
				return [...pill.positions, ...path.positions.filter((_, i) => i !== 0)];
			}

			break;
		}
		case 'Thermo': {
			let prev = '';

			for (let n = 0; n < path.positions.length; ++n) {
				const p = path.positions[n];
				const value = solution[p.row][p.column];
				if (value !== '') {
					if (prev !== '' && value <= prev) {
						isValid = false;
						break;
					}

					prev = value;
				}
			}
			break;
		}
		case 'Between':
		case 'Lockout': {
			const p = path.positions[0];
			const q = path.positions[path.positions.length - 1];
			const a = solution[p.row][p.column];
			const b = solution[q.row][q.column];

			if (a !== '' && b !== '') {
				const x = parseInt(a);
				const y = parseInt(b);
				const min = Math.min(x, y);
				const max = Math.max(x, y);

				if (path.type === 'Lockout' && max - min < 4) {
					isValid = false;
				} else {
					isValid = !path.positions.some((p, i) => {
						if (i === 0 || i === path.positions.length - 1) return false;

						const v = solution[p.row][p.column];
						if (v === '') return false;

						const n = parseInt(v);
						if (path.type === 'Lockout') {
							return n >= min || n <= max;
						} else {
							return n <= min || n >= max;
						}
					});
				}
			}
			break;
		}
		case 'Renban': {
			let min = NaN;
			let max = NaN;
			if (
				!path.positions.some((p) => {
					const v = solution[p.row][p.column];
					if (v === '') return true;

					const n = parseInt(v);
					if (isNaN(min)) {
						min = n;
						max = n;
					} else {
						min = Math.min(min, n);
						max = Math.max(max, n);
					}
					return false;
				})
			) {
				isValid = isNaN(min) || max - min < path.positions.length;
			}
			break;
		}
		case 'Whisper':
		case 'DutchWhisper': {
			const diff = path.type === 'DutchWhisper' ? 4 : 5;
			let prev = NaN;

			for (let n = 0; n < path.positions.length; ++n) {
				const p = path.positions[n];
				const v = solution[p.row][p.column];
				if (v !== '') {
					const n = parseInt(v);
					if (!isNaN(prev) && Math.abs(n - prev) < diff) {
						isValid = false;
						break;
					}

					prev = n;
				} else {
					prev = NaN;
				}
			}
			break;
		}
		case 'Palindrome': {
			const unmirrored: Position[] = [];
			for (let n = 0; n < Math.floor(path.positions.length / 2); ++n) {
				const p = path.positions[n];
				const q = path.positions[path.positions.length - n - 1];
				const a = solution[p.row][p.column];
				const b = solution[q.row][q.column];
				if (a !== '' && b !== '' && a !== b) {
					unmirrored.push(p, q);
				}
			}
			return unmirrored;
		}
		case 'AntiFactor': {
			const factor = path.positions.length;
			let total = 0;
			let count = 0;
			const invalidCells = path.positions.filter((p) => {
				const v = solution[p.row][p.column];
				if (v !== '') {
					const n = parseInt(v);
					total += n;
					++count;

					return n !== 1 && (factor % n === 0 || n % factor === 0);
				}

				return false;
			});

			if (count === path.positions.length) {
				isValid = total % factor === 0;
			}
			if (isValid) {
				return invalidCells;
			}
			break;
		}
		case 'EqualSum':
			//TODO
			break;
		case 'ProductSum': {
			const p = path.positions[0];
			const q = path.positions[path.positions.length - 1];
			const a = solution[p.row][p.column];
			const b = solution[q.row][q.column];

			if (a !== '' && b !== '') {
				const product = parseInt(a) * parseInt(b);
				let total = 0;
				let count = 0;

				path.positions.forEach((p, i) => {
					if (i === 0 || i === path.positions.length - 1) return;

					const v = solution[p.row][p.column];
					if (v !== '') {
						total += parseInt(v);
						++count;
					}
				});

				if (count === path.positions.length - 2) {
					isValid = total === product;
				}
			}
			break;
		}
		case 'Entropic': {
			const invalidCells: Position[] = [];
			let lastInvalidIndex = -1;
			for (let i = 2; i < path.positions.length; ++i) {
				const p = path.positions[i - 2];
				const q = path.positions[i - 1];
				const r = path.positions[i];
				const u = solution[p.row][p.column];
				const v = solution[q.row][q.column];
				const w = solution[r.row][r.column];
				if (u !== '' && v !== '' && w !== '') {
					const a = Math.ceil(parseInt(u) / 3);
					const b = Math.ceil(parseInt(v) / 3);
					const c = Math.ceil(parseInt(w) / 3);
					if (a === b || a === c || b === c) {
						isValid = false;
						if (i - 2 > lastInvalidIndex) invalidCells.push(p);
						if (i - 1 > lastInvalidIndex) invalidCells.push(q);
						if (i > lastInvalidIndex) invalidCells.push(r);
						lastInvalidIndex = i;
					}
				}
			}
			return invalidCells;
		}
		case 'Odd':
		case 'Even': {
			const invalidCells: Position[] = [];
			path.positions.forEach((p) => {
				const value = solution[p.row][p.column];
				if (value !== '') {
					const digit = parseInt(value);
					if (digit % 2 !== (path.type === 'Odd' ? 1 : 0)) {
						invalidCells.push(p);
					}
				}
			});
			return invalidCells;
		}
		case 'Parity': {
			const invalidCells: Position[] = [];
			let lastInvalidIndex = -1;
			for (let i = 1; i < path.positions.length; ++i) {
				const p = path.positions[i - 1];
				const q = path.positions[i];
				const u = solution[p.row][p.column];
				const v = solution[q.row][q.column];
				if (u !== '' && v !== '') {
					const a = parseInt(u) % 2;
					const b = parseInt(v) % 2;
					if (a === b) {
						isValid = false;
						if (i - 1 > lastInvalidIndex) invalidCells.push(p);
						if (i > lastInvalidIndex) invalidCells.push(q);
						lastInvalidIndex = i;
					}
				}
			}
			return invalidCells;
		}
	}

	if (!isValid) {
		return path.positions;
	} else {
		return [];
	}
}
