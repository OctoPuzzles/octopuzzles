import DiagonalNorthWestToSouthEast from '$icons/symbols/DiagonalNorthWestToSouthEast.svelte';
import Arrow from '$icons/symbols/Arrow.svelte';
import SmallArrow from '$icons/symbols/SmallArrow.svelte';
import Arrowhead from '$icons/symbols/Arrowhead.svelte';
import InvertedArrowhead from '$icons/symbols/InvertedArrowhead.svelte';
import type {
	BorderClueType,
	CageType,
	CellClueLocation,
	CellClueSize,
	CellClueType,
	Color,
	LogicFlag,
	PathType,
	RegionType,
	Rotation,
	SymbolType
} from '$models/Sudoku';

export const cellSize = 64;

export const colors: Color[] = [
	'Black',
	'White',
	'LightGray',
	'Gray',
	'Red',
	'Yellow',
	'Green',
	'Blue',
	'Orange',
	'Purple'
];

export const numberColorMap: Record<number, Color> = {
	1: 'LightGray',
	2: 'Gray',
	3: 'Black',
	4: 'Red',
	5: 'Yellow',
	6: 'Green',
	7: 'Blue',
	8: 'Orange',
	9: 'Purple',
	0: 'White'
};

export const symbolsMap: Record<SymbolType, typeof DiagonalNorthWestToSouthEast> = {
	Diagonal: DiagonalNorthWestToSouthEast,
	Arrow: Arrow,
	SmallArrow: SmallArrow,
	Arrowhead: Arrowhead,
	InvertedArrowhead: InvertedArrowhead
};

export const rotationsToDegree: Record<Rotation, number> = {
	North: 0,
	NorthEast: 45,
	East: 90,
	SouthEast: 135,
	South: 180,
	SouthWest: 225,
	West: 270,
	NorthWest: 315
};

export const logicFlagNames: Record<LogicFlag, string> = {
	Antiking: 'Anti-king',
	Antiknight: 'Anti-knight',
	DiagonalNeg: 'Diagonal (-)',
	DiagonalPos: 'Diagonal (+)',
	DisjointSets: 'Disjoint Sets',
	Entropy: 'Entropy',
	Indexed159: 'Indexed 159',
	NegativeBlack: 'Negative Constraint: Black Dots',
	NegativeV: 'Negative Constraint: Vs',
	NegativeWhite: 'Negative Constraint: White Dots',
	NegativeX: 'Negative Constraint: Xs',
	Nonconsecutive: 'Non-Consecutive',
	NonStandard: 'Non-Standard',
	SCells: 'S-Cells'
};

export const isFrameCellClue: Record<CellClueType, boolean> = {
	LittleKillerNE: true,
	LittleKillerNW: true,
	LittleKillerSE: true,
	LittleKillerSW: true,
	Maximum: false,
	Minimum: false,
	NumberedRoom: true,
	Sandwich: true,
	Skyscraper: true,
	XSum: true
};

export const pathTypesToLabel: Record<PathType, string> = {
	AntiFactor: 'Anti-Factor Lines',
	Arrow: 'Arrow',
	Between: 'Between Lines',
	Entropic: 'Entropic Lines',
	EqualSum: 'Region-Sum Lines',
	Even: 'Odd/Even',
	Lockout: 'Lockout Lines',
	Odd: 'Odd/Even',
	Palindrome: 'Palindrome',
	ProductSum: 'Product-Sum Lines',
	Pill: 'Arrow',
	Renban: 'Renban',
	Thermo: 'Thermo',
	Whisper: 'German Whispers'
};

export const borderClueTypesToLabel: Record<BorderClueType, string> = {
	Inequality: 'Inequalities',
	KropkiBlack: 'Kropki',
	KropkiWhite: 'Kropki',
	Quadruple: 'Quadruple',
	XvV: 'XV ',
	XvX: 'XV',
	Border: ''
};

export const cellClueTypesToLabel: Record<CellClueType, string> = {
	LittleKillerNE: 'Little Killer',
	LittleKillerNW: 'Little Killer',
	LittleKillerSE: 'Little Killer',
	LittleKillerSW: 'Little Killer',
	Maximum: 'Min/Max',
	Minimum: 'Min/Max',
	NumberedRoom: 'Numbered Rooms',
	Sandwich: 'Sandwich',
	Skyscraper: 'Skyscraper',
	XSum: 'X-Sums'
};

export const cageTypesToLabel: Record<CageType, string> = {
	Killer: 'Killer'
};

export const regionTypesToLabel: Record<RegionType, string> = {
	Clone: 'Clone',
	Extra: 'Extra Region',
	MagicSquare: 'Magic Square',
	Normal: 'Irregular'
};

export const logicFlagsToLabel: Record<LogicFlag, string> = {
	Antiking: 'Anti-King',
	Antiknight: 'Anti-Knight',
	DiagonalNeg: 'Diagonal',
	DiagonalPos: 'Diagonal',
	DisjointSets: 'Disjoint Sets',
	Entropy: 'Entropy',
	Indexed159: '159',
	NegativeBlack: 'Kropki',
	NegativeV: 'XV',
	NegativeWhite: 'Kropki',
	NegativeX: 'XV',
	Nonconsecutive: 'Non-Consecutive',
	NonStandard: '',
	SCells: 'S-Cells'
};
