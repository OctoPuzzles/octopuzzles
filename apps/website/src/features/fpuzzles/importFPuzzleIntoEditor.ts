import { editorHistory, gameHistory } from '$stores/sudokuStore';
import { closestColor } from './closestColor';
import type { FPuzzlesJson, PositionString } from './types';
import { deepCopy } from '@octopuzzles/utils';
import { positionStringToPosition as _positionStringToPosition } from '$utils/positionStringToPositions';
import {
  defaultBorderclues,
  defaultCages,
  defaultCellclues,
  defaultCells,
  defaultCentermarks,
  defaultCornermarks,
  defaultEditorColors,
  defaultGameColors,
  defaultGivens,
  defaultLogic,
  defaultNotes,
  defaultPaths,
  defaultRegions,
  defaultRegionSize,
  defaultValues
} from '@octopuzzles/sudoku-utils';
import {
  emptyBorderClue,
  emptyCage,
  emptyCellClue,
  emptyPath,
  emptyRegion
} from '@octopuzzles/sudoku-utils';
import type {
  BorderClueType,
  CellClueSize,
  CellClueType,
  Dimensions,
  Position,
  Region
} from '@octopuzzles/models';
import type { EditorHistoryStep, GameHistoryStep } from '$types';

type Handlers<T> = {
  [Property in keyof T]-?: (object: NonNullable<T[Property]>) => void;
};

function getDimensions(fpuzzle: FPuzzlesJson): Dimensions {
  const dimensions: { -readonly [P in keyof Dimensions]: Dimensions[P] } = {
    rows: fpuzzle.size,
    columns: fpuzzle.size,
    margins: undefined
  };

  const cells: PositionString[] = [];
  if (fpuzzle.text) {
    cells.push(...fpuzzle.text.map((t) => t.cells).flat());
  }
  if (fpuzzle.littlekillersum) {
    cells.push(...fpuzzle.littlekillersum.map((l) => l.cell));
  }
  if (fpuzzle.sandwichsum) {
    cells.push(...fpuzzle.sandwichsum.map((l) => l.cell));
  }

  if (cells.length > 0) {
    let minRow = 1;
    let minColumn = 1;
    let maxRow = fpuzzle.size;
    let maxColumn = fpuzzle.size;
    // we add 1 to use f-puzzles ways of representing positions
    // This undoes the subtraction we do in the function
    const positions = _positionStringToPosition(cells).map((p) => ({
      row: p.row + 1,
      column: p.column + 1
    }));
    for (const position of positions) {
      if (position.row < minRow) minRow = position.row;
      if (position.column < minColumn) minColumn = position.column;
      if (position.row > maxRow) maxRow = position.row;
      if (position.column > maxColumn) maxColumn = position.column;
    }
    dimensions.rows = Math.max(fpuzzle.size, maxRow - minRow + 1);
    dimensions.columns = Math.max(fpuzzle.size, maxColumn - minColumn + 1);
    dimensions.margins = {
      left: 1 - minColumn,
      right: maxColumn - fpuzzle.size,
      top: 1 - minRow,
      bottom: maxRow - fpuzzle.size
    };
  }
  return dimensions;
}

function regionsForFPuzzle(dimensions: Dimensions, grid: FPuzzlesJson['grid']): Region[] {
  if (grid.every((row) => row.every((cell) => cell.region == null))) {
    // No regions, so
    // Do ordinary borders, but shift it by the offset
    return defaultRegions(dimensions);
  }

  // This is an irregular grid

  const offsets = dimensions.margins ?? { left: 0, right: 0, top: 0, bottom: 0 };
  const gridSize = dimensions.rows - offsets.top - offsets.bottom;
  const { width, height } = defaultRegionSize({
    rows: gridSize,
    columns: gridSize,
    margins: undefined
  });

  // First get the regions
  const regionNos: number[][] = [];
  grid.forEach((row, rowIndex) => {
    regionNos.push(
      row.map((cell, columnIndex) =>
        // If a region is not specified, it is the default region
        cell.region !== undefined
          ? cell.region + 1
          : Math.ceil((columnIndex + 1) / width) +
            (gridSize / width) * Math.floor(rowIndex / height)
      )
    );
  });

  const regions: { -readonly [P in keyof Region]: Region[P] }[] = new Array(gridSize);

  // Now add the borders between regions
  regionNos.forEach((row, rowIndex) => {
    row.forEach((regionNo, columnIndex) => {
      let region = regions[regionNo - 1];
      if (region == null) {
        const newRegion: Region = {
          positions: [],
          type: 'Normal',
          borders: undefined,
          color: undefined,
          uniqueDigits: undefined
        };
        regions[regionNo - 1] = newRegion;
        region = newRegion;
      }
      region.positions.push({ row: rowIndex + offsets.top, column: columnIndex + offsets.left });
    });
  });

  return regions;
}

