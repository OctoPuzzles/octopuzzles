import type { CageType, Color, Extendedcage, Position } from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';

export function emptyCage(positions: Position[], type?: CageType): Extendedcage {
	return { type, positions, text: undefined, color: undefined, uniqueDigits: undefined };
}

export function cageDefaults(type: CageType | null | 'CUSTOM'): {
	text: string;
	color: Color;
	uniqueDigits: boolean;
} {
	return { text: '', color: 'Black', uniqueDigits: type === 'Killer' };
}

export function verifyCage(cage: Extendedcage, solution: string[][], clues:EditorHistoryStep): Position[] {
	let isValid = true;

	switch (cage.type) {
		case 'Killer': {
			if (cage.text) {
				const target = parseInt(cage.text);
				if (!isNaN(target)) {
					const values = cage.positions.map((p) => {
						return solution[p.row][p.column];
					});
					let total = 0;
					let count = 0;
					values.forEach((v) => {
						if (v !== '') {
							total += parseInt(v);
							++count;
						}
					});

					if (count === cage.positions.length) {
						isValid = total === target;
					}
				}
			}
			break;
		}
	}

	if (!isValid) {
		return cage.positions;
	} else {
		return [];
	}
}
