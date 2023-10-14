import type {
  Position,
  BorderClueType,
  Borderclue,
  Shape,
  Color,
  CellValues
} from '@octopuzzles/models';
import { Digits } from '@octopuzzles/models';

export function emptyBorderClue(
  positions: [Position, Position],
  type?: BorderClueType
): Borderclue {
  return {
    type,
    positions,
    color: undefined,
    radius: undefined,
    text: undefined,
    nonStandard: undefined
  };
}

export function borderClueDefaults(type?: BorderClueType | 'CUSTOM' | null): {
  shape: Shape;
  color: Color | 'NONE';
  radius: number;
  text: string;
  nonStandard: boolean;
} {
  switch (type) {
    case 'KropkiWhite':
    case 'KropkiBlack':
      return {
        shape: 'Circle',
        color: type === 'KropkiWhite' ? 'White' : 'Black',
        radius: 10,
        text: '',
        nonStandard: false
      };
    case 'XvX':
    case 'XvV':
      return {
        shape: 'Circle',
        color: 'NONE',
        radius: 20,
        text: String(type)[3],
        nonStandard: false
      };
    case 'Inequality':
      return { shape: 'Circle', color: 'NONE', radius: 20, text: '<', nonStandard: false };
    case 'Quadruple':
      return { shape: 'Circle', color: 'White', radius: 20, text: '', nonStandard: false };
    case 'Border':
      return { shape: 'Line', color: 'Black', radius: 50, text: '', nonStandard: false };
    default:
      return { shape: 'Circle', color: 'NONE', radius: 10, text: '', nonStandard: false };
  }
}

export function getBorderCluesToDraw(clue: Borderclue): Borderclue[] {
  const defaultSettings = borderClueDefaults(clue.type);
  let text: string = clue.text ?? '';
  switch (clue.type) {
    case 'XvX':
      text = 'X';
      break;
    case 'XvV':
      text = 'V';
      break;
    case 'Inequality':
      if (clue.positions[0].column < clue.positions[1].column) {
        text = '\u003c';
      } else if (clue.positions[0].column > clue.positions[1].column) {
        text = '\u003e';
      } else if (clue.positions[0].row < clue.positions[1].row) {
        text = '\u2227';
      } else {
        text = '\u2228';
      }
      break;
  }
  return [
    {
      positions: clue.positions,
      type: clue.type,
      shape: clue.shape ?? defaultSettings.shape,
      color: clue.color ?? (defaultSettings.color !== 'NONE' ? defaultSettings.color : undefined),
      radius: clue.radius ?? defaultSettings.radius,
      text
    }
  ];
}

/*Checks the inputted digits against the standard constraint logic for the border clue
and returns any cells that have errors*/
export function verifyBorderClue(borderclue: Borderclue, solution: CellValues): Position[] {
  let isValid = true;

  if (!(borderclue.nonStandard ?? false)) {
    if (borderclue.type === 'Quadruple') {
      if (borderclue.text != null) {
        const position1 = borderclue.positions[0];
        const position2 = borderclue.positions[1];
        const cells = [
          position1,
          { row: position1.row, column: position2.column },
          position2,
          { row: position2.row, column: position1.column }
        ];
        const digits: string[] = [];
        if (
          cells.every((pos) => {
            const cell = solution[pos.row][pos.column];
            if (cell.digits == null) {
              return false;
            }
            digits.push(...cell.digits);
            return true;
          })
        ) {
          isValid = borderclue.text.split(',').every((v) => digits.includes(v));
          if (!isValid) {
            return cells;
          }
        }
      }
    } else {
      const position1 = borderclue.positions[0];
      const position2 = borderclue.positions[1];
      const cell1 = solution[position1.row][position1.column];
      const cell2 = solution[position2.row][position2.column];

      if (cell1.digits == null || cell2.digits == null) return [];

      if (borderclue.type === 'XvX' || borderclue.type === 'XvV') {
        const x = cell1.value;
        const y = cell2.value;
        if (x != null && y != null) {
          isValid = x + y === (borderclue.type === 'XvX' ? 10 : 5);
        }
      } else if (
        !cell1.digits.every(
          (v) =>
            cell2.digits?.every((u) => {
              const x = Digits.indexOf(v);
              const y = Digits.indexOf(u);
              switch (borderclue.type) {
                case 'Inequality':
                  isValid = x < y;
                  break;
                case 'KropkiBlack':
                  isValid = x === 2 * y || y === 2 * x;
                  break;
                case 'KropkiWhite':
                  isValid = Math.abs(x - y) === 1;
                  break;
              }
            }) !== true
        )
      ) {
        isValid = false;
      }
    }
  }

  if (!isValid) {
    return borderclue.positions;
  } else {
    return [];
  }
}
