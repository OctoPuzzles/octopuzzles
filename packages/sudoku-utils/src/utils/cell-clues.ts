import type {
  Position,
  CellClueType,
  Cellclue,
  CellClueLocation,
  CellClueSize,
  SymbolType,
  Rotation,
  Color,
  CellValues,
  EditorHistoryStep
} from '@octopuzzles/models';

export function emptyCellClue(position: Position, type?: CellClueType): Cellclue {
  return {
    type,
    position: position,
    location: undefined,
    text: undefined,
    size: undefined,
    symbol: undefined,
    rotation: undefined,
    color: undefined,
    nonStandard: undefined
  };
}

export function cellClueDefaults(type?: CellClueType | 'CUSTOM' | null): {
  text: string;
  location: CellClueLocation;
  size: CellClueSize;
  symbol: SymbolType | 'NONE';
  rotation: Rotation;
  color: Color;
  nonStandard: boolean;
} {
  switch (type) {
    case 'LittleKillerNW':
    case 'LittleKillerNE':
    case 'LittleKillerSE':
    case 'LittleKillerSW':
    case 'Sandwich':
    case 'Skyscraper':
    case 'XSum':
    case 'NumberedRoom':
      return {
        text: '',
        location: 'Center',
        size: 'Medium',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Black',
        nonStandard: false
      };
    case 'Maximum':
    case 'Minimum':
      return {
        text: '',
        location: 'Center',
        size: 'Small',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Gray',
        nonStandard: false
      };
    default:
      return {
        text: '',
        location: 'TopLeft',
        size: 'Small',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Black',
        nonStandard: false
      };
  }
}

export function getCellCluesToDraw(clue: Cellclue): Cellclue[] {
  const defaultSettings = cellClueDefaults(clue.type);

  const drawClues: Cellclue[] = [
    {
      position: clue.position,
      type: clue.type,
      text: clue.text ?? defaultSettings.text,
      location: clue.location ?? defaultSettings.location,
      size: clue.size ?? defaultSettings.size,
      symbol:
        clue.symbol ?? (defaultSettings.symbol !== 'NONE' ? defaultSettings.symbol : undefined),
      rotation: clue.rotation ?? defaultSettings.rotation,
      color: clue.color ?? defaultSettings.color
    }
  ];
  switch (clue.type) {
    case 'Maximum':
    case 'Minimum': {
      const partial: Cellclue = {
        position: clue.position,
        type: undefined,
        text: undefined,
        location: undefined,
        size: undefined,
        symbol: clue.type === 'Minimum' ? 'InvertedArrowhead' : 'Arrowhead',
        color: clue.color ?? defaultSettings.color
      };
      drawClues.push({ ...partial, rotation: 'North' });
      drawClues.push({ ...partial, rotation: 'East' });
      drawClues.push({ ...partial, rotation: 'South' });
      drawClues.push({ ...partial, rotation: 'West' });
      break;
    }
    case 'LittleKillerNW': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'NorthWest',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerNE': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'NorthEast',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerSE': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'SouthEast',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerSW': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'SouthWest',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
  }

  return drawClues;
}

