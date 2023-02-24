import DiagonalNorthWestToSouthEast from '$icons/symbols/DiagonalNorthWestToSouthEast.svelte';
import Arrow from '$icons/symbols/Arrow.svelte';
import SmallArrow from '$icons/symbols/SmallArrow.svelte';
import Arrowhead from '$icons/symbols/Arrowhead.svelte';
import InvertedArrowhead from '$icons/symbols/InvertedArrowhead.svelte';
import Square from '$icons/shapes/Square.svelte';
import Circle from '$icons/shapes/Circle.svelte';
import Diamond from '$icons/shapes/Diamond.svelte';
import Star from '$icons/shapes/Star.svelte';
import Line from '$icons/shapes/Line.svelte';
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
	Shape,
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

export const pathTypeNames: Record<PathType | 'CUSTOM', string> = {
	AntiFactor: 'Anti-Factor Line',
	Arrow: 'Arrow',
	Between: 'Between Line',
	Entropic: 'Entropic Line',
	EqualSum: 'Region-Sum Line',
	Even: 'Even',
	Lockout: 'Lockout Line',
	Odd: 'Odd',
	Palindrome: 'Palindrome',
	Pill: 'Pill',
	ProductSum: 'Product-Sum Line',
	Renban: 'Renban Line',
	Thermo: 'Thermometer',
	Whisper: 'German Whispers',
	CUSTOM: 'Custom'
};

export const borderClueTypeNames: Record<BorderClueType | 'CUSTOM', string> = {
	Inequality: 'Inequality',
	KropkiBlack: 'Kropki (Black)',
	KropkiWhite: 'Kropki (White)',
	Quadruple: 'Quadruple',
	XvV: 'XV (V)',
	XvX: 'XV (X)',
	Border: 'Border',
	CUSTOM: 'Custom'
};

export const cellClueTypeNames: Record<CellClueType | 'CUSTOM', string> = {
	LittleKillerNE: 'Little Killer (NE)',
	LittleKillerNW: 'Little Killer (NW)',
	LittleKillerSE: 'Little Killer (SE)',
	LittleKillerSW: 'Little Killer (SW)',
	Maximum: 'Maximum',
	Minimum: 'Minimum',
	NumberedRoom: 'Numbered Room',
	Sandwich: 'Sandwich',
	Skyscraper: 'Skyscraper',
	XSum: 'X-Sum',
	CUSTOM: 'Custom'
};

export const symbolTypeNames: Record<SymbolType | 'NONE', string> = {
	Arrow: 'Arrow',
	SmallArrow: 'Arrow (Small)',
	Diagonal: 'Line',
	Arrowhead: 'Chevron',
	InvertedArrowhead: 'Chevron (Inverted)',
	NONE: 'None'
};

export const rotationNames: Record<Rotation, string> = {
	North: 'N',
	NorthEast: 'NE',
	East: 'E',
	SouthEast: 'SE',
	South: 'S',
	SouthWest: 'SW',
	West: 'W',
	NorthWest: 'NW'
};

export const cellClueLocationNames: Record<CellClueLocation, string> = {
	TopLeft: 'Top Left',
	Top: 'Top',
	TopRight: 'Top Right',
	Left: 'Left',
	Center: 'Center',
	Right: 'Right',
	BottomLeft: 'Bottom Left',
	Bottom: 'Bottom',
	BottomRight: 'Bottom Right'
};

export const cellClueSizeNames: Record<CellClueSize, string> = {
	Large: 'L',
	Medium: 'M',
	Small: 'S',
	XSmall: 'XS'
};

export const cageTypeNames: Record<CageType | 'CUSTOM', string> = {
	Killer: 'Killer',
	CUSTOM: 'Custom'
};

export const regionTypeNames: Record<RegionType | 'CUSTOM', string> = {
	Clone: 'Clone',
	Extra: 'Extra',
	MagicSquare: 'Magic Square',
	Normal: 'Normal',
	CUSTOM: 'Custom'
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

export const shapesToIcon: Record<Shape, typeof Circle> = {
	Circle: Circle,
	Square: Square,
	Diamond: Diamond,
	Star: Star,
	Line: Line
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
