import type {
  Borderclues,
  CellData,
  Cellclues,
  Dimensions,
  EditorHistoryStep,
  Extendedcages,
  GameHistoryStep,
  Logic,
  Paths,
  Position,
  Regions
} from '@octopuzzles/models';
import { deepCopy } from '@octopuzzles/utils';

export const defaultRegionSize = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
): { width: number; height: number } => {
  const offsets = dimensions.margins ?? { left: 0, right: 0, top: 0, bottom: 0 };
  const rows = dimensions.rows - offsets.top - offsets.bottom;
  const columns = dimensions.columns - offsets.left - offsets.right;

  let width = columns,
    height = 0;
  if (rows === columns) {
    if (rows === 4) {
      width = height = 2;
    } else if (rows === 6) {
      width = 3;
      height = 2;
    } else if (rows === 8) {
      width = 4;
      height = 2;
    } else if (rows === 9) {
      width = height = 3;
    } else if (rows === 10) {
      width = 5;
      height = 2;
    } else if (rows === 12) {
      width = 4;
      height = 3;
    } else if (rows === 14) {
      width = 7;
      height = 2;
    } else if (rows === 15) {
      width = 5;
      height = 3;
    } else if (rows === 16) {
      width = height = 4;
    } else if (rows === 18) {
      width = 6;
      height = 3;
    } else if (rows === 20) {
      width = 5;
      height = 4;
    } else if (rows === 21) {
      width = 7;
      height = 3;
    } else if (rows === 22) {
      width = 11;
      height = 2;
    } else if (rows === 24) {
      width = 6;
      height = 4;
    } else if (rows === 25) {
      width = height = 5;
    } else if (rows === 26) {
      width = 13;
      height = 2;
    } else {
      width = columns;
      height = 1;
    }
  }

  return { width, height };
};

export const defaultRegions = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
): Regions => {
  const offsets = dimensions.margins ?? { left: 0, right: 0, top: 0, bottom: 0 };
  const rows = dimensions.rows - offsets.top - offsets.bottom;
  const columns = dimensions.columns - offsets.left - offsets.right;

  const { width, height } = defaultRegionSize(dimensions);

  const regions: Regions = [];
  if (width !== 0 && height !== 0) {
    for (let j = 0; j < rows / height; ++j) {
      for (let i = 0; i < columns / width; ++i) {
        const positions: Position[] = [];
        for (let c = 0; c < width; ++c) {
          for (let r = 0; r < height; ++r) {
            positions.push({
              row: offsets.top + r + j * height,
              column: offsets.left + c + i * width
            });
          }
        }
        regions.push({
          positions,
          type: 'Normal',
          borders: undefined,
          color: undefined,
          uniqueDigits: undefined
        });
      }
    }
  }

  return regions;
};

function defaultItem<T>(
  value: T,
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
): T[][] {
  return Array(dimensions.rows).fill(Array(dimensions.columns).fill(deepCopy(value)));
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const defaultEditorColors = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
) => defaultItem(null, dimensions);
export const defaultCells = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
) => {
  let defaults = defaultItem((dimensions.margins ?? 0) == 0, dimensions);
  if (dimensions.margins) {
    defaults = deepCopy(defaults);
    for (let i = dimensions.margins.top; i < dimensions.rows - dimensions.margins.bottom; ++i) {
      for (
        let j = dimensions.margins.left;
        j < dimensions.columns - dimensions.margins.right;
        ++j
      ) {
        defaults[i][j] = true;
      }
    }
  }
  return defaults;
};
export const defaultGivens = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
) => defaultItem('', dimensions);
export const defaultCellValues = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
) => defaultItem({} as CellData, dimensions);
export const defaultNotes = (
  dimensions: Dimensions = { rows: 9, columns: 9, margins: undefined }
) => defaultItem('', dimensions);
export const defaultCages = (): Extendedcages => [];
export const defaultBorderclues = (): Borderclues => [];
export const defaultCellclues = (): Cellclues => [];
export const defaultPaths = (): Paths => [];

export const defaultLogic = (): Logic => {
  return { digits: undefined, flags: undefined };
};

export const defaultClues = (): EditorHistoryStep => {
  return {
    givens: defaultGivens(),
    extendedcages: defaultCages(),
    colors: defaultEditorColors(),
    paths: defaultPaths(),
    borderclues: defaultBorderclues(),
    cellclues: defaultCellclues(),
    dimensions: { rows: 9, columns: 9, margins: undefined },
    cells: defaultCells(),
    regions: defaultRegions(),
    logic: defaultLogic()
  };
};

export const defaultGameData = (dimensions?: Dimensions): GameHistoryStep => {
  return {
    cellValues: defaultCellValues(dimensions),
    notes: defaultNotes(dimensions)
  };
};