export function verifyCellClue(
  cellclue: Cellclue,
  solution: CellValues,
  clues: EditorHistoryStep
): Position[] {
  if (!(cellclue.nonStandard ?? false)) {
    switch (cellclue.type) {
      case 'LittleKillerNW':
      case 'LittleKillerNE':
      case 'LittleKillerSE':
      case 'LittleKillerSW': {
        if (cellclue.text != null) {
          const target = parseInt(cellclue.text);
          let rowStep = 0;
          let colStep = 0;
          if (cellclue.type === 'LittleKillerNW') {
            rowStep = -1;
            colStep = -1;
          } else if (cellclue.type === 'LittleKillerNE') {
            rowStep = -1;
            colStep = 1;
          } else if (cellclue.type === 'LittleKillerSE') {
            rowStep = 1;
            colStep = 1;
          } else if (cellclue.type === 'LittleKillerSW') {
            rowStep = 1;
            colStep = -1;
          }

          let total = 0;
          const cells: Position[] = [];
          for (
            let i = cellclue.position.row + rowStep, j = cellclue.position.column + colStep;
            i >= (clues.dimensions.margins?.top ?? 0) &&
            i < clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0) &&
            j >= (clues.dimensions.margins?.left ?? 0) &&
            j < clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0);
            i += rowStep, j += colStep
          ) {
            const cell = solution[i][j];
            if (cell.value == null) {
              return [];
            }
            total += cell.value;
            cells.push({ row: i, column: j });
          }

          if (total !== target) {
            return [cellclue.position, ...cells];
          }
        }
        break;
      }
      case 'Sandwich':
      case 'Skyscraper':
      case 'XSum':
      case 'NumberedRoom': {
        if (cellclue.text != null) {
          const target = parseFloat(cellclue.text);
          let rowStep = 0;
          let colStep = 0;
          if (cellclue.position.row === (clues.dimensions.margins?.top ?? 0) - 1) {
            rowStep = 1;
          } else if (
            cellclue.position.row ===
            clues.dimensions.rows - (clues.dimensions.margins?.bottom ?? 0)
          ) {
            rowStep = -1;
          }
          if (cellclue.position.column === (clues.dimensions.margins?.left ?? 0) - 1) {
            colStep = 1;
          } else if (
            cellclue.position.column ===
            clues.dimensions.columns - (clues.dimensions.margins?.right ?? 0)
          ) {
            colStep = -1;
          }
          if (rowStep === 0 && colStep === 0) {
            break;
          }

          let i = cellclue.position.row + rowStep;
          let j = cellclue.position.column + colStep;
          let key = 0;
          if (cellclue.type === 'XSum' || cellclue.type === 'NumberedRoom') {
            let cell = solution[i][j];
            if (cell.value == null) {
              break;
            } else {
              key = cell.value;
              if (cellclue.type === 'NumberedRoom') {
                i += (key - 1) * rowStep;
                j += (key - 1) * colStep;
                cell = solution[i][j];
                if (cell.value == null) {
                  break;
                } else {
                  if (cell.value !== key) {
                    return [cellclue.position];
                  }
                }
              }
            }
          }

          let total = 0;
          let count = 0;
          const cells: Position[] = [];
          for (
            ;
            i >= (clues.dimensions.margins?.top ?? 0) &&
            i < (clues.dimensions.margins?.top ?? 0) + clues.dimensions.rows &&
            j >= (clues.dimensions.margins?.left ?? 0) &&
            i < (clues.dimensions.margins?.left ?? 0) + clues.dimensions.columns;
            i += rowStep, j += colStep
          ) {
            const cell = solution[i][j];
            if (cell.value != null) {
              const v = cell.value;
              if (cellclue.type === 'Skyscraper') {
                if (v > key) {
                  ++total;
                  key = v;
                }
              } else if (cellclue.type === 'Sandwich') {
                if (v === 1 || v === 9) {
                  if (key === 0) {
                    key = v;
                  } else {
                    ++count;
                    cells.push({ row: i, column: j });
                    break;
                  }
                } else if (key !== 0) {
                  total += v;
                } else {
                  continue;
                }
              } else if (cellclue.type === 'XSum') {
                total += v;
              }
              ++count;
            }
            if (cellclue.type !== 'Sandwich' || key !== 0) {
              cells.push({ row: i, column: j });
            }

            if (cellclue.type === 'XSum' && cells.length === key) {
              break;
            }
          }

          if (count > 0 && count === cells.length && total !== target) {
            return [cellclue.position, ...cells];
          }
        }
        break;
      }
      case 'Maximum':
      case 'Minimum': {
        const cell = solution[cellclue.position.row][cellclue.position.column];
        if (cell.digits != null) {
          const nbrCells = [];
          for (const step of [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
          ]) {
            const row = cellclue.position.row + step.x;
            const column = cellclue.position.column + step.y;
            if (row >= 0 && row < solution.length && column >= 0 && column < solution[0].length) {
              if (solution[row][column].digits != null) {
                nbrCells.push({ row, column });
              }
            }
          }

          const invalidCells = nbrCells.filter((c) => {
            return cell.digits?.some((v) =>
              solution[c.row][c.column].digits?.some((u) =>
                cellclue.type === 'Maximum' ? v < u : u < v
              )
            );
          });
          if (invalidCells.length > 0) {
            return [cellclue.position, ...invalidCells];
          }
          break;
        }
      }
    }
  }
  return [];
}
