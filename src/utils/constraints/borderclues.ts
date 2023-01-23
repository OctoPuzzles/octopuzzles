import type {
	Borderclue,
	BorderClueType,
	CellValues,
	Color,
	Position,
	Shape
} from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';

export function emptyBorderClue(
	positions: [Position, Position],
	type?: BorderClueType
): Borderclue {
	return { type, positions, color: undefined, radius: undefined, text: undefined };
}

export function borderClueDefaults(type?: BorderClueType | 'CUSTOM' | null): {
	shape: Shape;
	color: Color | 'NONE';
	radius: number;
	text: string;
} {
	switch (type) {
		case 'KropkiWhite':
		case 'KropkiBlack':
			return {
				shape: 'Circle',
				color: type === 'KropkiWhite' ? 'White' : 'Black',
				radius: 10,
				text: ''
			};
		case 'XvX':
		case 'XvV':
			return { shape: 'Circle', color: 'NONE', radius: 20, text: String(type)[3] };
		case 'Inequality':
			return { shape: 'Circle', color: 'NONE', radius: 20, text: '<' };
		case 'Quadruple':
			return { shape: 'Circle', color: 'White', radius: 20, text: '' };
		case 'Border':
			return { shape: 'Line', color: 'Black', radius: 50, text: '' };
		default:
			return { shape: 'Circle', color: 'NONE', radius: 10, text: '' };
	}
}

export function getBorderCluesToDraw(clue: Borderclue): Borderclue[] {
	const defaultSettings = borderClueDefaults(clue.type);
	let text: string = clue.text ?? '';
	switch (clue.type) {
		case 'XvX':
			text = 'X';
			break;
		case 'XvV':
			text = 'V';
			break;
		case 'Inequality':
			if (clue.positions[0].column < clue.positions[1].column) {
				text = '\u003c';
			} else if (clue.positions[0].column > clue.positions[1].column) {
				text = '\u003e';
			} else if (clue.positions[0].row < clue.positions[1].row) {
				text = '\u2227';
			} else {
				text = '\u2228';
			}
			break;
	}
	return [
		{
			positions: clue.positions,
			type: clue.type,
			shape: clue.shape ?? defaultSettings.shape,
			color: clue.color ?? (defaultSettings.color !== 'NONE' ? defaultSettings.color : undefined),
			radius: clue.radius ?? defaultSettings.radius,
			text
		}
	];
}

export function verifyBorderClue(
	borderclue: Borderclue,
	solution: CellValues,
	clues: EditorHistoryStep
): Position[] {
	let isValid = true;

	if (borderclue.type === 'Quadruple') {
		if (borderclue.text) {
			const p = borderclue.positions[0];
			const q = borderclue.positions[1];
			const values = [
				solution[p.row][p.column].digits?.[0],
				solution[p.row][q.column].digits?.[0],
				solution[q.row][q.column].digits?.[0],
				solution[q.row][p.column].digits?.[0]
			];
			if (!values.some((v) => !v)) {
				isValid = borderclue.text.split(',').every((v) => {
					const i = values.findIndex((u) => u === v);
					if (i !== -1) {
						values.splice(i, 1);
						return true;
					}
					return false;
				});
				if (!isValid) {
					return [p, q, { row: p.row, column: q.column }, { row: q.row, column: p.column }];
				}
			}
		}
	} else {
		const p = borderclue.positions[0];
		const q = borderclue.positions[1];
		const a = solution[p.row][p.column].digits?.[0];
		const b = solution[q.row][q.column].digits?.[0];

		if (!a || !b) return [];

		const x = parseInt(a);
		const y = parseInt(b);

		switch (borderclue.type) {
			case 'Inequality':
				isValid = x < y;
				break;
			case 'KropkiBlack':
				isValid = x === 2 * y || y === 2 * x;
				break;
			case 'KropkiWhite':
				isValid = Math.abs(x - y) === 1;
				break;
			case 'XvX':
				isValid = x + y === 10;
				break;
			case 'XvV':
				isValid = x + y === 5;
				break;
		}
	}

	if (!isValid) {
		return borderclue.positions;
	} else {
		return [];
	}
}
