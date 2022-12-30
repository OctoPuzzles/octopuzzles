import type { CellClueSize } from '$models/Sudoku';

export function cellCluesFontSize(s: string, size?: CellClueSize | null): string {
	let scale = 0;
	switch (s.length) {
		case 1:
			scale = 2;
			break;
		case 2:
			scale = 1.8;
			break;
		case 3:
			scale = 1.62;
			break;
		case 4:
			scale = 1.43;
			break;
		case 0:
		default:
			break;
	}

	switch (size) {
		case 'Large':
			return scale * 1.2 + 'rem';
		case 'Small':
			return scale * 0.5 + 'rem';
		case 'XSmall':
			return scale * 0.25 + 'rem';
		case 'Medium':
		default:
			return scale * 0.85 + 'rem';
	}
}
