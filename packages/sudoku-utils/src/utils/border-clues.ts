import type {
  Position,
  BorderClueType,
  Borderclue,
  Shape,
  Color,
  CellValues,
  Digit
} from '@octopuzzles/models';
import { digitValue, isConsecutive, isInRatio } from './general';

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
  if (borderclue.nonStandard === true) {
    return [];
  }

  let isValid = true;

  if (borderclue.type === 'Quadruple') {
    if (borderclue.text != null) {
      const position1 = borderclue.positions[0];
      const position2 = borderclue.positions[1];
      const positions = [
        position1,
        { row: position1.row, column: position2.column },
        position2,
        { row: position2.row, column: position1.column }
      ];

      const digits: string[] = [];
      const findDigits = (pos: Position): boolean => {
        const cell = solution[pos.row][pos.column];
        if (cell.digits == null) {
          return false;
        }
        digits.push(...cell.digits);
        return true;
      };

      if (positions.every(findDigits)) {
        isValid = borderclue.text.split(',').every((digit) => digits.includes(digit));
        if (!isValid) {
          return positions;
        }
      }
    }
  } else {
    const position1 = borderclue.positions[0];
    const position2 = borderclue.positions[1];
    const cell1 = solution[position1.row][position1.column];
    const cell2 = solution[position2.row][position2.column];
    const digits1 = cell1.digits;
    const digits2 = cell1.digits;

    if (digits1 == null || digits2 == null) return [];

    if (borderclue.type === 'XvX' || borderclue.type === 'XvV') {
      const value1 = cell1.value;
      const value2 = cell2.value;
      if (value1 != null && value2 != null) {
        isValid = value1 + value2 === (borderclue.type === 'XvX' ? 10 : 5);
      }
    } else {
      const checkConstraint = (digit1: Digit, digit2: Digit): boolean => {
        switch (borderclue.type) {
          case 'Inequality':
            return digitValue(digit1) < digitValue(digit2);
          case 'KropkiBlack':
            return isInRatio(digit1, digit2, 2);
          case 'KropkiWhite':
            return isConsecutive(digit1, digit2);
        }
        return true;
      };

      isValid = digits1.every((digit1) =>
        digits2.every((digit2) => checkConstraint(digit1, digit2))
      );
    }
  }

  if (!isValid) {
    return borderclue.positions;
  } else {
    return [];
  }
}