export function importFPuzzleIntoEditorHistory(fpuzzle: FPuzzlesJson): void {
  const dim = getDimensions(fpuzzle);
  const offsets = dim.margins ?? { left: 0, right: 0, top: 0, bottom: 0 };
  const positionFromStringPosition = (position: PositionString): Position => {
    const p = _positionStringToPosition(position);
    return { row: p.row + offsets.top, column: p.column + offsets.left };
  };
  const positionsFromStringPositions = (positions: PositionString[]): Position[] => {
    const ps = _positionStringToPosition(positions);
    return ps.map((p) => ({
      row: p.row + offsets.top,
      column: p.column + offsets.left
    }));
  };

  const newEditorHistory: EditorHistoryStep = {
    givens: defaultGivens(dim),
    extendedcages: defaultCages(),
    colors: defaultEditorColors(dim),
    paths: defaultPaths(),
    borderclues: defaultBorderclues(),
    cellclues: defaultCellclues(),
    dimensions: dim,
    cells: defaultCells(dim),
    regions: regionsForFPuzzle(dim, fpuzzle.grid),
    logic: defaultLogic()
  };
  const newGameHistory: GameHistoryStep = {
    values: defaultValues(dim),
    colors: defaultGameColors(dim),
    cornermarks: defaultCornermarks(dim),
    centermarks: defaultCentermarks(dim),
    notes: defaultNotes(dim)
  };

  /* eslint-disable @typescript-eslint/no-empty-function */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handlers: Handlers<FPuzzlesJson> = {
    // This is handled before all this
    size: () => {},
    'diagonal+': (hasDiagonal) => {
      if (!hasDiagonal) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      newFlags.push('DiagonalPos');
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    'diagonal-': (hasDiagonal) => {
      if (!hasDiagonal) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      newFlags.push('DiagonalNeg');
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    antiking: (hasAntiking) => {
      if (!hasAntiking) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      newFlags.push('Antiking');
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    antiknight: (hasAntiknight) => {
      if (!hasAntiknight) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      newFlags.push('Antiknight');
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    title: (title) => {
      editorHistory.title.set(title);
    },
    ruleset: (newRuleset) => {
      editorHistory.description.set(newRuleset);
    },
    killercage: (fpuzzlesKillerCages) => {
      const newCages = deepCopy(newEditorHistory.extendedcages);
      for (const fpuzzleKillerCage of fpuzzlesKillerCages) {
        const positions = positionsFromStringPositions(fpuzzleKillerCage.cells);
        newCages.push({
          ...emptyCage(positions, 'Killer'),
          text: fpuzzleKillerCage.value ?? undefined
        });
      }
      newEditorHistory.extendedcages = newCages;
    },
    thermometer: (fpuzzlesThermos) => {
      const newPaths = deepCopy(newEditorHistory.paths);
      for (const thermo of fpuzzlesThermos) {
        for (const line of thermo.lines) {
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'Thermo'));
        }
      }
      newEditorHistory.paths = newPaths;
    },
    arrow: (fpuzzleArrows) => {
      const newPaths = deepCopy(newEditorHistory.paths);
      for (const arrow of fpuzzleArrows) {
        for (const lines of arrow.lines) {
          const positions = positionsFromStringPositions(lines);
          newPaths.push(emptyPath(positions, 'Arrow'));
        }
        const bulbPositions = positionsFromStringPositions(arrow.cells);
        if (bulbPositions.length > 1) {
          newPaths.push(emptyPath(bulbPositions, 'Pill'));
        }
      }
      newEditorHistory.paths = newPaths;
    },
    author: () => {},
    betweenline: (fpuzzleBetweenLines) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const betweenLine of fpuzzleBetweenLines) {
        for (const line of betweenLine.lines) {
          // Make a line
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'Between'));
        }
      }

      newEditorHistory.paths = newPaths;
    },
    extraregion: (fpuzzleExtraRegions) => {
      const newRegions = deepCopy(newEditorHistory.regions);

      for (const region of fpuzzleExtraRegions) {
        const positions = positionsFromStringPositions(region.cells);
        newRegions.push(emptyRegion(positions, 'Extra'));
      }

      newEditorHistory.regions = newRegions;
    },
    cage: (fpuzzleCages) => {
      const newCages = deepCopy(newEditorHistory.extendedcages);
      for (const fpuzzleCage of fpuzzleCages) {
        const positions = positionsFromStringPositions(fpuzzleCage.cells);
        newCages.push({
          ...emptyCage(positions),
          text: fpuzzleCage.value ?? null,
          color: closestColor(fpuzzleCage.outlineC)
        });
      }
      newEditorHistory.extendedcages = newCages;
    },
    circle: (fpuzzleCircles) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);
      const newCellclues = deepCopy(newEditorHistory.cellclues);
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const circle of fpuzzleCircles) {
        let positions = positionsFromStringPositions(circle.cells);
        if (circle.cells.length > 1) {
          if (positions.length > 2) {
            if (positions.length > 2) {
              positions = [
                positions[0],
                positions.find(
                  (p) => p.row !== positions[0].row && p.column !== positions[0].column
                ) as Position
              ];
            }
          }

          newBorderclues.push({
            type: undefined,
            shape: 'Circle',
            color: circle.baseC === '#FFFFFF' ? 'White' : closestColor(circle.baseC),
            positions: positions as [Position, Position],
            radius: Math.floor(circle.width * 50),
            text: circle.value ?? undefined
          });
        } else if (circle.cells.length === 1) {
          newPaths.push({
            type: undefined,
            arrow: false,
            color: closestColor(circle.outlineC),
            fill: circle.baseC === '#FFFFFF' ? 'Hollow' : 'Solid',
            form: 'Round',
            positions: positions,
            width: Math.floor(circle.width * 100),
            uniqueDigits: undefined
          });

          if (circle.baseC !== '#FFFFFF' && circle.baseC !== circle.outlineC) {
            // Add an inner circle
            newPaths.push({
              type: undefined,
              arrow: false,
              color: closestColor(circle.baseC),
              fill: 'Solid',
              form: 'Round',
              positions: positions,
              width: Math.min(Math.floor(circle.width * 100) - 3),
              uniqueDigits: undefined
            });
          }

          if (circle.value && circle.value !== '') {
            let size: CellClueSize = 'Medium';
            if (circle.width < 0.25) size = 'XSmall';
            else if (circle.width < 0.5) size = 'Small';

            newCellclues.push({
              position: positions[0],
              type: undefined,
              text: circle.value,
              location: 'Center',
              size: size,
              symbol: undefined,
              rotation: undefined,
              color: undefined
            });
          }
        }
      }

      newEditorHistory.paths = newPaths;
      newEditorHistory.borderclues = newBorderclues;
      newEditorHistory.cellclues = newCellclues;
    },
    clock: () => {},
    clone: (fpuzzleClones) => {
      const newRegions = deepCopy(newEditorHistory.regions);

      for (const region of fpuzzleClones) {
        const positions = positionsFromStringPositions(region.cells);
        newRegions.push(emptyRegion(positions, 'Clone'));

        const clonePositions = positionsFromStringPositions(region.cloneCells);
        newRegions.push(emptyRegion(clonePositions, 'Clone'));
      }

      newEditorHistory.regions = newRegions;
    },
    difference: (fpuzzleDifferences) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);
      for (const difference of fpuzzleDifferences) {
        const positions = positionsFromStringPositions(difference.cells);
        newBorderclues.push({
          ...emptyBorderClue(positions as [Position, Position], 'KropkiWhite'),
          text: difference.value ?? undefined
        });
      }
      newEditorHistory.borderclues = newBorderclues;
    },
    disabledlogic: () => {},
    disjointgroups: (hasDijointGroups) => {
      if (!hasDijointGroups) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      newFlags.push('DisjointSets');
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    even: (fpuzzleEvens) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const even of fpuzzleEvens) {
        const position = positionFromStringPosition(even.cell);
        newPaths.push(emptyPath([position], 'Even'));
      }

      newEditorHistory.paths = newPaths;
    },
    grid: (fpuzzleGrid) => {
      const newGivens = deepCopy(newEditorHistory.givens);
      const newEditorColors = deepCopy(newEditorHistory.colors);

      fpuzzleGrid.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (cell.given && cell.value) {
            newGivens[rowIndex + offsets.top][columnIndex + offsets.left] = String(cell.value);
          }
          if (cell.c) {
            newEditorColors[rowIndex + offsets.top][columnIndex + offsets.left] = closestColor(
              cell.c
            );
          }
          // TODO: handle regions, also if it is like 6x6 and regions are not defined
        });
      });

      newEditorHistory.givens = newGivens;
      newEditorHistory.colors = newEditorColors;
    },
    line: (fpuzzleLines) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const lines of fpuzzleLines) {
        const color = closestColor(lines.outlineC);
        for (const line of lines.lines) {
          const positions = positionsFromStringPositions(line);

          newPaths.push({
            type: undefined,
            arrow: false,
            color,
            fill: 'Solid',
            form: 'Round',
            positions,
            width: Math.floor(lines.width * 50),
            uniqueDigits: undefined
          });
        }
      }

      newEditorHistory.paths = newPaths;
    },
    littlekillersum: (fpuzzleLittleKillerSums) => {
      const newCellClues = deepCopy(newEditorHistory.cellclues);
      const directionToType: Record<
        NonNullable<FPuzzlesJson['littlekillersum']>[0]['direction'],
        CellClueType
      > = {
        UR: 'LittleKillerNE',
        DR: 'LittleKillerSE',
        DL: 'LittleKillerSW',
        UL: 'LittleKillerNW'
      };

      for (const killerSum of fpuzzleLittleKillerSums) {
        newCellClues.push({
          ...emptyCellClue(
            positionFromStringPosition(killerSum.cell),
            directionToType[killerSum.direction]
          ),
          text: killerSum.value ?? undefined
        });
      }

      newEditorHistory.cellclues = newCellClues;
    },
    minimum: (fpuzzleMinimums) => {
      const newCellClues = deepCopy(newEditorHistory.cellclues);
      //const newEditorColors = deepCopy(newEditorHistory.editorcolors);

      for (const minimum of fpuzzleMinimums) {
        const position = positionFromStringPosition(minimum.cell);
        newCellClues.push(emptyCellClue(position, 'Minimum'));
      }

      newEditorHistory.cellclues = newCellClues;
      //newEditorHistory.editorcolors = newEditorColors;
    },
    maximum: (fpuzzleMaximums) => {
      const newCellClues = deepCopy(newEditorHistory.cellclues);
      //const newEditorColors = deepCopy(newEditorHistory.editorcolors);

      for (const maximum of fpuzzleMaximums) {
        const position = positionFromStringPosition(maximum.cell);
        newCellClues.push(emptyCellClue(position, 'Maximum'));
      }

      newEditorHistory.cellclues = newCellClues;
      //newEditorHistory.editorcolors = newEditorColors;
    },
    negative: (fpuzzleNegatives) => {
      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      for (const negative of fpuzzleNegatives) {
        if (negative === 'ratio') {
          newFlags.push('NegativeBlack');
          const flagIndex = newFlags.indexOf('Nonconsecutive');
          if (flagIndex !== -1) {
            newFlags.splice(flagIndex, 1, 'NegativeWhite');
          }
        } else if (negative === 'xv') {
          newFlags.push('NegativeX', 'NegativeV');
        }
      }
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    nonconsecutive: (hasNonconsecutive) => {
      if (!hasNonconsecutive) return;

      const newFlags = [...(newEditorHistory.logic.flags ?? [])];
      if (newFlags.indexOf('NegativeBlack')) {
        newFlags.push('NegativeWhite');
      } else {
        newFlags.push('Nonconsecutive');
      }
      newEditorHistory.logic = { ...deepCopy(newEditorHistory.logic), flags: newFlags };
    },
    odd: (fpuzzleOdds) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const odd of fpuzzleOdds) {
        const position = positionFromStringPosition(odd.cell);
        newPaths.push(emptyPath([position], 'Odd'));
      }

      newEditorHistory.paths = newPaths;
    },
    palindrome: (fpuzzlePalindromes) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const palindrome of fpuzzlePalindromes) {
        for (const line of palindrome.lines) {
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'Palindrome'));
        }
      }

      newEditorHistory.paths = newPaths;
    },
    quadruple: (fpuzzleQuadruples) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);

      for (const quadruple of fpuzzleQuadruples) {
        const positions = positionsFromStringPositions(quadruple.cells);
        const firstPosition = positions[0];
        const secondPosition = positions.find(
          (p) => p.row !== firstPosition.row && p.column !== firstPosition.column
        ) as Position;
        newBorderclues.push({
          ...emptyBorderClue([firstPosition, secondPosition], 'Quadruple'),
          text: quadruple.values.join(',')
        });
      }

      newEditorHistory.borderclues = newBorderclues;
    },
    ratio: (fpuzzleRatios) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);

      for (const ratio of fpuzzleRatios) {
        const positions = positionsFromStringPositions(ratio.cells);
        newBorderclues.push({
          ...emptyBorderClue(positions as [Position, Position], 'KropkiBlack'),
          text: ratio.value ?? undefined
        });
      }

      newEditorHistory.borderclues = newBorderclues;
    },
    rectangle: (fpuzzleRectangles) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);
      const newCellclues = deepCopy(newEditorHistory.cellclues);
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const rectangle of fpuzzleRectangles) {
        const diamond =
          ((rectangle.angle ?? 0) + 180) % 90 >= 23 && ((rectangle.angle ?? 0) + 180) % 90 <= 67;

        let positions = positionsFromStringPositions(rectangle.cells);
        if (rectangle.cells.length > 1) {
          if (positions.length > 2) {
            positions = [
              positions[0],
              positions.find(
                (p) => p.row !== positions[0].row && p.column !== positions[0].column
              ) as Position
            ];
          }

          newBorderclues.push({
            type: undefined,
            shape: diamond ? 'Diamond' : 'Square',
            color: rectangle.baseC === '#FFFFFF' ? 'White' : closestColor(rectangle.baseC),
            positions: positions as [Position, Position],
            radius: Math.floor(rectangle.width * (diamond ? 70.7 : 50)),
            text: rectangle.value ?? undefined
          });
        } else if (rectangle.cells.length === 1) {
          newPaths.push({
            type: undefined,
            arrow: false,
            color: closestColor(rectangle.outlineC),
            fill: rectangle.baseC === '#FFFFFF' ? 'Hollow' : 'Solid',
            form: diamond ? 'Diamond' : 'Square',
            positions: positions,
            width: Math.floor(rectangle.width * (diamond ? 141.4 : 100)),
            uniqueDigits: undefined
          });

          if (rectangle.baseC !== '#FFFFFF' && rectangle.baseC !== rectangle.outlineC) {
            // Add an inner box
            newPaths.push({
              type: undefined,
              arrow: false,
              color: closestColor(rectangle.baseC),
              fill: 'Solid',
              form: diamond ? 'Diamond' : 'Square',
              positions: positions,
              width: Math.min(Math.floor(rectangle.width * 100) - 3, 0),
              uniqueDigits: undefined
            });
          }

          if (rectangle.value && rectangle.value !== '') {
            let size: CellClueSize = 'Medium';
            if (rectangle.width < 0.25) size = 'XSmall';
            else if (rectangle.width < 0.5) size = 'Small';

            newCellclues.push({
              position: positions[0],
              type: undefined,
              text: rectangle.value,
              location: 'Center',
              size: size,
              symbol: undefined,
              rotation: undefined,
              color: undefined
            });
          }
        }
      }

      newEditorHistory.paths = newPaths;
      newEditorHistory.borderclues = newBorderclues;
      newEditorHistory.cellclues = newCellclues;
    },
    regionSumLine: (fpuzzleRegionSums) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const regionSum of fpuzzleRegionSums) {
        for (const line of regionSum.lines) {
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'EqualSum'));
        }
      }

      newEditorHistory.paths = newPaths;
    },
    renban: (fpuzzleRenbans) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const renban of fpuzzleRenbans) {
        for (const line of renban.lines) {
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'Renban'));
        }
      }

      newEditorHistory.paths = newPaths;
    },
    sandwichsum: (fpuzzleSandwichSum) => {
      const newCellClues = deepCopy(newEditorHistory.cellclues);

      for (const sandwichSum of fpuzzleSandwichSum) {
        const position = positionFromStringPosition(sandwichSum.cell);
        // f-puzzle uses "-" if no value is present
        newCellClues.push({
          ...emptyCellClue(position, 'Sandwich'),
          text: sandwichSum.value ?? '-'
        });
      }

      newEditorHistory.cellclues = newCellClues;
    },
    solution: (fpuzzleSolution) => {
      const newSolution = deepCopy(newGameHistory.values);

      for (let rowIndex = 0; rowIndex < fpuzzle.size; rowIndex++) {
        for (let columnIndex = 0; columnIndex < fpuzzle.size; columnIndex++) {
          newSolution[rowIndex + offsets.top][columnIndex + offsets.left] = String(
            fpuzzleSolution[fpuzzle.size * rowIndex + columnIndex]
          );
        }
      }

      newGameHistory.values = newSolution;
    },
    'sumdot(intersection)': () => {},
    text: (fpuzzleText) => {
      const newCellclues = deepCopy(newEditorHistory.cellclues);
      const newBorderclues = deepCopy(newEditorHistory.borderclues);

      for (const text of fpuzzleText) {
        const positions = positionsFromStringPositions(text.cells);
        if (text.angle == null && text.cells.length === 1) {
          newCellclues.push({
            position: positions[0],
            type: undefined,
            text: text.value,
            location: 'Center',
            size: 'Medium',
            symbol: undefined,
            rotation: undefined,
            color: undefined
          });
        } /*if (text.angle == null)*/ else {
          const position1 = positions[0];
          let position2 = positions[1];
          if (positions.length > 2) {
            position2 = positions.find(
              (p) => p.row !== position1.row && p.column !== position1.column
            ) as Position;
          }
          newBorderclues.push({
            type: undefined,
            shape: 'Circle',
            color: undefined,
            positions: [position1, position2],
            radius: 20,
            text: text.value
          });
        }
      }

      newEditorHistory.cellclues = newCellclues;
      newEditorHistory.borderclues = newBorderclues;
    },
    truecandidatesoptions: () => {},
    whispers: (fpuzzleWhispers) => {
      const newPaths = deepCopy(newEditorHistory.paths);

      for (const whisper of fpuzzleWhispers) {
        for (const line of whisper.lines) {
          const positions = positionsFromStringPositions(line);
          newPaths.push(emptyPath(positions, 'Whisper'));
        }
      }

      newEditorHistory.paths = newPaths;
    },
    xv: (fpuzzleXVs) => {
      const newBorderclues = deepCopy(newEditorHistory.borderclues);

      for (const xv of fpuzzleXVs) {
        const positions = positionsFromStringPositions(xv.cells);
        newBorderclues.push(
          emptyBorderClue(positions as [Position, Position], ('Xv' + xv.value) as BorderClueType)
        );
      }

      newEditorHistory.borderclues = newBorderclues;
    }
  };
  /* eslint-enable @typescript-eslint/no-empty-function */
  /* eslint-enable @typescript-eslint/no-unused-vars */

  for (const [clue, value] of Object.entries(fpuzzle)) {
    const handler = handlers[clue as keyof FPuzzlesJson] as (object: typeof value) => void;
    handler?.(value);
  }

  gameHistory.set(newGameHistory);
  editorHistory.set(newEditorHistory);
}
