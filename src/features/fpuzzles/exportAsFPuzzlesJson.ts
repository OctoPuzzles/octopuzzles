import { editorHistory, gameHistory } from '$stores/sudokuStore';
import type { FPuzzlesJson, HexColor, PositionString } from './model';
import { get } from 'svelte/store';
import deepCopy from '$utils/deepCopy';
import { defaultRegions } from '$utils/defaults';
import { topLeftOfPositions } from '$utils/topLeftOfPositions';
import {
	getBorderCluesToDraw,
	getCellCluesToDraw,
	getPathsToDraw,
	getRegionsToDraw
} from '$utils/prefabs';
import type { Color, Position } from '$models/Sudoku';

export function exportAsFPuzzlesJson(): FPuzzlesJson {
	const givens = editorHistory.getClue('givens');
	const borderClues = editorHistory.getClue('borderclues');
	const cellClues = editorHistory.getClue('cellclues');
	const regions = editorHistory.getClue('regions');
	//const cells = editorHistory.getClue('cells');
	const editorColors = editorHistory.getClue('colors');
	const cages = editorHistory.getClue('extendedcages');
	const paths = editorHistory.getClue('paths');
	const dimensions = editorHistory.getClue('dimensions');
	const logic = editorHistory.getClue('logic');
	const flags = logic.flags ?? [];

	const values = get(gameHistory.getValue('values'));
	const gameColors = get(gameHistory.getValue('colors'));
	const cornermarks = get(gameHistory.getValue('cornermarks'));
	const centermarks = get(gameHistory.getValue('centermarks'));
	//const notes = get(gameHistory.getValue('notes');

	const getPositionString = (position: Position): PositionString => {
		return `R${position.row + 1 - (dimensions.margins?.top ?? 0)}C${
			position.column + 1 - (dimensions.margins?.left ?? 0)
		}`;
	};
	const getPositionStrings = (positions: Position[]): PositionString[] => {
		return positions.map((p) => getPositionString(p));
	};

	const colorToHexColor: Record<Color, HexColor> = {
		Black: '#000000',
		Blue: '#20AFD2',
		LightGray: '#D4D4D8',
		Gray: '#71717A',
		Green: '#76BE36',
		Orange: '#FFA500',
		Purple: '#8127DB',
		Red: '#EE4956',
		White: '#FFFFFF',
		Yellow: '#FACC15'
	};

	const size = Math.max(
		dimensions.rows - (dimensions.margins?.top ?? 0) - (dimensions.margins?.bottom ?? 0),
		dimensions.columns - (dimensions.margins?.left ?? 0) - (dimensions.margins?.right ?? 0)
	);
	const grid = deepCopy(new Array(size).fill(new Array(size).fill({})));

	const fPuzzle: FPuzzlesJson = {
		author: '',
		antiking: flags.indexOf('Antiking') !== -1 ? true : undefined,
		antiknight: flags.indexOf('Antiknight') !== -1 ? true : undefined,
		//author: string,
		'diagonal+': flags.indexOf('DiagonalPos') !== -1 ? true : undefined,
		'diagonal-': flags.indexOf('DiagonalNeg') !== -1 ? true : undefined,
		disjointgroups: flags.indexOf('DisjointSets') !== -1 ? true : undefined,
		grid,
		negative: flags.some((f) => f === 'NegativeBlack' || f === 'NegativeX' || f === 'NegativeV')
			? [
					...(flags.some((f) => f === 'NegativeBlack') ? ['ratio'] : []),
					...(flags.some((f) => f === 'NegativeX') && flags.some((f) => f === 'NegativeV')
						? ['xv']
						: [])
			  ]
			: undefined,
		nonconsecutive: flags.some((f) => f === 'Nonconsecutive' || f === 'NegativeWhite')
			? true
			: undefined,
		ruleset: get(editorHistory.description),
		size,
		'sumdot(intersection)': [],
		title: get(editorHistory.title)
	};

	for (
		let i = dimensions.margins?.top ?? 0;
		i < dimensions.rows - (dimensions.margins?.bottom ?? 0);
		++i
	) {
		for (
			let j = dimensions.margins?.left ?? 0;
			j < dimensions.columns - (dimensions.margins?.right ?? 0);
			++j
		) {
			const gridRow = i - (dimensions.margins?.top ?? 0);
			const gridColumn = j - (dimensions.margins?.top ?? 0);
			if (givens[i][j] !== '') {
				fPuzzle.grid[gridRow][gridColumn].value = parseInt(givens[i][j]);
				fPuzzle.grid[gridRow][gridColumn].given = true;
			}
			if (flags.some((f) => f === 'Indexed159') && (j === 0 || j === 4 || j === 8)) {
				fPuzzle.grid[gridRow][gridColumn].c = colorToHexColor.Red;
			}
			if (editorColors[i][j] !== null) {
				fPuzzle.grid[gridRow][gridColumn].c = colorToHexColor[editorColors[i][j] as Color];
			}
			if (values[i][j] !== '') {
				fPuzzle.grid[gridRow][gridColumn].value = parseInt(values[i][j]);
			}
			if (gameColors[i][j].length !== 0) {
				fPuzzle.grid[gridRow][gridColumn].highlight = colorToHexColor[gameColors[i][j][0] as Color];
			}
			if (cornermarks[i][j] !== '') {
				fPuzzle.grid[gridRow][gridColumn].cornerPencilMarks = cornermarks[i][j]
					.split('')
					.map((m) => parseInt(m));
			}
			if (centermarks[i][j] !== '') {
				fPuzzle.grid[gridRow][gridColumn].centerPencilMarks = centermarks[i][j]
					.split('')
					.map((m) => parseInt(m));
			}
		}
	}

	const handledRegions: number[] = [];
	const defaultNormalRegions = defaultRegions(dimensions);
	let regionNumber = 0;
	regions.forEach((r, i) => {
		if (handledRegions.indexOf(i) !== -1) return;

		switch (r.type) {
			case 'Normal': {
				r.positions.forEach((p) => {
					if (
						!defaultNormalRegions[regionNumber]?.positions.some(
							(q) => q.row === p.row && q.column === p.column
						)
					) {
						fPuzzle.grid[p.row - (dimensions.margins?.top ?? 0)][
							p.column - (dimensions.margins?.left ?? 0)
						].region = regionNumber;
					}
				});
				++regionNumber;
				return;
			}
			case 'Extra': {
				const extraRegion = fPuzzle.extraregion ?? (fPuzzle.extraregion = []);
				extraRegion.push({ cells: getPositionStrings(r.positions) });
				return;
			}
			case 'Clone': {
				const clone = fPuzzle.clone ?? (fPuzzle.clone = []);

				const topLeftR = topLeftOfPositions(r.positions);
				regions.forEach((s, j) => {
					if (j > i && handledRegions.indexOf(j) === -1) {
						if (s.color === r.color && s.positions.length === r.positions.length) {
							const topLeftS = topLeftOfPositions(s.positions);
							const rowOffset = topLeftS.row - topLeftR.row;
							const columnOffset = topLeftS.column - topLeftR.column;

							if (
								r.positions.every((p) =>
									s.positions.some(
										(q) => p.row === q.row - rowOffset && p.column === q.column - columnOffset
									)
								)
							) {
								clone.push({
									cells: getPositionStrings(r.positions),
									cloneCells: getPositionStrings(s.positions)
								});
								handledRegions.push(j);
							}
						}
					}
				});
				return;
			}
		}

		getRegionsToDraw(r).forEach((s) => {
			if (s.color) {
				s.positions.forEach((p) => {
					fPuzzle.grid[p.row - (dimensions.margins?.top ?? 0)][
						p.column - (dimensions.margins?.left ?? 0)
					].c = colorToHexColor[s.color as Color];
				});
			}
		});
	});

	const handledPaths: number[] = [];
	paths.forEach((p, i) => {
		if (handledPaths.indexOf(i) !== -1) return;

		switch (p.type) {
			case 'Arrow': {
				const arrow = fPuzzle.arrow ?? (fPuzzle.arrow = []);

				const pillIndex = paths.findIndex(
					(q, j) =>
						j > i &&
						q.type === 'Pill' &&
						q.positions.some(
							(c) => c.row === p.positions[0].row && c.column === p.positions[0].column
						)
				);

				arrow.push({
					cells:
						pillIndex !== -1
							? getPositionStrings(paths[pillIndex].positions)
							: [getPositionString(p.positions[0])],
					lines: p.positions.length > 1 ? [getPositionStrings(p.positions)] : []
				});

				if (pillIndex !== -1) {
					handledPaths.push(pillIndex);
				}
				return;
			}
			case 'Pill': {
				const arrow = fPuzzle.arrow ?? (fPuzzle.arrow = []);

				arrow.push({ cells: getPositionStrings(p.positions), lines: [] });
				return;
			}
			case 'Thermo': {
				const thermometer = fPuzzle.thermometer ?? (fPuzzle.thermometer = []);
				thermometer.push({ lines: [getPositionStrings(p.positions)] });
				return;
			}
			case 'Between': {
				const betweenline = fPuzzle.betweenline ?? (fPuzzle.betweenline = []);
				betweenline.push({ lines: [getPositionStrings(p.positions)] });
				return;
			}
			case 'Renban': {
				const renban = fPuzzle.renban ?? (fPuzzle.renban = []);
				renban.push({ lines: [getPositionStrings(p.positions)] });
				break;
			}
			case 'Whisper': {
				const whispers = fPuzzle.whispers ?? (fPuzzle.whispers = []);
				whispers.push({ lines: [getPositionStrings(p.positions)] });
				break;
			}
			case 'Palindrome': {
				const palindrome = fPuzzle.palindrome ?? (fPuzzle.palindrome = []);
				palindrome.push({ lines: [getPositionStrings(p.positions)] });
				return;
			}
			case 'EqualSum': {
				const regionSumLine = fPuzzle.regionSumLine ?? (fPuzzle.regionSumLine = []);
				regionSumLine.push({ lines: [getPositionStrings(p.positions)] });
				break;
			}
			case 'Odd': {
				if (p.positions.length === 1) {
					const odd = fPuzzle.odd ?? (fPuzzle.odd = []);
					odd.push({ cell: getPositionString(p.positions[0]) });
					return;
				}
				break;
			}
			case 'Even': {
				if (p.positions.length === 1) {
					const even = fPuzzle.even ?? (fPuzzle.even = []);
					even.push({ cell: getPositionString(p.positions[0]) });
					return;
				}
				break;
			}
		}

		getPathsToDraw(p).forEach((q) => {
			if (q.positions.length > 1) {
				const line = fPuzzle.line ?? (fPuzzle.line = []);
				line.push({
					outlineC: colorToHexColor[q.color ?? 'Black'],
					lines: [getPositionStrings(q.positions)],
					width: (q.width ?? 10) / 50
				});
			} else if (q.form === 'Round') {
				const circle = fPuzzle.circle ?? (fPuzzle.circle = []);
				circle.push({
					baseC: colorToHexColor[q.fill === 'Solid' ? q.color ?? 'Black' : 'White'],
					fontC: colorToHexColor.Black,
					outlineC: colorToHexColor[q.color ?? 'Black'],
					height: (q.width ?? 10) / 100,
					width: (q.width ?? 10) / 100,
					cells: getPositionStrings(q.positions)
					//value:
				});
			} else {
				const rectangle = fPuzzle.rectangle ?? (fPuzzle.rectangle = []);
				rectangle.push({
					baseC: colorToHexColor[q.fill === 'Solid' ? q.color ?? 'Black' : 'White'],
					fontC: colorToHexColor.Black,
					outlineC: colorToHexColor[q.color ?? 'Black'],
					height: (q.width ?? 10) / (q.form === 'Diamond' ? 141.4 : 100),
					width: (q.width ?? 10) / (q.form === 'Diamond' ? 141.4 : 100),
					cells: getPositionStrings(q.positions),
					angle: q.form === 'Diamond' ? 45 : undefined
					//value:
				});
			}
		});
	});

	borderClues.forEach((c) => {
		const minRow = Math.min(c.positions[0].row, c.positions[1].row);
		const maxRow = Math.max(c.positions[0].row, c.positions[1].row);
		const minColumn = Math.min(c.positions[0].column, c.positions[1].column);
		const maxColumn = Math.max(c.positions[0].column, c.positions[1].column);

		const cells =
			minRow !== maxRow && minColumn !== maxColumn
				? getPositionStrings([
						{ row: minRow, column: minColumn },
						{ row: minRow, column: maxColumn },
						{ row: maxRow, column: minColumn },
						{ row: maxRow, column: maxColumn }
				  ])
				: getPositionStrings(c.positions);

		switch (c.type) {
			case 'KropkiWhite': {
				if (cells.length === 2) {
					const difference = fPuzzle.difference ?? (fPuzzle.difference = []);
					difference.push({
						cells: cells as [PositionString, PositionString],
						value: c.text ?? undefined
					});
					return;
				}
				break;
			}
			case 'KropkiBlack': {
				if (cells.length === 2) {
					const ratio = fPuzzle.ratio ?? (fPuzzle.ratio = []);
					ratio.push({
						cells: cells as [PositionString, PositionString],
						value: c.text ?? undefined
					});
					return;
				}
				break;
			}
			case 'XvX':
			case 'XvV': {
				if (cells.length === 2) {
					const xv = fPuzzle.xv ?? (fPuzzle.xv = []);
					xv.push({
						cells: cells as [PositionString, PositionString],
						value: (c.text as 'X' | 'V') ?? undefined
					});
					return;
				}
				break;
			}
			case 'Quadruple': {
				if (cells.length === 4) {
					const quadruple = fPuzzle.quadruple ?? (fPuzzle.quadruple = []);
					quadruple.push({
						cells: cells as [PositionString, PositionString, PositionString, PositionString],
						values: c.text ? c.text.split(',').map((v) => parseFloat(v)) : []
					});
					return;
				}
				break;
			}
		}

		getBorderCluesToDraw(c).forEach((d) => {
			if (d.shape === 'Circle') {
				const circle = fPuzzle.circle ?? (fPuzzle.circle = []);
				circle.push({
					baseC: colorToHexColor[d.color ?? 'White'],
					fontC: colorToHexColor.Black,
					outlineC: colorToHexColor[d.color ? 'Black' : 'White'],
					height: (d.radius ?? 10) / 50,
					width: (d.radius ?? 10) / 50,
					cells,
					value: d.text ?? undefined
				});
			} else if (d.shape === 'Star') {
				const text = fPuzzle.text ?? (fPuzzle.text = []);
				text.push({
					fontC: colorToHexColor[d.color ?? 'Black'],
					size: (d.radius ?? 10) / 25,
					value: '\u2605',
					cells
					//angle:
				});
				if (d.text) {
					text.push({
						fontC: colorToHexColor.Black,
						size: (d.radius ?? 10) / 50,
						value: d.text,
						cells
						//angle:
					});
				}
			} else {
				const rectangle = fPuzzle.rectangle ?? (fPuzzle.rectangle = []);

				let angle: number | undefined;
				if (d.shape === 'Diamond') {
					angle = 45;
				} else if (d.shape === 'Line') {
					if (minRow === maxRow) {
						angle = 90;
					} else if (minColumn !== maxColumn) {
						if (d.positions[0].column < d.positions[1].column) {
							angle = d.positions[0].row < d.positions[1].row ? -45 : 45;
						} else {
							angle = d.positions[0].row < d.positions[1].row ? 45 : -45;
						}
					}
				}

				rectangle.push({
					baseC: colorToHexColor[d.color ?? 'White'],
					fontC: colorToHexColor.Black,
					outlineC: colorToHexColor[d.color ? (d.shape === 'Line' ? d.color : 'Black') : 'White'],
					height: d.shape === 'Line' ? 0.05 : (d.radius ?? 10) / 50,
					width: (d.radius ?? 10) / 50,
					cells,
					angle,
					value: d.text ?? undefined
				});
			}
		});
	});

	cellClues.forEach((c) => {
		switch (c.type) {
			case 'Maximum': {
				const maximum = fPuzzle.maximum ?? (fPuzzle.maximum = []);
				maximum.push({ cell: getPositionString(c.position) });
				return;
			}
			case 'Minimum': {
				const minimum = fPuzzle.minimum ?? (fPuzzle.minimum = []);
				minimum.push({ cell: getPositionString(c.position) });
				return;
			}
			case 'LittleKillerNE':
			case 'LittleKillerNW':
			case 'LittleKillerSE':
			case 'LittleKillerSW': {
				const littlekillersum = fPuzzle.littlekillersum ?? (fPuzzle.littlekillersum = []);

				let direction: 'UL' | 'UR' | 'DL' | 'DR';
				switch (c.type) {
					case 'LittleKillerNE':
						direction = 'UR';
						break;
					case 'LittleKillerNW':
						direction = 'UL';
						break;
					case 'LittleKillerSE':
						direction = 'DR';
						break;
					case 'LittleKillerSW':
						direction = 'DL';
						break;
				}

				/*TODO*/
				const cells: PositionString[] = [];

				littlekillersum.push({
					cell: getPositionString(c.position),
					cells,
					direction,
					value: c.text ?? undefined
				});
				return;
			}
			case 'Sandwich': {
				const sandwichsum = fPuzzle.sandwichsum ?? (fPuzzle.sandwichsum = []);
				sandwichsum.push({ cell: getPositionString(c.position), value: c.text ?? undefined });
				return;
			}
		}

		getCellCluesToDraw(c).forEach((d) => {
			if (d.text) {
				const text = fPuzzle.text ?? (fPuzzle.text = []);

				let size: number;
				switch (d.size) {
					case 'XSmall':
						size = 0.1;
						break;
					case 'Small':
						size = 0.25;
						break;
					case 'Medium':
						size = 0.5;
						break;
					default:
						size = 1.0;
						break;
				}

				text.push({
					fontC: colorToHexColor[d.color ?? 'Black'],
					size,
					value: d.text,
					cells: [getPositionString(d.position)]
					//angle:
				});
			}
		});
	});

	cages.forEach((c) => {
		switch (c.type) {
			case 'Killer': {
				const killercage = fPuzzle.killercage ?? (fPuzzle.killercage = []);
				killercage.push({ cells: getPositionStrings(c.positions), value: c.text ?? undefined });
				return;
			}
		}

		const cage = fPuzzle.cage ?? (fPuzzle.cage = []);
		cage.push({
			cells: getPositionStrings(c.positions),
			fontC: colorToHexColor[c.color ?? 'Black'],
			outlineC: colorToHexColor[c.color ?? 'Black'],
			value: c.text ?? ''
		});
	});

	return fPuzzle;
}
