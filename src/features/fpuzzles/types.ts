export type HexColor = `#${string}`;
export type PositionString = `R${number}C${number}`;

export type FPuzzlesJson = {
	antiking?: boolean;
	antiknight?: boolean;
	arrow?: { cells: PositionString[]; lines: PositionString[][] }[];
	author: string;
	betweenline?: { lines: PositionString[][] }[];
	cage?: { cells: PositionString[]; fontC: HexColor; outlineC: HexColor; value: string }[];
	circle?: {
		baseC: HexColor;
		fontC: HexColor;
		outlineC: HexColor;
		height: number;
		width: number;
		/** Two if between cells, one if on cell, four if between four cells */
		cells: PositionString[];
		value?: string;
	}[];
	clock?: { lines: PositionString[][] }[];
	clone?: { cells: PositionString[]; cloneCells: PositionString[] }[];
	/** Diagonal from bottomleft to top right */
	'diagonal+'?: boolean;
	/** Diagonal from top left to bottom right */
	'diagonal-'?: boolean;
	/** White kropki. If value is given, that is what the difference should be */
	difference?: { cells: [PositionString, PositionString]; value?: string }[];
	disabledlogic?: string[];
	disjointgroups?: boolean;
	even?: { cell: PositionString }[];
	extraregion?: { cells: PositionString[] }[];
	grid: {
		c?: HexColor;
		value?: number;
		given?: boolean;
		region?: number;
		centerPencilMarks?: number[];
		cornerPencilMarks?: number[];
		highlight?: HexColor;
		givenPencilMarks?: number[];
		candidates?: number[];
	}[][];
	killercage?: { cells: PositionString[]; value?: string }[];
	line?: {
		outlineC: HexColor;
		lines: PositionString[][];
		width: number;
		fromConstraint?: string;
		isNewConstraint?: boolean;
		isClockConstraint?: boolean;
	}[];
	littlekillersum?: {
		cell: PositionString;
		cells: PositionString[];
		direction: 'DR' | 'DL' | 'UR' | 'UL';
		value?: string;
	}[];
	/** the cell is the maximum of all surrounding cells */
	maximum?: { cell: PositionString }[];
	/** the cell is the minimum of all surrounding cells */
	minimum?: { cell: PositionString }[];
	negative?: string[];
	nonconsecutive?: boolean;
	odd?: { cell: PositionString }[];
	palindrome?: { lines: PositionString[][] }[];
	quadruple?: {
		cells: [PositionString, PositionString, PositionString, PositionString];
		values: number[];
	}[];
	/** Black kropki dots */
	ratio?: { cells: [PositionString, PositionString]; value?: string }[];
	rectangle?: {
		baseC: HexColor;
		fontC: HexColor;
		outlineC: HexColor;
		height: number;
		width: number;
		cells: PositionString[];
		angle?: number;
		value?: string;
	}[];
	regionSumLine?: { lines: PositionString[][] }[];
	renban?: { lines: PositionString[][] }[];
	ruleset: string;
	sandwichsum?: { cell: PositionString; value?: string }[];
	size: number;
	solution?: number[];
	/** A borderclue with a diamond around it */
	'sumdot(intersection)': { cells: PositionString[]; value: string }[];
	text?: {
		fontC: HexColor;
		size: number;
		value: string;
		cells: PositionString[];
		/** degrees */
		angle?: number;
	}[];
	/** first of the lines are the bulb */
	thermometer?: { lines: PositionString[][] }[];
	title?: string;
	/**
	 * e.g. ["colored"]
	 */
	truecandidatesoptions?: string[];
	whispers?: { lines: PositionString[][] }[];
	xv?: { cells: [PositionString, PositionString]; value?: 'X' | 'V' }[];
};
