import type { LogicFlag, Position } from '$models/Sudoku';
import type { EditorHistoryStep } from '$types';

export function verifyLogic(
	flags: LogicFlag[],
	solution: string[][],
	clues:EditorHistoryStep
): Position[] {
	const invalidCells: Position[] = [];

	const nonConsecutive = flags.includes('Nonconsecutive');
	const negativeBlack = flags.includes('NegativeBlack');
	const negativeWhite = flags.includes('NegativeWhite');
	const negativeX = flags.includes('NegativeX');
	const negativeV = flags.includes('NegativeV');
	if (nonConsecutive || negativeBlack || negativeWhite || negativeX || negativeV) {
		for (
			let i = clues.dimensions.margins?.top ?? 0;
			i < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0);
			++i
		) {
			for (
				let j = clues.dimensions.margins?.left ?? 0;
				j < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0);
				++j
			) {
				const v = solution[i][j];
				if (v !== '') {
					const a = parseInt(v);
					const nbrCells = [];
					for (const step of [
						{ x: 1, y: 0 },
						{ x: 0, y: 1 }
					]) {
						const row = i + step.x;
						const column = j + step.y;
						if (
							row < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) &&
							column < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0)
						) {
							if (solution[row][column] !== '') {
								nbrCells.push({ row, column });
							}
						}
					}

					if (nonConsecutive) {
						const invalidNbrs = nbrCells.filter((c) => {
							const b = parseInt(solution[c.row][c.column]);
							return Math.abs(a - b) === 1;
						});
						if (invalidNbrs.length > 0) {
							invalidCells.push(
								...[{ row: i, column: j }, ...invalidNbrs].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
					if (negativeBlack) {
						const invalidNbrs = nbrCells.filter((c) => {
							const b = parseInt(solution[c.row][c.column]);
							return (
								(a === 2 * b || b === 2 * a) &&
								!clues.borderclues.some(
									(b) =>
										b.type === 'KropkiBlack' &&
										b.positions.every(
											(p) =>
												(p.row === i && p.column === j) ||
												(p.row === c.row && p.column === c.column)
										)
								)
							);
						});
						if (invalidNbrs.length > 0) {
							invalidCells.push(
								...[{ row: i, column: j }, ...invalidNbrs].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
					if (negativeWhite) {
						const invalidNbrs = nbrCells.filter((c) => {
							const b = parseInt(solution[c.row][c.column]);
							return (
								Math.abs(a - b) === 1 &&
								!clues.borderclues.some(
									(b) =>
										b.type === 'KropkiWhite' &&
										b.positions.every(
											(p) =>
												(p.row === i && p.column === j) ||
												(p.row === c.row && p.column === c.column)
										)
								)
							);
						});
						if (invalidNbrs.length > 0) {
							invalidCells.push(
								...[{ row: i, column: j }, ...invalidNbrs].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
					if (negativeX) {
						const invalidNbrs = nbrCells.filter((c) => {
							const b = parseInt(solution[c.row][c.column]);
							return (
								a + b === 10 &&
								!clues.borderclues.some(
									(b) =>
										b.type === 'XvX' &&
										b.positions.every(
											(p) =>
												(p.row === i && p.column === j) ||
												(p.row === c.row && p.column === c.column)
										)
								)
							);
						});
						if (invalidNbrs.length > 0) {
							invalidCells.push(
								...[{ row: i, column: j }, ...invalidNbrs].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
					if (negativeV) {
						const invalidNbrs = nbrCells.filter((c) => {
							const b = parseInt(solution[c.row][c.column]);
							return (
								a + b === 5 &&
								!clues.borderclues.some(
									(b) =>
										b.type === 'XvV' &&
										b.positions.every(
											(p) =>
												(p.row === i && p.column === j) ||
												(p.row === c.row && p.column === c.column)
										)
								)
							);
						});
						if (invalidNbrs.length > 0) {
							invalidCells.push(
								...[{ row: i, column: j }, ...invalidNbrs].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
				}
			}
		}
	}
	if (flags.includes('Entropy')) {
		for (
			let i = clues.dimensions.margins?.top ?? 0;
			i < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) - 1;
			++i
		) {
			for (
				let j = clues.dimensions.margins?.left ?? 0;
				j < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0) - 1;
				++j
			) {
				const v = solution[i][j];
				if (v !== '') {
					const a = parseInt(v);
					const nbrCells = [];
					for (const step of [
						{ x: 1, y: 0 },
						{ x: 0, y: 1 },
						{ x: 1, y: 1 }
					]) {
						const row = i + step.x;
						const column = j + step.y;
						if (solution[row][column] !== '') {
							nbrCells.push({ row, column });
						} else {
							break;
						}
					}
					if (nbrCells.length === 3) {
						const b = parseInt(solution[nbrCells[0].row][nbrCells[0].column]);
						const c = parseInt(solution[nbrCells[1].row][nbrCells[1].column]);
						const d = parseInt(solution[nbrCells[2].row][nbrCells[2].column]);

						let invalid = false;
						if (Math.ceil(a / 3) === Math.ceil(b / 3)) {
							invalid =
								Math.ceil(a / 3) === Math.ceil(c / 3) ||
								Math.ceil(a / 3) === Math.ceil(d / 3) ||
								Math.ceil(c / 3) === Math.ceil(d / 3);
						} else if (Math.ceil(a / 3) === Math.ceil(c / 3)) {
							invalid =
								Math.ceil(a / 3) === Math.ceil(d / 3) || Math.ceil(b / 3) === Math.ceil(d / 3);
						} else if (Math.ceil(a / 3) === Math.ceil(d / 3)) {
							invalid = Math.ceil(b / 3) === Math.ceil(c / 3);
						} else if (Math.ceil(b / 3) === Math.ceil(c / 3)) {
							invalid = Math.ceil(b / 3) === Math.ceil(d / 3);
						}

						if (invalid) {
							invalidCells.push(
								...[{ row: i, column: j }, ...nbrCells].filter(
									(c) => !invalidCells.some((d) => d.row === c.row && d.column === c.column)
								)
							);
						}
					}
				}
			}
		}
	}
	if (flags.includes('Indexed159')) {
		for (
			let i = clues.dimensions.margins?.top ?? 0;
			i < clues.dimensions.rows + (clues.dimensions.margins?.top ?? 0);
			++i
		) {
			for (const d of [1, 5, 9]) {
				let v = solution[i][(clues.dimensions.margins?.left ?? 0) + d - 1];
				if (v !== '') {
					const j = parseInt(v) - 1;
					v = solution[i][j];
					if (v !== '' && parseInt(v) !== d) {
						invalidCells.push(
							{ row: i, column: (clues.dimensions.margins?.left ?? 0) + d - 1 },
							{ row: i, column: j }
						);
					}
				}
			}
		}
	}

	return invalidCells;
}
