import { get, writable } from 'svelte/store';
import deepCopy from '$utils/deepCopy';
import { defaultRegionSize } from '$utils/defaults';
import type { Position } from '$models/Sudoku';
import type { ScannerSettings } from '$models/User';
import { editorHistory, gameHistory, mode, highlights } from '.';
import { cageDefaults, pathDefaults, regionDefaults } from '$utils/prefabs';
import { getValuesFromRange } from '$utils/keyboard/getValuesFromRange';

// WRITABLES
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createScannerStore() {
	const scannerSettings = writable<ScannerSettings>({
		highlightMode: 'None',
		mode: 'Basic',
		autoScan: false,
		scannerSpeed: 'Slow',
		useCentreMarks: true,
		useCornerMarks: true,
		scanDiagonals: true,
		scanAntiKnight: true,
		scanAntiKing: true,
		scanDisjointSets: true,
		scanCages: true,
		scanPaths: true,
		scanExtraRegions: true,
		scanNegativeXV: true,
		scanNegativeKropki: true,
		scanNonConsecutive: true
	});

	const scannerContext = writable<{
		candidates: string[][][];
		queue: Position[];
		highlightedCells: Position[];
	}>({
		candidates: [],
		queue: [],
		highlightedCells: []
	});

	function configure(settings?: ScannerSettings): void {
		scannerSettings.set({
			highlightMode: settings?.highlightMode ?? 'None',
			mode: settings?.mode ?? 'Basic',
			autoScan: settings?.autoScan ?? false,
			scannerSpeed: settings?.scannerSpeed ?? 'Slow',
			useCentreMarks: settings?.useCentreMarks ?? true,
			useCornerMarks: settings?.useCornerMarks ?? true,
			scanDiagonals: settings?.scanDiagonals ?? true,
			scanAntiKnight: settings?.scanAntiKnight ?? true,
			scanAntiKing: settings?.scanAntiKing ?? true,
			scanDisjointSets: settings?.scanDisjointSets ?? true,
			scanCages: settings?.scanCages ?? true,
			scanPaths: settings?.scanPaths ?? true,
			scanExtraRegions: settings?.scanExtraRegions ?? true,
			scanNegativeXV: settings?.scanNegativeXV ?? true,
			scanNegativeKropki: settings?.scanNegativeKropki ?? true,
			scanNonConsecutive: settings?.scanNonConsecutive ?? true
		});

		const { highlightedCells, selectedCells } = highlights;
		if (get(mode) === 'game') highlightedCells.set(getHighlightedCells(get(selectedCells)));
	}

	const scanning = writable(false);

	function isScanning() {
		return get(scanning);
	}

	function initScan(seed?: Position) {
		const dimensions = editorHistory.getClue('dimensions');
		const givens = editorHistory.getClue('givens');
		const logic = editorHistory.getClue('logic');

		const rowOffset = dimensions.margins?.top ?? 0;
		const columnOffset = dimensions.margins?.left ?? 0;
		const rows = dimensions.rows - rowOffset - (dimensions.margins?.bottom ?? 0);
		const columns = dimensions.columns - columnOffset - (dimensions.margins?.right ?? 0);

		const values = get(gameHistory.getValue('values'));
		const centermarks = get(gameHistory.getValue('centermarks'));

		let allDigits: string[] = [];
		let candidates: string[][][] = [];
		let queue: Position[] = [];

		allDigits = getValuesFromRange(logic.digits ?? '1-' + rows);

		candidates = [];
		queue = [];

		for (let i = 0; i < rows; ++i) {
			const row = i + rowOffset;

			candidates[row] = [];

			for (let j = 0; j < columns; ++j) {
				const column = j + columnOffset;

				if (givens[row][column] === '' && values[row][column] === '') {
					queue.push({ row, column });

					if (centermarks[row][column].length) {
						candidates[row][column] = centermarks[row][column].split('');
					} else {
						candidates[row][column] = [...allDigits];
					}
				}
			}
		}

		scannerContext.set({ candidates, queue, highlightedCells: [] });

		if (seed) {
			sortQueue(seed);
		}
	}

	function sortQueue(cell: Position): void {
		const context = get(scannerContext);
		const seenCells = getSeenCells(cell);

		context.queue.sort((a, b) => {
			const indexA = seenCells.findIndex((c) => c.row === a.row && c.column === a.column);
			const indexB = seenCells.findIndex((c) => c.row === b.row && c.column === b.column);

			if (indexA !== -1) {
				if (indexB !== -1) {
					if (indexA < indexB) {
						return -1;
					} else if (indexB < indexA) {
						return 1;
					}
				} else {
					return -1;
				}
			} else if (indexB !== -1) {
				return 1;
			}
			return 0;
		});
	}

	function getSeenCells(cell: Position): { row: number; column: number; context: string }[] {
		const dimensions = editorHistory.getClue('dimensions');
		const rowOffset = dimensions.margins?.top ?? 0;
		const columnOffset = dimensions.margins?.left ?? 0;
		const rows = dimensions.rows - rowOffset - (dimensions.margins?.bottom ?? 0);
		const columns = dimensions.columns - columnOffset - (dimensions.margins?.right ?? 0);
		const { width, height } = defaultRegionSize(dimensions);

		const seen: { row: number; column: number; context: string }[] = [];

		const i = cell.row - rowOffset;
		const j = cell.column - columnOffset;

		const logic = editorHistory.getClue('logic');
		const flags = logic.flags ?? [];
		const nonstandard = flags.indexOf('NonStandard') !== -1;
		const diagonalPos = flags.indexOf('DiagonalPos') !== -1;
		const diagonalNeg = flags.indexOf('DiagonalNeg') !== -1;
		const antiknight = flags.indexOf('Antiknight') !== -1;
		const antiking = flags.indexOf('Antiking') !== -1;
		const disjointsets = flags.indexOf('DisjointSets') !== -1;

		if (!nonstandard) {
			for (let x = 0; x < rows; ++x) {
				if (x != j)
					seen.push({
						row: cell.row,
						column: x + columnOffset,
						context: 'ROW'
					});
			}

			for (let y = 0; y < rows; ++y) {
				if (y !== i)
					seen.push({
						row: y + rowOffset,
						column: cell.column,
						context: 'COLUMN'
					});
			}
		}

		const regions = editorHistory.getClue('regions');
		regions.forEach((r) => {
			if (r.type === 'Normal' && (r.uniqueDigits ?? !nonstandard)) {
				if (r.positions.some((p) => p.row === cell.row && p.column === cell.column)) {
					r.positions.forEach((p) => {
						if (p.row === cell.row && p.column === cell.column) return;

						seen.push({ row: p.row, column: p.column, context: 'REGION' });
					});
				}
			}
		});

		const settings = get(scannerSettings);
		if (settings.mode !== 'Basic') {
			if (diagonalNeg && settings.scanDiagonals) {
				if (i === j) {
					for (let k = 0; k < rows; ++k) {
						if (k !== i)
							seen.push({
								row: k + rowOffset,
								column: k + columnOffset,
								context: 'DIAGONAL-'
							});
					}
				}
			}
			if (diagonalPos && settings.scanDiagonals) {
				if (i === rows - 1 - j) {
					for (let k = 0; k < rows; ++k) {
						if (k !== i)
							seen.push({
								row: k + rowOffset,
								column: rows - 1 - k + columnOffset,
								context: 'DIAGONAL+'
							});
					}
				}
			}
			if (antiking && settings.scanAntiKing) {
				[-1, 1].forEach((y) => {
					[-1, 1].forEach((x) => {
						if (i + y < 0 || i + y >= rows) return;
						if (j + x < 0 || j + x >= columns) return;

						seen.push({
							row: i + y + rowOffset,
							column: j + x + columnOffset,
							context: 'ANTIKING'
						});
					});
				});
			}
			if (antiknight && settings.scanAntiKnight) {
				[-2, -1, 1, 2].forEach((y) => {
					[-2, -1, 1, -2].forEach((x) => {
						if (Math.abs(y) === Math.abs(x)) return;
						if (i + y < 0 || i + y >= rows) return;
						if (j + x < 0 || j + x >= columns) return;

						seen.push({
							row: i + y + rowOffset,
							column: j + x + columnOffset,
							context: 'ANTIKNIGHT'
						});
					});
				});
			}
			if (disjointsets && settings.scanDisjointSets) {
				for (let m = 0; m < rows / height; ++m) {
					for (let n = 0; m < columns / width; ++n) {
						if (Math.floor(i / height) !== m || Math.floor(j / width) !== n) {
							seen.push({
								row: (i % height) + m * height + rowOffset,
								column: (j % width) + n * width + columnOffset,
								context: 'DISJOINTSET'
							});
						}
					}
				}
			}
			if (settings.scanCages) {
				const cages = editorHistory.getClue('extendedcages');
				cages.forEach((c, n) => {
					if (c.uniqueDigits ?? cageDefaults(c.type ?? 'CUSTOM').uniqueDigits) {
						if (c.positions.some((p) => p.row === cell.row && p.column === cell.column)) {
							c.positions.forEach((p) => {
								if (p.row === cell.row && p.column === cell.column) return;

								seen.push({
									row: p.row,
									column: p.column,
									context: 'CAGE:' + c.type + '[' + n + ']'
								});
							});
						}
					}
				});
			}
			if (settings.scanPaths) {
				const paths = editorHistory.getClue('paths');
				paths.forEach((l, n) => {
					if (l.uniqueDigits ?? pathDefaults(l.type ?? 'CUSTOM').uniqueDigits) {
						if (l.positions.some((p) => p.row === cell.row && p.column === cell.column)) {
							l.positions.forEach((p) => {
								if (p.row === cell.row && p.column === cell.column) return;

								seen.push({
									row: p.row,
									column: p.column,
									context: 'PATH:' + l.type + '[' + n + ']'
								});
							});
						}
					}
				});
			}
			if (settings.scanExtraRegions) {
				regions.forEach((r, n) => {
					if (
						(r.type ?? 'CUSTOM') !== 'Normal' &&
						(r.uniqueDigits ?? regionDefaults(r.type, nonstandard).uniqueDigits)
					) {
						if (r.positions.some((p) => p.row === cell.row && p.column === cell.column)) {
							r.positions.forEach((p) => {
								if (p.row === cell.row && p.column === cell.column) return;

								seen.push({
									row: p.row,
									column: p.column,
									context: 'REGION:' + r.type + '[' + n + ']'
								});
							});
						}
					}
				});
			}
		}

		return seen;
	}

	function getTuples(
		cell: Position,
		seen = true
	): { tuple: string; context: string; cells: Position[] }[] {
		const centermarks = get(gameHistory.getValue('centermarks'));
		if (!seen && centermarks[cell.row][cell.column] === '') return [];

		const tuples: { tuple: string; context: string; cells: Position[] }[] = [];
		const seenCells = getSeenCells(cell);
		let context = '';

		seenCells.forEach((s) => {
			if (s.context !== context) {
				context = s.context;
				const contextCells = seenCells.filter(
					(c) => c.context === context && centermarks[c.row][c.column] !== ''
				);

				if (contextCells.length) {
					if (!seen) {
						contextCells.unshift({ ...cell, context });
					}
					contextCells.sort((a, b) => {
						const atuple = centermarks[a.row][a.column];
						const btuple = centermarks[b.row][b.column];

						if (atuple.length > btuple.length) return seen ? -1 : 1;
						else if (atuple.length < btuple.length) return seen ? 1 : -1;
						else return 0;
					});

					const skipIndexes: number[] = [];
					for (let i = 0; i < contextCells.length; ++i) {
						const c = contextCells[i];
						const tuple = centermarks[c.row][c.column];
						const cells = [c];
						const indexes = [];
						for (let j = seen ? i + 1 : 0; j < contextCells.length; ++j) {
							if (j == i || (seen && skipIndexes.indexOf(j) != -1)) continue;

							const d = contextCells[j];
							if (centermarks[d.row][d.column].split('').every((v) => tuple.indexOf(v) != -1)) {
								cells.push(d);
								indexes.push(j);
							}
						}
						if (cells.length >= tuple.length) {
							if (seen || cells.some((c) => c.row === cell.row && c.column === cell.column)) {
								tuples.push({ tuple, context, cells });
								skipIndexes.push(...indexes);

								if (!seen) break;
							}
						}
					}
				}
			} else {
				return;
			}
		});

		return tuples;
	}

	function getCornerSets(cell: Position, seen = true): { digit: string; cells: Position[] }[] {
		const sets: { digit: string; cells: Position[] }[] = [];

		const regions = editorHistory.getClue('regions');
		const cornermarks = get(gameHistory.getValue('cornermarks'));

		if (seen) {
			const seenCells = getSeenCells(cell);

			seenCells
				.filter((s) => cornermarks[s.row][s.column] !== '')
				.forEach((c) => {
					const regionCells =
						regions
							.find(
								(r) =>
									r.type === 'Normal' &&
									(r.uniqueDigits ?? true) &&
									r.positions.some((p) => p.row === c.row && p.column === c.column)
							)
							?.positions.filter((p) => cornermarks[p.row][p.column] !== '') ?? [];

					cornermarks[c.row][c.column].split('').forEach((v) => {
						const valueCells = regionCells.filter(
							(p) => cornermarks[p.row][p.column].indexOf(v) != -1
						);
						if (
							valueCells.every((q) =>
								seenCells.some((s) => s.row === q.row && s.column === q.column)
							)
						) {
							sets.push({ digit: v, cells: valueCells });
						}
					});
				});
		} else if (cornermarks[cell.row][cell.column] !== '') {
			const regionCells =
				regions
					.find(
						(r) =>
							r.type === 'Normal' &&
							(r.uniqueDigits ?? true) &&
							r.positions.some((p) => p.row === cell.row && p.column === cell.column)
					)
					?.positions.filter((p) => cornermarks[p.row][p.column] !== '') ?? [];

			cornermarks[cell.row][cell.column].split('').forEach((v) => {
				sets.push({
					digit: v,
					cells: regionCells.filter((p) => cornermarks[p.row][p.column].indexOf(v) != -1)
				});
			});
		}

		return sets;
	}

	function getNbrCells(cell: Position): Position[] {
		const dimensions = editorHistory.getClue('dimensions');
		const rowOffset = dimensions.margins?.top ?? 0;
		const columnOffset = dimensions.margins?.left ?? 0;
		const rows = dimensions.rows - rowOffset - (dimensions.margins?.bottom ?? 0);
		const columns = dimensions.columns - columnOffset - (dimensions.margins?.right ?? 0);

		const nbrCells: Position[] = [];

		const i = cell.row - columnOffset;
		const j = cell.column - columnOffset;

		if (i - 1 >= 0) {
			nbrCells.push({
				row: i - 1 + rowOffset,
				column: cell.column
			});
		}
		if (j - 1 >= 0) {
			nbrCells.push({
				row: cell.row,
				column: j - 1 + columnOffset
			});
		}

		if (i + 1 < rows) {
			nbrCells.push({
				row: i + 1 + rowOffset,
				column: cell.column
			});
		}
		if (j + 1 < columns) {
			nbrCells.push({
				row: cell.row,
				column: j + 1
			});
		}

		return nbrCells;
	}

	function updateCandidateValues(cell: Position): boolean {
		const context = get(scannerContext);
		const settings = get(scannerSettings);
		const flags = editorHistory.getClue('logic').flags ?? [];
		const givens = editorHistory.getClue('givens');
		const values = get(gameHistory.getValue('values'));

		const candidateValues = context.candidates[cell.row][cell.column];
		if (candidateValues.length <= 1) return true;

		const highlightedCells: Position[] = [];

		//eliminate any given or filled values that are seen by this cell
		let newCandidateValues = candidateValues.filter((v) => {
			const seenCells = getSeenCells(cell);
			const found = seenCells.find(
				(s) => givens[s.row][s.column] === v || values[s.row][s.column] === v
			);
			if (found) {
				highlightedCells.push(found);
				return false;
			}

			return true;
		});

		if (newCandidateValues.length > 1 && settings.useCentreMarks) {
			//eliminate all values of any tuple seen by this cell
			const tuples = getTuples(cell);
			newCandidateValues = newCandidateValues.filter((v) => {
				const found = tuples.find((t) => t.tuple.indexOf(v) !== -1);
				if (found) {
					highlightedCells.push(...found.cells);
					return false;
				}

				return true;
			});
		}

		if (
			newCandidateValues.length > 1 &&
			!(flags.indexOf('NonStandard') !== -1) &&
			settings.useCornerMarks
		) {
			//if all cells that contain a cornermark within a region for a value are seen by this cell we can eliminate that value
			const sets = getCornerSets(cell);
			newCandidateValues = newCandidateValues.filter((v) => {
				const found = sets.find((s) => s.digit === v);
				if (found) {
					highlightedCells.push(...found.cells);
					return false;
				}

				return true;
			});
		}

		if (newCandidateValues.length > 1 && settings.mode === 'Extreme') {
			//check negative constraints and eliminate any values that would be invalid
			const borderclues = editorHistory.getClue('borderclues');
			const nbrCells = getNbrCells(cell);

			if (
				(flags.indexOf('Nonconsecutive') !== -1 && settings.scanNonConsecutive) ||
				(flags.indexOf('NegativeWhite') !== -1 && settings.scanNegativeKropki)
			) {
				newCandidateValues = newCandidateValues.filter(
					(v) =>
						!nbrCells.some((n) => {
							if (
								flags.indexOf('NegativeWhite') !== -1 &&
								settings.scanNegativeKropki &&
								borderclues.some(
									(c) =>
										c.type === 'KropkiWhite' &&
										c.positions.every(
											(p) =>
												(p.row === cell.row && p.column === cell.column) ||
												(p.row === n.row && p.column === n.column)
										)
								)
							)
								return false;

							let value = givens[n.row][n.column];
							if (value === '') {
								value = values[n.row][n.column];
							}
							if (value !== '') {
								if (Math.abs(parseInt(value) - parseInt(v)) === 1) {
									highlightedCells.push(n);

									return true;
								}
							}

							return false;
						})
				);
			}
			if (flags.indexOf('NegativeBlack') !== -1 && settings.scanNegativeKropki) {
				newCandidateValues = newCandidateValues.filter(
					(v) =>
						!nbrCells.some((n) => {
							if (
								borderclues.some(
									(c) =>
										c.type === 'KropkiBlack' &&
										c.positions.every(
											(p) =>
												(p.row === cell.row && p.column === cell.column) ||
												(p.row === n.row && p.column === n.column)
										)
								)
							)
								return false;

							let value = givens[n.row][n.column];
							if (value === '') {
								value = values[n.row][n.column];
							}
							if (value !== '') {
								if (parseInt(value) === 2 * parseInt(v) || 2 * parseInt(value) === parseInt(v)) {
									highlightedCells.push(n);

									return true;
								}
							}

							return false;
						})
				);
			}
			if (flags.indexOf('NegativeX') !== -1 && settings.scanNegativeXV) {
				newCandidateValues = newCandidateValues.filter(
					(v) =>
						!nbrCells.some((n) => {
							if (
								borderclues.some(
									(c) =>
										c.type === 'XvX' &&
										c.positions.every(
											(p) =>
												(p.row === cell.row && p.column === cell.column) ||
												(p.row === n.row && p.column === n.column)
										)
								)
							)
								return false;

							let value = givens[n.row][n.column];
							if (value === '') {
								value = values[n.row][n.column];
							}
							if (value !== '') {
								if (parseInt(value) + parseInt(v) === 10) {
									highlightedCells.push(n);

									return true;
								}
							}

							return false;
						})
				);
			}
			if (flags.indexOf('NegativeV') !== -1 && settings.scanNegativeXV) {
				newCandidateValues = newCandidateValues.filter(
					(v) =>
						!nbrCells.some((n) => {
							if (
								borderclues.some(
									(c) =>
										c.type === 'XvV' &&
										c.positions.every(
											(p) =>
												(p.row === cell.row && p.column === cell.column) ||
												(p.row === n.row && p.column === n.column)
										)
								)
							)
								return false;

							let value = givens[n.row][n.column];
							if (value === '') {
								value = values[n.row][n.column];
							}
							if (value !== '') {
								if (parseInt(value) + parseInt(v) === 5) {
									highlightedCells.push(n);

									return true;
								}
							}

							return false;
						})
				);
			}
		}

		if (newCandidateValues.length === candidateValues.length) return false;

		context.candidates[cell.row][cell.column] = newCandidateValues;
		context.highlightedCells = highlightedCells;

		return true;
	}

	function step(seed?: Position): boolean {
		if (!isScanning()) {
			initScan(seed);
		}

		const context = get(scannerContext);
		const settings = get(scannerSettings);
		const values = get(gameHistory.getValue('values'));
		const centermarks = get(gameHistory.getValue('centermarks'));
		const cornermarks = get(gameHistory.getValue('cornermarks'));

		//iterate through every cell in the queue in order
		for (let n = 0; n < context.queue.length; ++n) {
			const cell = context.queue[n];
			//if we are not able to eliminate any possible candidate values, move on to the next cell
			if (!updateCandidateValues(cell)) continue;

			let value = '';
			let center: string = centermarks[cell.row][cell.column];
			let corner: string = cornermarks[cell.row][cell.column];

			const candidateValues = context.candidates[cell.row][cell.column];
			if (candidateValues.length <= 1) {
				//update the grid and remove the cell from the scanning queue
				value = candidateValues[0];
				center = '';
				corner = '';

				context.queue.splice(n, 1);
			} else {
				//remove eliminated values from any pencil marks
				if (center !== '') {
					center = candidateValues.join('');
				}
				if (corner !== '') {
					corner = corner
						.split('')
						.filter((u) => candidateValues.some((v) => v === u))
						.join('');
				}
			}

			//update the game history if there are any changes
			if (
				value !== values[cell.row][cell.column] ||
				center !== centermarks[cell.row][cell.column] ||
				corner !== cornermarks[cell.row][cell.column]
			) {
				const newValues = deepCopy(values);
				const newCentermarks = deepCopy(centermarks);
				const newCornermarks = deepCopy(cornermarks);

				newValues[cell.row][cell.column] = value;
				newCentermarks[cell.row][cell.column] = center;
				newCornermarks[cell.row][cell.column] = corner;

				if (corner !== cornermarks[cell.row][cell.column]) {
					//find the set of cornermarks that this cell is part of
					getCornerSets(cell, false).forEach((s) => {
						if (s.digit === value) {
							//remove all cornermarks that match the placed digit
							s.cells.forEach((c) => {
								newCornermarks[c.row][c.column] = '';
							});
						} else if (s.cells.length === 2 && corner.indexOf(s.digit) === -1) {
							//if there is only one possible cornermark for this digit left, set it as the sole candidate value
							s.cells.some((c) => {
								if (c.row !== cell.row || c.column !== cell.column) {
									context.candidates[c.row][c.column] = [s.digit];
									newCentermarks[c.row][c.column] = s.digit;
									newCornermarks[c.row][c.column] = '';
									return true;
								}
								return false;
							});
						}
					});
				}

				gameHistory.set({
					values: newValues,
					centermarks: newCentermarks,
					cornermarks: newCornermarks
				});

				const { highlightedCells, selectedCells } = highlights;

				if (settings.scannerSpeed !== 'Instant') {
					selectedCells.set([cell]);
					highlightedCells.set(context.highlightedCells);
				}

				sortQueue(cell);

				return true;
			}
		}

		return false;
	}

	function startScan(seed?: Position): void {
		if (!isScanning()) {
			if (step(seed)) {
				scanning.set(true);
				nextStep();
			} else {
				scanning.set(false);
			}
		}
	}

	function stopScan(): void {
		if (isScanning()) {
			scanning.set(false);
		}
	}

	function nextStep(): void {
		let delay = 0;
		switch (get(scannerSettings).scannerSpeed) {
			case 'Instant':
				delay = 0;
				break;
			case 'Fast':
				delay = 500;
				break;
			case 'Slow':
				delay = 1000;
				break;
		}
		setTimeout(() => {
			if (get(scanning)) {
				if (!step()) {
					scanning.set(false);
				} else {
					nextStep();
				}
			}
		}, delay);
	}

	function getHighlightedCells(selectedCells: Position[]): Position[] {
		const highlightMode = get(scannerSettings).highlightMode;
		if (highlightMode == 'None') return [];

		let cellsToHighlight: Position[] = [];

		if (highlightMode == 'Seen') {
			selectedCells.forEach((c, i) => {
				const seenCells = getSeenCells(c);
				if (i === 0) {
					seenCells.forEach((p) => {
						if (!cellsToHighlight.some((q) => q.row === p.row && q.column === p.column)) {
							cellsToHighlight.push(p);
						}
					});
				} else {
					cellsToHighlight = cellsToHighlight.filter((p) =>
						seenCells.some((q) => q.row === p.row && q.column === p.column)
					);
				}
			});
		} else if (highlightMode == 'Tuples') {
			const centermarks = get(gameHistory.getValue('centermarks'));
			if (!selectedCells.some((c) => centermarks[c.row][c.column] === '')) {
				let tuples = getTuples(selectedCells[0], false);
				if (selectedCells.length > 1) {
					tuples = tuples.filter((t) =>
						selectedCells.every((c) =>
							t.cells.some((p) => p.row === c.row && p.column === c.column)
						)
					);
				}
				tuples.forEach((t) => {
					const cellsToAdd = t.cells.filter(
						(p) =>
							!selectedCells.some((q) => q.row === p.row && q.column === p.column) &&
							!cellsToHighlight.some((q) => q.row === p.row && q.column === p.column)
					);
					if (cellsToAdd.length) {
						cellsToHighlight = [...cellsToHighlight, ...cellsToAdd];
					}
				});
			}
		}

		return cellsToHighlight;
	}

	function toggleSeen() {
		const settings = get(scannerSettings);
		if (settings.highlightMode !== 'Seen') {
			settings.highlightMode = 'Seen';
		} else {
			settings.highlightMode = 'None';
		}
	}

	function toggleTuples() {
		const settings = get(scannerSettings);
		if (settings.highlightMode !== 'Tuples') {
			settings.highlightMode = 'Tuples';
		} else {
			settings.highlightMode = 'None';
		}
	}

	return {
		configure,
		step,
		startScan,
		stopScan,
		isScanning,
		getHighlightedCells,
		toggleSeen,
		toggleTuples
	};
}
/**
 * The history of editor steps.
 * A field is either the current value, or an index of the last time it changed
 */
export const scanner = createScannerStore();
